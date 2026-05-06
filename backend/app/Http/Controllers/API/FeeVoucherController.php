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
                'selected_fees.*.FEE_ID' => 'required|integer|distinct|exists:fee_lists,FEE_ID',
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

            $students     = $request->selected_students;
            $selectedFees = collect($request->selected_fees);
            $feeRemarks   = $request->fee_remarks ?? [];
            $feeMonth     = strtoupper($request->fee_month);

            $createdVouchers = [];

            /*
            |--------------------------------------------------------------------------
            | STEP 1: CREATE VOUCHERS
            |--------------------------------------------------------------------------
            */
            foreach ($students as $student) {

                $exists = FeeVoucher::where('ENROLMENT_ID', $student['ENROLMENT_ID'])
                    ->where('FEE_MONTH', $feeMonth)
                    ->exists();

                if ($exists) {
                    continue;
                }

                DB::statement('SET FOREIGN_KEY_CHECKS=0');
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

                $createdVouchers[] = $voucher;
            }

            /*
            |--------------------------------------------------------------------------
            | STEP 2: PREPARE DETAILS DATA (AFTER VOUCHERS CREATED)
            |--------------------------------------------------------------------------
            */
            $detailsData = [];

            foreach ($createdVouchers as $voucher) {

                foreach ($selectedFees as $fee) {

                    $feeId = $fee['FEE_ID'];

                    // Merge remarks (priority: fee_remarks > fee.REMARKS)
                    $remarks = $feeRemarks[$feeId] ?? $fee['REMARKS'] ?? '';

                    $detailsData[] = [
                        'VOUCHER_ID' => $voucher->VOUCHER_ID,
                        'FEE_ID'     => $feeId,
                        'AMOUNT'     => $fee['AMOUNT'] ?? 0,
                        'REMARKS'    => strtoupper($remarks),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }

            /*
            |--------------------------------------------------------------------------
            | STEP 3: REMOVE DUPLICATES (COMPOSITE KEY SAFE)
            |--------------------------------------------------------------------------
            */
            $detailsData = collect($detailsData)
                ->unique(fn ($item) => $item['VOUCHER_ID'].'-'.$item['FEE_ID'])
                ->values()
                ->toArray();

            /*
            |--------------------------------------------------------------------------
            | STEP 4: BULK UPSERT
            |--------------------------------------------------------------------------
            */
            if (!empty($detailsData)) {
                DB::transaction(function () use ($detailsData) {

                    DB::statement('SET FOREIGN_KEY_CHECKS=0');

                    FeeVoucherDetail::upsert(
                        $detailsData,
                        ['VOUCHER_ID', 'FEE_ID'],
                        ['AMOUNT', 'REMARKS']
                    );

                    DB::statement('SET FOREIGN_KEY_CHECKS=1');
                });
            }

            DB::commit();

            /*
            |--------------------------------------------------------------------------
            | STEP 5: LOAD RELATIONS
            |--------------------------------------------------------------------------
            */
            $createdVouchers = FeeVoucher::with([
                'details.fee_list',
                'enrolment.student',
                'school'
            ])
                ->whereIn('VOUCHER_ID', collect($createdVouchers)->pluck('VOUCHER_ID'))
                ->get();

            if ($createdVouchers->isEmpty()) {
                return response()->json([
                    'message' => 'Vouchers already exist for selected students and month.',
                    'data'    => []
                ], 403);
            }

            return response()->json([
                'message' => 'Fee Voucher created successfully.',
                'data'    => $createdVouchers
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
            DB::statement('SET FOREIGN_KEY_CHECKS=0');

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
            DB::statement('SET FOREIGN_KEY_CHECKS=1');

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
