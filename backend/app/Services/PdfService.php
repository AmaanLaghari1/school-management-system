<?php

namespace App\Services;

use Carbon\Carbon;
use FPDF;
use App\Services\ChallanPDF;
use App\Services\VoucherPDF;
use Illuminate\Support\Facades\Date;

class PdfService
{
    protected $challanPDF;
    protected $VoucherPDF;

    public function __construct($applicationId = null)
    {
        $this->challanPDF = new ChallanPDF('L', 'mm', 'A4');
        $this->VoucherPDF = new VoucherPDF('L', 'mm', 'A4');

    }

//    public function generatePdf($applicationData)
//    {
////        dd();
//        $this->VoucherPDF->AddPage('L');
//
//        $challan = [
//            'PAYMENT_DUE_DATE' => date("d-m-Y"),
//            'EXPIRY' => '00-00-0000',
//        ];
//
//        $x = 7;
//        $this->VoucherPDF->myFunction("BANK COPY", $x, $challan, $applicationData);
//        $this->VoucherPDF->myLine($x);
//
//        $x = 75;
//        $this->VoucherPDF->myFunction("FINANCE COPY", $x, $challan, $applicationData);
//        $this->VoucherPDF->myLine($x);
//
//        $x = 145;
//        $this->VoucherPDF->myFunction("CANDIDATE COPY", $x, $challan, $applicationData);
//        $this->VoucherPDF->myLine($x);
//
//        $x = 215;
//        $this->VoucherPDF->myFunction("OFFICE COPY", $x, $challan, $applicationData);
//
//        return $this->VoucherPDF->Output('I', $this->challanPDF->file_name.'.pdf');
//    }

    public function generatePdf($voucherData)
    {
        $this->VoucherPDF->AddPage('L');

        $x = 9.5;
        $this->VoucherPDF->renderVoucher("FINANCE COPY", $x, $voucherData);
        $this->VoucherPDF->drawDivider($x);

        $x = 103.5;
        $this->VoucherPDF->renderVoucher("SCHOOL COPY", $x, $voucherData);
        $this->VoucherPDF->drawDivider($x);

        $x = 197.5;
        $this->VoucherPDF->renderVoucher("PARENT COPY", $x, $voucherData);

        return $this->VoucherPDF->Output('S', 'fee_voucher.pdf');
    }
}
