<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\FeeLedger;
use App\Models\FeeVoucher;
use App\Models\FeeVoucherDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class FeeVoucherController extends Controller
{
    public function index(){
        try {
            $records = FeeVoucher::with(['enrolment', 'enrolment.student', 'school', 'details', 'details.fee_list.fee_category'])
                ->orderBy('DATE', 'desc')
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
            $records = FeeVoucher::where('SCHOOL_ID', $schoolId)
                ->with(['enrolment', 'enrolment.student', 'school', 'details', 'details.fee_list.fee_category'])
                ->get();

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

    public function store(Request $request)
    {
        try {
            $validation = Validator::make($request->all(), [
                'school_id' => 'required|integer',
                'selected_students' => 'required|array|min:1',
                'date' => 'required|date',
                'current_amount' => 'required|numeric|min:0',
                'fee_month' => 'required|string',
                'remarks' => 'nullable|string',

                'selected_fees' => 'required|array|min:1',
                'selected_fees.*.FEE_ID' => 'required|integer',
                'selected_fees.*.AMOUNT' => 'required|numeric|min:0',
                'selected_fees.*.REMARKS' => 'nullable|string',

                'fee_remarks' => 'nullable|array'
            ])->stopOnFirstFailure();

            if ($validation->fails()) {
                return response()->json([
                    'error_message' => $validation->errors()->first(),
                    'message' => 'Validation failed!'
                ], 422);
            }

            DB::beginTransaction();

            $students     = $request->input('selected_students');
            $selectedFees = $request->input('selected_fees', []);
            $feeRemarks   = $request->input('fee_remarks', []);
            $feeMonth     = strtoupper($request->fee_month);

            $createdVouchers = [];
            $skippedFeesLog  = [];

            foreach ($students as $student) {

                // 🔍 Get all existing FEE_IDs for this student + month
                $voucherExists = FeeVoucher::where('ENROLMENT_ID', $student['ENROLMENT_ID'])
                    ->where('FEE_MONTH', $feeMonth)
                    ->exists();

                // Skip if already exists
                if ($voucherExists) {
                    continue;
                }

                // ➕ Create Voucher
                $voucher = FeeVoucher::create([
                    'SCHOOL_ID'      => $request->school_id,
                    'ENROLMENT_ID'   => $student['ENROLMENT_ID'],
                    'DATE'           => $request->date,
                    'CURRENT_AMOUNT' => $request->current_amount,
                    'DUES_AMOUNT'    => $student['DUES_AMOUNT'] ?? 0,
                    'FEE_MONTH'      => $feeMonth,
                    'ACTIVE'         => 1,
                    'REMARKS'        => strtoupper($request->remarks ?? '')
                ]);

                $detailsData = [];

                foreach ($selectedFees as $fee) {

                    $feeId = $fee['FEE_ID'];

                    // 📝 Handle remarks override
                    $remarks = $fee['REMARKS'] ?? '';
                    if (isset($feeRemarks[$feeId])) {
                        $remarks = $feeRemarks[$feeId];
                    }

                    $detailsData[] = [
                        'VOUCHER_ID' => $voucher->VOUCHER_ID,
                        'FEE_ID'     => $feeId,
                        'AMOUNT'     => $fee['AMOUNT'] ?? 0,
                        'REMARKS'    => strtoupper($remarks ?? ''),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                // ➕ Insert only if we have non-duplicate fees
                if (!empty($detailsData)) {
                    FeeVoucherDetail::insert($detailsData);
                }

                $createdVouchers[] = $voucher->load('details');
            }

            if (empty($createdVouchers)) {
                return response()->json([
                    'message' => 'vouchers already exist for the selected students and month.',
                    'data'    => []
                ], 403);
            }

            DB::commit();

            return response()->json([
                'message' => 'Fee Voucher created successfully.',
                'data'    => $createdVouchers,
                'skipped_fees' => $skippedFeesLog
            ], 201);

        } catch (\Exception $e) {

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
                'school_id' => 'required|integer',
                'selected_students' => 'required|array|min:1',
                'date' => 'required|date',
                'current_amount' => 'required|numeric|min:0',
                'fee_month' => 'required|string',
                'remarks' => 'nullable|string',

                'selected_fees' => 'required|array|min:1',
                'selected_fees.*.FEE_ID' => 'required|integer',
                'selected_fees.*.AMOUNT' => 'required|numeric|min:0',
                'selected_fees.*.REMARKS' => 'nullable|string',
            ])->stopOnFirstFailure();

            if ($validation->fails()) {
                return response()->json([
                    'error_message' => $validation->errors()->first(),
                    'message' => 'Validation failed!'
                ], 422);
            }

            DB::beginTransaction();

            $selectedFees = $request->input('selected_fees', []);
            $students     = $request->input('selected_students', []);

            $updatedVouchers = [];

            foreach ($students as $student) {

                // 🔍 Find existing voucher for same student + month
                $voucher = FeeVoucher::where('ENROLMENT_ID', $student['ENROLMENT_ID'])
                    ->where('FEE_MONTH', strtoupper($request->fee_month))
                    ->first();

                if ($voucher) {
                    // 🔁 UPDATE EXISTING
                    $voucher->update([
                        'SCHOOL_ID'      => $request->school_id,
                        'DATE'           => $request->date,
                        'CURRENT_AMOUNT' => $request->current_amount,
                        'DUES_AMOUNT' => $student['DUES_AMOUNT'] ?? 0,
                        'REMARKS'        => strtoupper($request->remarks ?? ''),
                    ]);
                } else {
                    // ➕ CREATE NEW (same as store)
                    $voucher = FeeVoucher::create([
                        'SCHOOL_ID'     => $request->school_id,
                        'ENROLMENT_ID'  => $student['ENROLMENT_ID'],
                        'DATE'          => $request->date,
                        'CURRENT_AMOUNT'=> $request->current_amount,
                        'FEE_MONTH'     => strtoupper($request->fee_month),
                        'ACTIVE'        => 1,
                        'REMARKS'       => strtoupper($request->remarks ?? '')
                    ]);
                }

                // 🔄 Sync Fee Details
                $existingDetails = FeeVoucherDetail::where('VOUCHER_ID', $voucher->VOUCHER_ID)
                    ->get()
                    ->keyBy('FEE_ID');

                $incomingFeeIds = [];
                $newDetails     = [];

                foreach ($selectedFees as $fee) {

                    $feeId = $fee['FEE_ID'];
                    $incomingFeeIds[] = $feeId;

                    if (isset($existingDetails[$feeId])) {
                        // ✏️ Update
                        $existingDetails[$feeId]->update([
                            'AMOUNT'  => $fee['AMOUNT'] ?? 0,
                            'REMARKS' => strtoupper($fee['REMARKS'] ?? ''),
                        ]);
                    } else {
                        // ➕ Insert
                        $newDetails[] = [
                            'VOUCHER_ID' => $voucher->VOUCHER_ID,
                            'FEE_ID'     => $feeId,
                            'AMOUNT'     => $fee['AMOUNT'] ?? 0,
                            'REMARKS'    => strtoupper($fee['REMARKS'] ?? ''),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }

                if (!empty($newDetails)) {
                    FeeVoucherDetail::insert($newDetails);
                }

                // ❌ Delete removed fees
                FeeVoucherDetail::where('VOUCHER_ID', $voucher->VOUCHER_ID)
                    ->whereNotIn('FEE_ID', $incomingFeeIds)
                    ->delete();

                $updatedVouchers[] = $voucher->load('details');
            }

            DB::commit();

            return response()->json([
                'message' => 'Fee Vouchers updated successfully.',
                'data'    => $updatedVouchers
            ], 200);

        } catch (\Exception $e) {
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
            $record = FeeVoucher::find($request->voucher_id);

            if (!$record) {
                return response()->json([
                    'message' => 'Fee Voucher not found!'
                ], 404);
            }

            DB::beginTransaction();

            // FIRST delete children
            FeeVoucherDetail::where('VOUCHER_ID', $record->VOUCHER_ID)->delete();
            FeeLedger::where('VOUCHER_ID', $record->VOUCHER_ID)->delete();

            // THEN delete parent
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
