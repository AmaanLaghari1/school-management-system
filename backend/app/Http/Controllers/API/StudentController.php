<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    //
    public function index(){
        try {
            $records = Student::with(['school', 'guardian'])->get();
            return response()->json($records, 200);
        }
        catch (\Exception $e) {
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function show($id){
        try {
            $record = Student::find($id);

            if(!$record){
                return response()->json(['error_message' => 'Record not found!'], 401);
            }

            return response()->json($record, 200);
        }
        catch (\Exception $e) {
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function getBySchoolId($schoolId){
        try {
            $record = Student::with(['school', 'guardian'])->where('SCHOOL_ID', $schoolId)->get();

            if(!$record){
                return response()->json(['error_message' => 'Record not found!'], 401);
            }

            return response()->json($record, 200);
        }
        catch (\Exception $e) {
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request){
        try {
            $validation = Validator::make($request->all(), [
                'guardian_relation_id' => 'required',
                'school_id' => 'required',
                'name' => 'required',
                'fname' => 'required',
//                'email' => 'email|nullable|unique:students,email',
//                'cnic_no' => 'required|unique:students',
//                'date_of_birth' => 'required',
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                    'error_message' => $validation->errors()->first()
                ], 403);
            }

            $data = [
                'GUARDIAN_RELATION_ID' => $request->guardian_relation_id,
                'SCHOOL_ID' => $request->school_id,
                'NAME' => $request->name,
                'FNAME' => $request->fname,
                'SURNAME' => $request->surname,
                'EMAIL' => $request->email,
                'CNIC_NO' => $request->cnic_no,
                'DATE_OF_BIRTH' => $request->date_of_birth,
                'MOBILE_NO' => $request->mobile_no??Null,
                'POSTAL_ADDRESS' => $request->postal_address??Null,
                'PERMANENT_ADDRESS' => $request->permanent_address??Null,
                'GENDER' => $request->gender??Null,
                'GUARDIAN_NAME' => $request->guardian_name??Null,
                'GUARDIAN_MOBILE_NO' => $request->guardian_mobile_no??Null,
                'GUARDIAN_EMAIL' => $request->guardian_email??Null,
                'GUARDIAN_CNIC_NO' => $request->guardian_cnic_no??Null,
                'GUARDIAN_ADDRESS' => $request->guardian_address??Null,
                'PREVIOUS_STANDARD' => $request->previous_standard??Null,
                'PREVIOUS_GR_NO' => $request->previous_gr_no??Null,
                'CURRENT_GR_NO' => $request->current_gr_no??Null,
                'TUITION_FEE' => $request->tuition_fee??Null,
                'DATE' => $request->date??Null,
                'REMARKS' => $request->remarks ?? ''
            ];

            DB::beginTransaction();
            $newRecord = Student::create($data);
            DB::commit();

            return response()->json(['message' => 'Student created successfully'], 200);
        }
        catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Student store error: ' . $e->getMessage());
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id){
        try {
            $record = Student::find($id);

            if(!$record){
                return response()->json(['error_message' => 'Record not found!'], 401);
            }

            $validation = Validator::make($request->all(), [
                'school_id' => 'required',
                'guardian_relation_id' => 'required',
                'name' => 'required',
//                'email' => 'email|nullable|unique:students,email',
                'cnic_no' => 'required',
//                'date_of_birth' => 'required',
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                    'error_message' => $validation->errors()->first()
                ], 403);
            }

            $data = [
                'GUARDIAN_RELATION_ID' => $request->guardian_relation_id,
                'SCHOOL_ID' => $request->school_id,
                'NAME' => $request->name,
                'FNAME' => $request->fname,
                'SURNAME' => $request->surname,
                'EMAIL' => $request->email,
                'CNIC_NO' => $request->cnic_no,
                'DATE_OF_BIRTH' => $request->date_of_birth,
                'MOBILE_NO' => $request->mobile_no??Null,
                'POSTAL_ADDRESS' => $request->postal_address??Null,
                'PERMANENT_ADDRESS' => $request->permanent_address??Null,
                'GENDER' => $request->gender??Null,
                'GUARDIAN_NAME' => $request->guardian_name??Null,
                'GUARDIAN_MOBILE_NO' => $request->guardian_mobile_no??Null,
                'GUARDIAN_EMAIL' => $request->guardian_email??Null,
                'GUARDIAN_CNIC_NO' => $request->guardian_cnic_no??Null,
                'GUARDIAN_ADDRESS' => $request->guardian_address??Null,
                'PREVIOUS_STANDARD' => $request->previous_standard??Null,
                'PREVIOUS_GR_NO' => $request->previous_gr_no??Null,
                'CURRENT_GR_NO' => $request->current_gr_no??Null,
                'TUITION_FEE' => $request->tuition_fee??Null,
                'DATE' => $request->date??Null,
                'ACTIVE' => $request->active ?? Null,
                'REMARKS' => $request->remarks ?? ''
            ];

            DB::beginTransaction();
            $record->update($data);
            DB::commit();

            return response()->json(['message' => 'Student updated successfully'], 200);
        }
        catch (\Exception $e){
            DB::rollBack();
            \Log::error('Student update error: ' . $e->getMessage());
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id){
        try {
            $record = Student::find($id);

            if(!$record){
                return response()->json(['error_message' => 'Record not found!'], 401);
            }

            DB::beginTransaction();
            $record->delete();
            DB::commit();
        }
        catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Student delete error: ' . $e->getMessage());
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }
}
