<?php

namespace App\Services;

use App\Models\Application;
use FPDF;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Services\QRCodeService;

class ChallanPDF extends FPDF
{
    public $file_name = null;
    public function __construct()
    {
        parent::__construct();
    }

    public function header(){
        $this->SetFont('Arial', 'B', 15);
        $this->setTitle('University of Sindh');
    }

    public function myLine($x)
    {
        $this->Line($x + 70, 5, $x + 70, 213);
    }

    public function myFunction($copy, $x, $challan, $applicationData)
    {
        $pdf = $this;

        $sectionAccountId = env('SECTION_ACCOUNT_ID');
        $typeCode = env('TYPE_CODE');

        $stdName = $applicationData->FIRST_NAME;
        $fName = $applicationData->FNAME;
        $surName = $applicationData->LAST_NAME;
        $applicationId = $applicationData['APPLICATION_ID'];

        $fee_label = "APPLICATION FEE";
        $fee_amount = $applicationData->announcement->APPLICATION_FEE ?? 0;
        $ref_no = $applicationData->announcement->REF_NO ?? '-';
        $due = 0;
        $total_amount = ($fee_amount + $due);
        $category_name = "JOB APPLICATION";

        $valid_upto = $applicationData->announcement->END_DATE ?? "EXPIRED";

       $this->file_name = $challan_no = $sectionAccountId . sprintf("%07d", $applicationId) ?? "";
        $oneBillID = 1001145094 . $challan_no;
        $challan_date = "07-09-2025";
        $cnic_no = $applicationData->CNIC_NO ?? "";
        $mobile_no = $applicationData->MOBILE_NO ?? "";
        $email = $applicationData->EMAIL ?? "";
        $program_title = $applicationData->PROGRAM_TITLE ?? "BS";
        $dept_name = $applicationData->announcement->department->DEPT_NAME ?? "";
        $position_name = $applicationData->announcement->POSITION_NAME ?? "";
        $shift = "Morning";
        $payment_due_date_db = "07-09-2025";
        $type_code = "456";
        $challan_type_id = "234";
        $current_date = date("d-m-Y");

        $pdf->SetFont('Arial', '', 12);
        $pdf->setTextColor(247, 7, 7);
        $pdf->text(85, 195, "Please DO NOT pay this challan at Easypaisa/ UBL Omni/ TCS/ JazzCash.");
        $pdf->setTextColor(0, 0, 0);

        // Logos
        $pdf->Image(public_path('images/usindh_logo.png'), 5 + $x, 3, 18);
        $pdf->Image(public_path('images/1bill.jpeg'), 25 + $x, 4, 15);
        $pdf->Image(public_path('images/HBL_logo.png'), 23 + $x, 17, 23);
//        $pdf->Image(public_path('images/qr_frame.png'), 40 + $x, 2, 23);
        $pdf->Image($pdf->getQrCode($challan_no), 45 + $x, 6, 15);

        $pdf->SetFont('Times', '', 8);
        $pdf->text(8 + $x, 25, $copy);
        $pdf->text(37 + $x, 25, "Print Date: $current_date");

        $height = 23;
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->text($x + 12, $height + 7, "University of Sindh Jamshoro");
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->text($x + 4, $height + 11, "Institutional Fee Collection: YTS-31");

        $height += 12;
        $pdf->SetFont('Times', 'B', 13);
        $pdf->SetXY($x + 3, $height);
        $pdf->MultiCell(65, 6, '1-Bill ID', 1, "C");

        $height += 6;
        $pdf->SetXY($x + 3, $height);
        $pdf->Cell(65, 6, $oneBillID, 1, "", "C");

        $height += 6;
        $pdf->SetXY($x + 3, $height);
        $pdf->Cell(32, 6, "Challan No.", 1, "", "C");
        $pdf->Cell(33, 6, $challan_no, 1, "", "C");

        $height += 10;
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->SetTextColor(255, 0, 0);
        $pdf->text($x + 7, $height, "This challan is valid upto: $valid_upto");

        $pdf->SetFont('Arial', 'B', 10);
        $height += 2;
        $pdf->SetXY($x + 5, $height);
        $pdf->SetTextColor(255, 255, 255);
        $pdf->MultiCell(60, 6, $category_name, 1, 'C', true);
        $pdf->SetTextColor(0, 0, 0);

        $height += 11;
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->text($x + 5, $height, "APPLICATION ID:      " . str_pad($applicationId, 7, '0', STR_PAD_LEFT));

        $pdf->SetFont('Arial', 'B', 8);
        $height += 5;
        $pdf->text($x + 5, $height, "REF NO:      " . $ref_no);

        $pdf->SetFont('Arial', '', 8);
        $height += 5;
        $pdf->text($x + 5, $height, "CNIC NO:");
        $height += 4;
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->text($x + 5, $height, strtoupper($cnic_no));

        $pdf->SetFont('Arial', '', 8);
        $height += 5;
        $pdf->text($x + 5, $height, "CANDIDATE NAME:");
        $pdf->SetFont('Arial', 'B', 9);
        $height += 4;
        $pdf->text($x + 5, $height, strtoupper($stdName));

        $pdf->SetFont('Arial', '', 8);
        $height += 5;
        $pdf->text($x + 5, $height, "FATHER'S NAME:");
        $pdf->SetFont('Arial', 'B', 9);
        $height += 4;
        $pdf->text($x + 5, $height, strtoupper($fName));

        $pdf->SetFont('Arial', '', 8);
        $height += 5;
        $pdf->text($x + 5, $height, "SURNAME:");
        $pdf->SetFont('Arial', 'B', 9);
        $height += 4;
        $pdf->text($x + 5, $height, strtoupper($surName));

        $pdf->SetFont('Arial', '', 8);
        $height += 5;
        $pdf->text($x + 5, $height, "MOBILE NO:");
        $pdf->SetFont('Arial', 'B', 9);
        $height += 3;
        $pdf->text($x + 5, $height, strtoupper($mobile_no));

//        if ($challan_type_id != 8) {

            $pdf->SetFont('Arial', '', 8);
            $height += 5;
            $pdf->text($x + 5, $height, "APPLIED POSITION:");
            $pdf->SetFont('Arial', 'B', 9);
            $pdf->SetXY($x + 4, $height);
            $pdf->MultiCell(65, 4, strtoupper($position_name), 0, "L");

            $pdf->SetFont('Arial', '', 8);
            $height += 15;
            $pdf->text($x + 5, $height, "DEPARTMENT:");
            $pdf->SetFont('Arial', 'B', 9);
            $pdf->SetXY($x + 4, $height += 1);
            $pdf->MultiCell(65, 4, "$dept_name", 0, "L");
//        }

        $pdf->SetXY($x + 3, $height += 12);
        $pdf->SetFont('Times', 'B', 9);
        $pdf->Cell(40, 6, "$fee_label", 1, "", "R");
        $pdf->Cell(25, 6, "Rs. " . number_format($fee_amount, 2), 1, "", "R");

        $pdf->SetXY($x + 3, $height += 8);
        $pdf->SetFont('Arial', '', 7);
        $pdf->MultiCell(65, 4, "                           IMPORTANT NOTE
         This paid amount (Rs: " . number_format($total_amount, 2) . "/=) is non-transferable. In case any applicant submitted / provided wrong information (detected at any stage), his/her challan shall be cancelled. The University of Sindh reserves the right to rectify any error / omission detected at any stage.", 1, "L");
    }

    public function getQrCode($content)
    {
        $qrCodeService = new QRCodeService();
        return $qrCodeService->generate($content, 'qr_frames/'.$content.'qr_code.png');
    }
}
