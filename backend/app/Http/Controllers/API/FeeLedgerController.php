<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\FeeLedger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class FeeLedgerController extends Controller
{
    public function index(){
        try {
            $feeLedger = FeeLedger::with(['student', 'fee_list'])->get();

            return response()->json($feeLedger, 200);
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
            $feeLedger = FeeLedger::with(['student', 'fee_list'])->find($id);

            return response()->json($feeLedger, 200);
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
            $validation = Validator::make(request()->all(), [
               'student_id' => 'required',
               'voucher_id' => 'required',
               'date' => 'required',
               'detail' => 'required',
               'voucher_amount' => 'required',
               'paid_amount' => 'required'
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                    'error_message' => $validation->errors()->first(),
                    'message' => 'Validation failed!'
                ]);
            }

            $data = [
                'student_id' => $request->student_id,
                'voucher_id' => $request->voucher_id,
                'date' => $request->date,
                'detail' => $request->detail,
                'voucher_amount' => $request->voucher_amount
            ];

            DB::beginTransaction();
            $record = FeeLedger::create($data);

            if($record){
                DB::commit();
                return response()->json(['message' => 'Fee Ledger created successfully...'], 201);
            }

            return response()->json(['message' => 'Unable to create fee ledger!'], 500);
        }
        catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Internal Server Error!',
                'error_message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id){
        try {
            $validation = Validator::make(request()->all(), [
                'fee_ledger_id' => 'required',
                'student_id' => 'required',
                'voucher_id' => 'required',
                'date' => 'required',
                'detail' => 'required',
                'voucher_amount' => 'required',
                'paid_amount' => 'required'
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json([
                    'error_message' => $validation->errors()->first(),
                    'message' => 'Validation failed!'
                ]);
            }

            $record = FeeLedger::find($request->fee_ledger_id);

            if($record){
                $data = [
                    'student_id' => $request->student_id,
                    'voucher_id' => $request->voucher_id,
                    'date' => $request->date,
                    'detail' => $request->detail,
                    'voucher_amount' => $request->voucher_amount
                ];

                DB::beginTransaction();
                $record->update($data);
                DB::commit();

                return response()->json(['message' => 'Fee Ledger updated successfully...'], 200);
            }

            return response()->json(['message' => 'Unable to update fee ledger!'], 500);
        }
        catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Internal Server Error!',
                'error_message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        try {
            $record = FeeLedger::find($request->fee_ledger_id);

            if($record){
                DB::beginTransaction();
                $record->delete();
                DB::commit();

                return response()->json(['message' => 'Fee Ledger deleted successfully...'], 200);
            }

            return response()->json(['message' => 'Unable to delete fee ledger!'], 500);
        }
        catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
               'status' => false,
               'error_message' => $e->getMessage() ?? 'Internal Server Error!'
            ]);
        }
    }
}
