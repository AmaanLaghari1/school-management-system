<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Enrolment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class EnrolmentController extends Controller
{
    //
    public function index(){
        try {
            $record = Enrolment::with(['student', 'session', 'standard', 'standard.school'])->get();

            return response()->json($record, 200);
        }
        catch (\Exception $e) {
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function show($id){
        try {
            $record = Enrolment::with(['student', 'session', 'standard'])->find($id);

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
                'session_id' => 'required',
                'student_id' => 'required',
                'standard_id' => 'required',
                'detail' => 'required'
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                    'error_message' => $validation->errors()->first()
                ], 403);
            }

            $data = [
                'SESSION_ID' => $request->session_id,
                'STANDARD_ID' => $request->standard_id,
                'STUDENT_ID' => $request->student_id,
                'DETAIL' => $request->detail
            ];

            DB::beginTransaction();
            $newRecord = Enrolment::create($data);

            if($newRecord){
                DB::commit();
                return response()->json(['message' => 'Enrolment created successfully'], 200);
            }
        }
        catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id){
        try {
            $validation = Validator::make($request->all(), [
                'session_id' => 'required',
                'student_id' => 'required',
                'standard_id' => 'required',
                'detail' => 'required'
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                    'error_message' => $validation->errors()->first()
                ], 403);
            }

            $record = Enrolment::find($id);

            if(!$record){
                return response()->json(['error_message' => 'Record not found!'], 401);
            }

            $data = [
                'SESSION_ID' => $request->session_id,
                'STUDENT_ID' => $request->student_id,
                'STANDARD_ID' => $request->standard_id,
                'DETAIL' => $request->detail
            ];

            DB::beginTransaction();
            if($record->update($data)){
                DB::commit();
                return response()->json(['message' => 'Enrolment updated successfully'], 200);
            }
        }
        catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id){
        try {
            $record = Enrolment::find($id);

            if(!$record){
                return response()->json(['error_message' => 'Record not found!'], 401);
            }

            DB::beginTransaction();
            if($record->delete()){
                DB::commit();
                return response()->json(['message' => 'Enrolment deleted successfully'], 200);
            }
        }
        catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function getFilteredEnrolments(Request $request){
        try {
            $validation = Validator::make($request->all(), [
                'session_id' => 'required',
                'school_id' => 'required',
                'standard_id' => 'required',
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                    'error_message' => $validation->errors()->first()
                ], 403);
            }

            $active = $request->active ? 1 : 0;

            $records = Enrolment::with(['student', 'session', 'standard', 'standard.school'])
                ->where('SESSION_ID', $request->session_id)
                ->where('STANDARD_ID', $request->standard_id)
                ->where('ACTIVE', $active)
                ->get();

            return response()->json($records, 200);
        }
        catch (\Exception $e) {
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }
}
