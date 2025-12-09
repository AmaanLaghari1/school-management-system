<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\GuardianRelation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class GuardianRelationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $records = GuardianRelation::with(['students'])->get();
            return response()->json($records, 200);
        }
        catch (\Exception $e) {
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validation = Validator::make($request->all(), [
                'title' => 'required'
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                    'error_message' => $validation->errors()->first()
                ], 403);
            }

            $data = [
                'TITLE' => $request->title,
                'REMARKS' => $request->remarks ??Null
            ];

            DB::beginTransaction();
            $newRecord = GuardianRelation::create($data);
            DB::commit();

            return response()->json([
                'message' => 'Guardian relation created successfully',
                'data' => $newRecord
            ], 200);
        }
        catch(\Exception $e){
            DB::rollBack();
            \Log::error('Guardian relation store error: ' . $e->getMessage());
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $record = GuardianRelation::with(['students'])->find($id);

            if(!$record){
                return response()->json(['error_message' => 'Record not found!'], 401);
            }

            return response()->json($record, 200);
        }
        catch (\Exception $e) {
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $record = GuardianRelation::find($id);

            if(!$record){
                return response()->json(['error_message' => 'Record not found!'], 404);
            }

            $validation = Validator::make($request->all(), [
                'title' => 'required'
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                    'error_message' => $validation->errors()->first()
                ], 403);
            }

            $data = [
                'TITLE' => $request->title,
                'REMARKS' => $request->remarks ??Null
            ];

            DB::beginTransaction();
            $record->update($data);
            DB::commit();

            return response()->json([
                'message' => 'Guardian relation updated successfully',
            ], 200);
        }
        catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Guardian relation update error: ' . $e->getMessage());
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $record = GuardianRelation::find($id);

            if(!$record){
                return response()->json(['error_message' => 'Record not found!'], 401);
            }

            DB::beginTransaction();
            $record->delete();
            DB::commit();

            return response()->json(['message' => 'Guardian relation deleted successfully'], 200);
        }
        catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Guardian relation delete error: ' . $e->getMessage());
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }
}
