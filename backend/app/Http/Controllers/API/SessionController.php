<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SessionController extends Controller
{
    //
    public function index(){
        try {
            $records = Session::orderBy('YEAR', 'DESC')->get();
            return response()->json($records, 200);
        }
        catch (\Exception $e) {
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function show($id){
        try {
            $record = Session::find($id);
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
                'session_name' => 'required',
                'year' => 'required',
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                    'error_message' => $validation->errors()->first()
                ], 403);
            }

            $data = [
                'SCHOOL_ID' => $request->school_id,
                'SESSION_NAME' => $request->session_name,
                'YEAR' => $request->year,
                'REMARKS' => $request->remarks ?? ''
            ];

            DB::beginTransaction();
            $newRecord = Session::create($data);
            DB::commit();
            return response()->json(['message' => 'Session created successfully'], 200);

        }
        catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Session store error: ' . $e->getMessage());
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id){
        try {
            $record = Session::find($id);

            if(!$record){
                return response()->json(['error_message' => 'Record not found!'], 401);
            }

            $validation = Validator::make($request->all(), [
                'session_name' => 'required',
                'year' => 'required'
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                    'error_message' => $validation->errors()->first()
                ], 403);
            }

            $data = [
                'SESSION_NAME' => $request->session_name,
                'YEAR' => $request->year,
                'REMARKS' => $request->remarks ?? '',
                'ACTIVE' => $request->active ?? Null
            ];

            DB::beginTransaction();
            $record->update($data);
            DB::commit();

            return response()->json(['message' => 'Session updated successfully'], 200);
        }
        catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Session update error: ' . $e->getMessage());
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id){
        try {
            $record = Session::find($id);

            if(!$record){
                return response()->json(['error_message' => 'Record not found!'], 401);
            }

            DB::beginTransaction();
            $record->delete();
            DB::commit();

            return response()->json(['message' => 'Session deleted successfully'], 200);
        }
        catch(\Exception $e){
            DB::rollBack();
            \Log::error('Session delete error: ' . $e->getMessage());
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }
}
