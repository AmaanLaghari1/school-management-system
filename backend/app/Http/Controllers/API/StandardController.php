<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Standard;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class StandardController extends Controller
{
    //
    public function index(){
        try {
            $records = Standard::with(['school'])->get();
            return response()->json($records, 200);
        }
        catch (\Exception $e) {
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function show($id){
        try {
            $record = Standard::with(['school'])->find($id);
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
                'school_id' => 'required',
                'standard_name' => 'required',
                'section' => 'required',
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                    'error_message' => $validation->errors()->first()
                ], 403);
            }

            $data = [
                "SCHOOL_ID" => $request->school_id,
                "STANDARD_NAME" => $request->standard_name,
                "SECTION" => $request->section,
                "REMARKS" => $request->remarks ?? ''
            ];

            DB::beginTransaction();
            $newRecord = Standard::create($data);
            DB::commit();
            return response()->json(['message' => 'Record created successfully'], 200);
        }
        catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Standard store error: ' . $e->getMessage());
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id){
        try{
            $record = Standard::find($id);

            if(!$record){
                return response()->json(['error_message' => 'Record not found!'], 401);
            }

            $validation = Validator::make($request->all(), [
                'school_id' => 'required',
                'standard_name' => 'required',
                'section' => 'required',
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                    'error_message' => $validation->errors()->first()
                ], 403);
            }

            $data = [
                "SCHOOL_ID" => $request->school_id,
                "STANDARD_NAME" => $request->standard_name,
                "SECTION" => $request->section,
                "REMARKS" => $request->remarks ?? ''
            ];

            DB::beginTransaction();
            $record->update($data);
            DB::commit();

            return response()->json(['message' => 'Record updated successfully'], 200);
        }
        catch (\Exception $e){
            DB::rollBack();
            \Log::error('Standard update error: ' . $e->getMessage());
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id){
        try {
            $record = Standard::find($id);
            if(!$record){
                return response()->json(['error_message' => 'Record not found!'], 401);
            }
            DB::beginTransaction();
            $record->delete();
            DB::commit();
        }
        catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Standard delete error: ' . $e->getMessage());
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function getBySchoolId($schoolId){
        try {
            $record = Standard::with(['school'])->where('SCHOOL_ID', $schoolId)->get();
            if(!$record){
                return response()->json(['error_message' => 'Record not found!'], 401);
            }
            return response()->json($record, 200);
        }
        catch (\Exception $e) {
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }
}
