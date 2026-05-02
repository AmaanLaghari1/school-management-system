<?php

namespace App\Http\Controllers;

use App\Services\PdfService;
use Illuminate\Http\Request;
use PDF;
use FPDF;

class PdfController extends Controller
{
    //
    public function testPDF(PdfService $pdfService)
    {
        $data = [
            'school_name' => 'ABC Public School',
            'student_name' => 'Ali Khan',
            'father_name' => 'Ahmed Khan',
            'class' => 'Grade 5',
            'fee_month' => 'September 2025',
            'due_date' => '10-09-2025',
            'fees' => [
                ['name' => 'Tuition Fee', 'amount' => 3000],
                ['name' => 'Transport Fee', 'amount' => 1500],
                ['name' => 'Exam Fee', 'amount' => 500],
            ]
        ];

        $pdf = $pdfService->generatePdf($data);

        return response($pdf, 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="voucher.pdf"');
    }
}
