<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\FeeVoucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class FeeVoucherController extends Controller
{
    public function index(){
        try {
            $records = FeeVoucher::with(['enrolment', 'enrolment.student', 'school'])
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

    public function getBySchoolId($schoolId){
        try {
            $records = FeeVoucher::where('SCHOOL_ID', $schoolId)->get();

            return response()->json($records, 200);
        }
        catch (\Exception $e){
            return response()->json([
                'message' => 'Internal Server Error!',
                'error_message' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id){
        try {
            $record = FeeVoucher::find($id);

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
                'school_id' => 'required',
                'enrolment_id' => 'required',
                'date' => 'required|date',
                'total_amount' => 'required|numeric',
                'fee_month' => 'required',
//                'active' => 'required|boolean',
                'remarks' => 'nullable|string'
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                    'error_message' => $validation->errors()->first(),
                    'message' => 'Validation failed!'
                ], 422);
            }

            DB::beginTransaction();

            $record = FeeVoucher::create([
                'SCHOOL_ID' => $request->school_id,
                'ENROLMENT_ID' => $request->enrolment_id,
                'DATE' => $request->date,
                'TOTAL_AMOUNT' => $request->total_amount,
                'FEE_MONTH' => strtoupper($request->fee_month)??'',
                'ACTIVE' => 1,
                'REMARKS' => strtoupper($request->remarks)??''
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Fee Voucher created successfully...',
                'data' => $record
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Internal Server Error!',
                'error_message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request){
        try {
            $validation = Validator::make($request->all(), [
                'school_id' => 'required',
                'enrolment_id' => 'required',
                'date' => 'required|date',
                'total_amount' => 'required|numeric',
                'fee_month' => 'required',
                'remarks' => 'nullable|string'
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                    'error_message' => $validation->errors()->first(),
                    'message' => 'Validation failed!'
                ], 422);
            }

            $record = FeeVoucher::find($request->voucher_id);

            if(!$record){
                return response()->json([
                    'message' => 'Fee Voucher not found!'
                ], 404);
            }

            DB::beginTransaction();

            $record->update([
                'SCHOOL_ID' => $request->school_id,
                'ENROLMENT_ID' => $request->enrolment_id,
                'DATE' => $request->date,
                'TOTAL_AMOUNT' => $request->total_amount,
                'FEE_MONTH' => strtoupper($request->fee_month)??'',
                'REMARKS' => strtoupper($request->remarks)??'',
                'ACTIVE' => $request->active == 1 ? 1 : 0
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Fee Voucher updated successfully...',
                'data' => $record
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Internal Server Error!',
                'error_message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request){
        try {
            $record = FeeVoucher::find($request->fee_voucher_id);

            if(!$record){
                return response()->json([
                    'message' => 'Fee Voucher not found!'
                ], 404);
            }

            DB::beginTransaction();

            $record->delete();

            DB::commit();

            return response()->json([
                'message' => 'Fee Voucher deleted successfully...'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'error_message' => $e->getMessage() ?? 'Internal Server Error!'
            ], 500);
        }
    }
}
