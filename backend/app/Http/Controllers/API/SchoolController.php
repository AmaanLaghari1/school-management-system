<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\School;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;


class SchoolController extends Controller
{
    //
    public function index()
    {
        try {
            return response()->json(School::all(), 200);
        }
        catch (\Exception $e) {
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request){
        try {
            $validation = Validator::make($request->all(), [
                'school_name' => 'required',
                'branch' => 'required',
                'address' => 'required',
                'email' => 'required|email',
                'contact_no_1' => 'required',
            ])->stopOnFirstFailure();

            if($validation->fails()) {
                return response()->json([
                    'error' => $validation->errors()->first()
                ], 403);
            }

            $data = [
                'SCHOOL_NAME' => $request->school_name,
                'BRANCH' => $request->branch,
                'ADDRESS' => $request->address,
                'EMAIL' => $request->email,
                'CONTACT_NO_1' => $request->contact_no_1,
                'CONTACT_NO_2' => $request->contact_no_2 ?? ''
            ];

            DB::beginTransaction();
            $newRecord = School::create($data);

            DB::commit();
            return response()->json(['message' => 'Record created successfully'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('School store error: ' . $e->getMessage());
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id){
        try {
            $validation = Validator::make(request()->all(), [
                'school_name' => 'required',
                'branch' => 'required',
                'address' => 'required',
                'email' => 'required|email',
                'contact_no_1' => 'required',
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                   'error' => $validation->errors()->first()
                ], 403);
            }

            $data = [
                'SCHOOL_NAME' => $request->school_name,
                'BRANCH' => $request->branch,
                'ADDRESS' => $request->address,
                'EMAIL' => $request->email,
                'CONTACT_NO_1' => $request->contact_no_1,
                'CONTACT_NO_2' => $request->contact_no_2??''
            ];

            $record = School::find($id);

            if($record){
                DB::beginTransaction();
                $record->update($data);
                DB::commit();
                return response()->json(['error_message' => 'Record updated successfully'], 200);
            }
            else {
                return response()->json(['error_message' => 'Record not found!'], 401);
            }

        }
        catch (\Exception $e){
            DB::rollBack();
            \Log::error('School update error: ' . $e->getMessage());
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id){
        try {
            $record = School::find($id);

            if(!$record){
                return response()->json(['error_message' => 'Record not found!'], 401);
            }

            DB::beginTransaction();
            if($record->delete()){
                DB::commit();
                return response()->json(['message' => 'Record deleted successfully'], 200);
            }
            else {
                return response()->json(['error_message' => 'Some error occured!'], 401);
            }
        }
        catch (\Exception $e){
            DB::rollBack();
            \Log::error('School delete error: ' . $e->getMessage());
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }
}
