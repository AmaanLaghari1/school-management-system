<?php

namespace App\Http\Controllers;

use App\Services\PdfService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\FeeVoucher;

class PdfController extends Controller
{
    public function testPDF(PdfService $pdfService, Request $request)
    {
        $validation = Validator::make($request->all(), [
            'voucher_ids' => 'required|array|min:1',
        ])->stopOnFirstFailure();

        if ($validation->fails()) {
            return response()->json([
                'error' => $validation->errors()
            ], 400);
        }

        $vouchers = FeeVoucher::with([
            'details',
            'enrolment.student',
            'enrolment.standard',
            'school',
            'details.fee_list'
        ])
            ->whereIn('VOUCHER_ID', $request->voucher_ids)
            ->get();

        if ($vouchers->isEmpty()) {
            return response()->json([
                'error' => 'No vouchers found'
            ], 404);
        }

        $pdf = $pdfService->generateMultipleVouchers($vouchers);

        return response($pdf, 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="fee_vouchers.pdf"');
    }
}
