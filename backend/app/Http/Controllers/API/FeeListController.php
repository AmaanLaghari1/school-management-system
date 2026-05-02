<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\FeeList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class FeeListController extends Controller
{
    public function index(){
        try {
            $records = FeeList::with([
                'fee_category', 'session', 'standard'
            ])->get();

            return response()->json($records, 200);
        }
        catch (\Exception $e) {
            return response()->json([
                'message' => 'Internal Server Error!',
                'error_message' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id){
        try {
            $record = FeeList::with(['fee_category', 'session', 'standard'])->find($id);

            return response()->json($record, 200);
        }
        catch (\Exception $e) {
            return response()->json([
                'message' => 'Internal Server Error!',
                'error_message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request){
        try {
            $validation = Validator::make($request->all(), [
                'fee_cat_id' => 'required',
                'session_id' => 'required',
                'standard_id' => 'required',
                'title' => 'required',
                'amount' => 'required'
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                    'message' => 'Validation Error!',
                    'error_message' => $validation->errors()->first()
                ], 401);
            }

            $data = [
              'FEE_CAT_ID' => $request->fee_cat_id,
              'SESSION_ID' => $request->session_id,
              'STANDARD_ID' => $request->standard_id,
              'TITLE' => $request->title,
              'AMOUNT' => $request->amount,
              'REMARKS' => $request->remarks ?? ''
            ];

            DB::beginTransaction();
            $record = FeeList::create($data);

            if($record){
                DB::commit();
                return response()->json(['message' => 'Fee List created successfully...'], 201);
            }
        }
        catch (\Exception $e){
            DB::rollBack();
            return response()->json([
                'message' => 'Internal Server Error!',
                'error_message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $validation = Validator::make($request->all(), [
                'fee_id' => 'required',
                'fee_cat_id' => 'required',
                'session_id' => 'required',
                'standard_id' => 'required',
                'title' => 'required',
                'amount' => 'required'
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                    'message' => 'Validation Error!',
                    'error_message' => $validation->errors()->first()
                ], 401);
            }

            $record = FeeList::find($request->fee_id);

            if(!$record){
                return response()->json(['message' => 'Record not found!'], 401);
            }

            $data = [
                'FEE_CAT_ID' => $request->fee_cat_id,
                'SESSION_ID' => $request->session_id,
                'STANDARD_ID' => $request->standard_id,
                'TITLE' => $request->title,
                'AMOUNT' => $request->amount,
                'ACTIVE' => $request->active ?? Null,
                'REMARKS' => $request->remarks ?? ''
            ];

            DB::beginTransaction();
            $record->update($data);
            DB::commit();

            return response()->json(['message' => 'Fee List updated successfully...'], 200);
        }
        catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
               'message' => 'Internal Server Error!',
               'error_message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request){
        try {
            $record = FeeList::find($request->fee_id);

            if(!$record){
                return response()->json(['message' => 'Record not found!'], 401);
            }

            DB::beginTransaction();
            $record->delete();
            DB::commit();

            return response()->json(['message' => 'Fee List deleted successfully...'], 200);
        }
        catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Internal Server Error!',
                'error_message' => $e->getMessage()
            ], 500);
        }
    }

    public function getFilteredFeeList(Request $request)
    {
        try {
            $validation = Validator::make($request->all(), [
                'fee_cat_id' => 'required',
                'session_id' => 'required',
                'standard_id' => 'required'
            ])->stopOnFirstFailure();

            if ($validation->fails()) {
                return response()->json([
                    'message' => 'Validation Error!',
                    'error_message' => $validation->errors()->first()
                ], 401);
            }

            $records = FeeList::with(['fee_category', 'session', 'standard'])
                ->where('FEE_CAT_ID', $request->fee_cat_id)
                ->where('SESSION_ID', $request->session_id)
                ->where('STANDARD_ID', $request->standard_id)
                ->get();

            return response()->json($records, 200);
        }
        catch (\Exception $e) {
            return response()->json([
                'message' => 'Internal Server Error!',
                'error_message' => $e->getMessage()
            ], 500);
        }
    }
}
