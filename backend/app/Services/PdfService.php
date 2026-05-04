<?php

namespace App\Services;

class PdfService
{
    protected $VoucherPDF;

    public function __construct()
    {
        $this->VoucherPDF = new \App\Services\VoucherPDF(); // adjust namespace if needed
    }

    public function generateMultipleVouchers($vouchers)
    {
        foreach ($vouchers as $voucher) {

            $voucherData = $this->mapVoucherData($voucher);

            // Each voucher gets its own page
            $this->VoucherPDF->AddPage('L');

            $this->renderTriplicateCopies($voucherData);
        }

        return $this->VoucherPDF->Output('S', 'fee_vouchers.pdf');
    }

    /**
     * Map DB data → clean array for PDF
     */
    private function mapVoucherData($voucher)
    {
        return [
            'school_name' => optional($voucher->school)->SCHOOL_NAME ?? 'ABC Public School',

            'student_name' => optional($voucher->enrolment->student)->NAME ?? 'N/A',

            'father_name' => optional($voucher->enrolment->student)->FNAME ?? 'N/A',

            'class' => optional($voucher->enrolment->standard)->STANDARD_NAME ?? 'N/A',

            'fee_month' => $voucher->FEE_MONTH ?? '',

            'due_date' => $voucher->DUE_DATE ?? now()->format('d-m-Y'),

            'dues_amount' => $voucher->DUES_AMOUNT ?? '0.00',

            // flatten nested relation safely
            'fees' => $this->formatFees($voucher->details),
        ];
    }

    /**
     * Convert fee details into renderable format
     */
    private function formatFees($details)
    {
        return collect($details)->map(function ($detail) {
            return [
                'name' => $detail->fee_list->TITLE ?? 'Fee',
                'amount' => $detail->fee_list->AMOUNT ?? 0,
            ];
        })->toArray();
    }

    /**
     * Render 3 copies on same page
     */
    private function renderTriplicateCopies($voucherData)
    {
        $positions = [
            ['title' => 'FINANCE COPY', 'x' => 9.5],
            ['title' => 'SCHOOL COPY', 'x' => 103.5],
            ['title' => 'PARENT COPY', 'x' => 197.5],
        ];

        foreach ($positions as $index => $pos) {

            $this->VoucherPDF->renderVoucher(
                $pos['title'],
                $pos['x'],
                $voucherData
            );

            // Draw divider except last
            if ($index < 2) {
                $this->VoucherPDF->drawDivider($pos['x']);
            }
        }
    }
}
