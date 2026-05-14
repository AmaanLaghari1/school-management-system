<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Sibling;
use Illuminate\Http\Request;
use App\Models\StudentRegistration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Services\RegistrationFormPDF;

class StudentRegistrationController extends Controller
{
    //
    public function index(){
        $record = StudentRegistration::with(['siblings', 'school', 'standard'])->get();

        return response()->json($record, 200);
    }

    public function show($id){
        try {
            $record = StudentRegistration::with(['siblings'])->find($id);

            return response()->json($record, 200);
        }
        catch (\Exception $e) {
            return response()->json([
                'message' => 'Server Error!',
                'error_message' => $e->getMessage()
            ], 500);
        }
    }

    public function uploadImg(Request $request){
        $validation = Validator::make($request->all(), [
            "profile_image" => "nullable|image|mimes:jpg,jpeg,png|max:2048", // Ensure it's an image
        ]);
        try {

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $path = Storage::disk('uploads')->put('registrations', $file);
                return response()->json(['message' => 'File uploaded successfully!', 'path' => $path]);
            }
        }
        catch (\Exception $e) {

            return response()->json(['error' => 'No file uploaded', 'error_message' => $e->getMessage()], 400);
        }

    }


    public function store(Request $request)
    {
        try {

            $validation = Validator::make($request->all(), [

                // Admission Info
                'school_id' => 'required',
                'session_id' => 'required',
                'standard_id' => 'required',

                // Student Info
                'name' => 'required|string|max:255',
                'surname' => 'required|string|max:255',
                'fname' => 'required|string|max:255',
                'mobile_no' => 'required',
                'gender' => 'required',
                'date_of_birth' => 'nullable',
                'email' => 'nullable|email',
                'permanent_address' => 'required',

                // Parent Info
                'father_cnic_no' => 'required',
                'father_occupation' => 'required',

                // Guardian Info
                'guardian_relation_id' => 'required',
                'guardian_name' => 'required',
                'guardian_cnic_no' => 'required',
                'guardian_mobile_no' => 'required',
                'guardian_address' => 'required',
                'guardian_email' => 'nullable|email',

                // Siblings
                'siblings_enrolled' => 'nullable|array',
                'siblings_enrolled.*.sibling_name' => 'required|string',
                'siblings_enrolled.*.class_and_section' => 'required|string',
                'siblings_enrolled.*.gr_no' => 'required|string',
                'student_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ])->stopOnFirstFailure();

            if ($validation->fails()) {
                return response()->json([
                    'message' => 'Validation Error!',
                    'error_message' => $validation->errors()->first()
                ], 403);
            }

            DB::beginTransaction();

            /*
            |--------------------------------------------------------------------------
            | Student Registration Data
            |--------------------------------------------------------------------------
            */

            $reqData = [

                // Admission
                'SCHOOL_ID' => $request->school_id,
                'SESSION_ID' => $request->session_id,
                'STANDARD_ID' => $request->standard_id,
                'LAST_SCHOOL_ATTENDED' => $request->last_school,

                // Student
                'NAME' => $request->name,
                'SURNAME' => $request->surname,
                'FATHER_NAME' => $request->fname,
                'MOBILE_NO' => $request->mobile_no,
                'EMAIL' => $request->email,
                'GENDER' => $request->gender,
                'DOB' => $request->date_of_birth,
                'HOME_ADDRESS' => $request->permanent_address,

                // Parent
                'FATHER_CNIC_NO' => $request->father_cnic_no,
                'FATHER_OCCUPATION' => $request->father_occupation,
                'IS_UNI_EMPLOYEE' => $request->is_uni_employee,
                'DESIGNATION' => $request->employee_designation,
                'DEPARTMENT' => $request->employee_dept,

                // Guardian
                'GUARDIAN_RELATION' => $request->guardian_relation_id,
                'GUARDIAN_NAME' => $request->guardian_name,
                'GUARDIAN_CNIC_NO' => $request->guardian_cnic_no,
                'GUARDIAN_MOBILE_NO' => $request->guardian_mobile_no,
                'GUARDIAN_EMAIL' => $request->guardian_email,
                'GUARDIAN_ADDRESS' => $request->guardian_address,
            ];

            if ($request->hasFile('student_photo')) {
                $studentPhoto = $request->file('student_photo');
                $studentPhotoName = time() . '_' . $studentPhoto->getClientOriginalName();
                $path = Storage::disk('uploads')->put('registrations', $studentPhoto);
                $studentPhotoPath = 'uploads/' . $path;
                $reqData['STUDENT_PHOTO'] = $studentPhotoPath;
            }

            /*
            |--------------------------------------------------------------------------
            | Create Student Registration
            |--------------------------------------------------------------------------
            */

            $newRecord = StudentRegistration::create($reqData);

            /*
            |--------------------------------------------------------------------------
            | Handle Siblings
            |--------------------------------------------------------------------------
            */

            if ($newRecord && $request->has('siblings_enrolled')) {

                $siblings = [];

                foreach ($request->siblings_enrolled as $sibling) {

                    $siblings[] = [

                        'REG_ID' => $newRecord->id,

                        'NAME' => $sibling['sibling_name'],
                        'CLASS_AND_SECTION' => $sibling['class_and_section'],
                        'GR_NO' => $sibling['gr_no'],

                        'CREATED_AT' => now(),
                        'UPDATED_AT' => now(),
                    ];
                }

                /*
                |--------------------------------------------------------------------------
                | Bulk Insert Siblings
                |--------------------------------------------------------------------------
                */

                if (!empty($siblings)) {
                    Sibling::insert($siblings);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Student Registration created successfully!',
                'data' => $newRecord
            ], 200);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Server Error!',
                'error_message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {

            $validation = Validator::make($request->all(), [

                // Admission Info
                'school_id' => 'required',
                'session_id' => 'required',
                'standard_id' => 'required',

                // Student Info
                'name' => 'required|string|max:255',
                'surname' => 'required|string|max:255',
                'fname' => 'required|string|max:255',
                'mobile_no' => 'required',
                'gender' => 'required',
                'date_of_birth' => 'nullable',
                'email' => 'nullable|email',
                'permanent_address' => 'required',

                // Parent Info
                'father_cnic_no' => 'required',
                'father_occupation' => 'required',

                // Guardian Info
                'guardian_relation_id' => 'required',
                'guardian_name' => 'required',
                'guardian_cnic_no' => 'required',
                'guardian_mobile_no' => 'required',
                'guardian_address' => 'required',
                'guardian_email' => 'nullable|email',

                // Siblings
                'siblings_enrolled' => 'nullable|array',
                'siblings_enrolled.*.sibling_id' => 'nullable|integer',
                'siblings_enrolled.*.sibling_name' => 'required|string',
                'siblings_enrolled.*.class_and_section' => 'required|string',
//                'siblings_enrolled.*.gr_no' => 'required|string',
//                'student_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'

            ])->stopOnFirstFailure();

            if ($validation->fails()) {
                return response()->json([
                    'message' => 'Validation Error!',
                    'error_message' => $validation->errors()->first()
                ], 403);
            }

            DB::beginTransaction();

            /*
            |--------------------------------------------------------------------------
            | Find Existing Record
            |--------------------------------------------------------------------------
            */

            $record = StudentRegistration::find($id);

            if (!$record) {
                return response()->json([
                    'message' => 'Record not found!'
                ], 404);
            }

            /*
            |--------------------------------------------------------------------------
            | Update Student Registration Data
            |--------------------------------------------------------------------------
            */

            $reqData = [

                // Admission
                'SCHOOL_ID' => $request->school_id,
                'SESSION_ID' => $request->session_id,
                'STANDARD_ID' => $request->standard_id,
                'LAST_SCHOOL_ATTENDED' => $request->last_school,

                // Student
                'NAME' => $request->name,
                'SURNAME' => $request->surname,
                'FATHER_NAME' => $request->fname,
                'MOBILE_NO' => $request->mobile_no,
                'EMAIL' => $request->email,
                'GENDER' => $request->gender,
                'DOB' => $request->date_of_birth,
                'HOME_ADDRESS' => $request->permanent_address,

                // Parent
                'FATHER_CNIC_NO' => $request->father_cnic_no,
                'FATHER_OCCUPATION' => $request->father_occupation,
                'IS_UNI_EMPLOYEE' => $request->is_uni_employee,
                'DESIGNATION' => $request->employee_designation,
                'DEPARTMENT' => $request->employee_dept,

                // Guardian
                'GUARDIAN_RELATION' => $request->guardian_relation_id,
                'GUARDIAN_NAME' => $request->guardian_name,
                'GUARDIAN_CNIC_NO' => $request->guardian_cnic_no,
                'GUARDIAN_MOBILE_NO' => $request->guardian_mobile_no,
                'GUARDIAN_EMAIL' => $request->guardian_email,
                'GUARDIAN_ADDRESS' => $request->guardian_address,
            ];

            if ($request->hasFile('student_photo')) {
                $studentPhoto = $request->file('student_photo');
                $studentPhotoName = time() . '_' . $studentPhoto->getClientOriginalName();
                $path = Storage::disk('uploads')->put('registrations', $studentPhoto);
                $studentPhotoPath = $path;
                $reqData['STUDENT_PHOTO'] = $studentPhotoPath;
                if ($record->STUDENT_PHOTO) {
                    Storage::disk('uploads')->delete($record->STUDENT_PHOTO);
                }
            }

            /*
            |--------------------------------------------------------------------------
            | Update Student Registration
            |--------------------------------------------------------------------------
            */

            $record->update($reqData);

            /*
            |--------------------------------------------------------------------------
            | Handle Siblings
            |--------------------------------------------------------------------------
            */

            $payloadSiblingIds = [];

            if ($request->has('siblings_enrolled')) {

                foreach ($request->siblings_enrolled as $sibling) {

                    // Existing sibling update
                    if (!empty($sibling['sibling_id'])) {

                        $existingSibling = Sibling::where('SIBLING_ID', $sibling['sibling_id'])
                            ->where('REG_ID', $record->REG_ID)
                            ->first();

                        if ($existingSibling) {

                            $existingSibling->update([

                                'NAME' => $sibling['sibling_name'],
                                'CLASS_AND_SECTION' => $sibling['class_and_section'],
                                'GR_NO' => $sibling['gr_no'],
                            ]);

                            $payloadSiblingIds[] = $existingSibling->SIBLING_ID;
                        }

                    } else {

                        // Create new sibling
                        $newSibling = Sibling::create([

                            'REG_ID' => $record->REG_ID,

                            'NAME' => $sibling['sibling_name'],
                            'CLASS_AND_SECTION' => $sibling['class_and_section'],
                            'GR_NO' => $sibling['gr_no'],
                        ]);

                        $payloadSiblingIds[] = $newSibling->SIBLING_ID;
                    }
                }
            }

            /*
            |--------------------------------------------------------------------------
            | Delete Removed Siblings
            |--------------------------------------------------------------------------
            */

            Sibling::where('REG_ID', $record->REG_ID)
                ->whereNotIn('SIBLING_ID', $payloadSiblingIds)
                ->delete();

            DB::commit();

            return response()->json([
                'message' => 'Student Registration updated successfully!',
                'data' => $record
            ], 200);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Server Error!',
                'error_message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id){
        try {
            $record = StudentRegistration::find($id);
            if(!$record){
                return response()->json([
                    'message' => 'Record not found!',
                ], 404);
            }

            DB::beginTransaction();
            $record->delete();
            DB::commit();

            return response()->json([
                'message' => 'Student Registration deleted successfully!',
                'data' => $record
            ], 200);
        }
        catch (\Exception $e) {
            return response()->json([
                'message' => 'Server Error!',
                'error_message' => $e->getMessage()
            ], 500);
        }
    }

    public function getByFilters(Request $request){
        try {
            $validation = Validator::make($request->all(), [
                'cnic_no' => 'required',
                'mobile_no' => 'required',
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                    'message' => 'Validation Error!',
                    'error_message' => $validation->errors()->first()
                ], 403);
            }

            $records = StudentRegistration::with(['siblings', 'school', 'standard'])
                ->where('FATHER_CNIC_NO', $request->cnic_no)
                ->where('MOBILE_NO', $request->mobile_no)
                ->get();

            return response()->json($records, 200);
        }
        catch (\Exception $e) {
            return response()->json([
                'message' => 'Server Error!',
                'error_message' => $e->getMessage()
            ], 500);
        }
    }

    public function pdf($id)
    {
        try {
            $record = StudentRegistration::with(['siblings', 'school', 'standard'])->find($id);

            if (!$record) {
                return response()->json([
                    'message' => 'Record not found!'
                ], 404);
            }

            $pdf = new RegistrationFormPDF();
            $content = $pdf->generate($record);

            return response($content, 200)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="registration-form-' . $record->REG_ID . '.pdf"');
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server Error!',
                'error_message' => $e->getMessage()
            ], 500);
        }
    }

}
