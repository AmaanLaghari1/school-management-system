<?php

namespace App\Services;

use App\Models\StudentRegistration;
use FPDF;

class RegistrationFormPDF extends FPDF
{
    private int $left = 14;
    private int $right = 196;
    private int $contentWidth = 182;

    public function generate(StudentRegistration $registration): string
    {
        $this->AddPage('P', 'A4');
        $this->SetMargins($this->left, 10, 14);
        $this->SetAutoPageBreak(false);

        $this->renderHeader($registration);
        $this->renderStudentInformation($registration);
        $this->renderParentGuardianInformation($registration);
        $this->renderSiblingInformation($registration);
        $this->renderDeclaration();
        $this->renderReceiptSection($registration);

        return $this->Output('S', 'registration-form.pdf');
    }

    private function renderHeader(StudentRegistration $registration): void
    {
        $logo = public_path('images/usindh_logo.png');

        if (file_exists($logo)) {
            $this->Image($logo, 16, 10, 17);
        }

        $this->SetY(12);
        $this->SetFont('Times', 'B', 16);
        $this->Cell(0, 7, 'MODEL SCHOOL, UNIVERSITY OF SINDH', 0, 1, 'C');
        $this->SetFont('Times', '', 13);
        $this->Cell(0, 6, 'New Student Registration Form', 0, 1, 'C');
        $this->SetFont('Times', 'BI', 10);
        $this->Cell(0, 7, 'PLEASE PRINT LEGIBLY', 0, 1, 'C');

        $this->Rect(168, 12, 28, 34);
        $this->SetFont('Arial', '', 7);
        $this->SetXY(168, 27);
        $this->Cell(28, 5, 'Photograph', 0, 0, 'C');

        $this->SetXY($this->left, 37);
        $this->lineField('R. No', $this->registrationNumber($registration), 24, 42);
        $this->lineField('School', optional($registration->school)->SCHOOL_NAME ?? '', 28, 77);
        $this->Ln(5);
    }

    private function renderStudentInformation(StudentRegistration $registration): void
    {
        $candidateName = trim(($registration->NAME ?? '') . ' ' . ($registration->SURNAME ?? ''));

        $this->sectionTitle('Student Information');
        $this->lineField('Student Full Name', $candidateName, 38, 92);
        $this->lineField('Class', optional($registration->standard)->STANDARD_NAME ?? '', 18, 34);
        $this->Ln(7);

        $this->lineField($this->relationLabel($registration), $registration->FATHER_NAME, 14, 75);
        $this->lineField('Date of Birth', $registration->DOB, 29, 58);
        $this->Ln(7);

        $this->lineField('Gender', $this->genderText($registration), 19, 35);
        $this->lineField('Mobile No.', $registration->MOBILE_NO, 25, 48);
        $this->lineField('Email', $registration->EMAIL, 16, 39);
        $this->Ln(7);

        $this->lineField('Surname', $registration->SURNAME, 21, 52);
        $this->lineField('Last School Attended', $registration->LAST_SCHOOL_ATTENDED, 41, 68);
        $this->Ln(7);

        $this->multiLineField('Home Address', $registration->HOME_ADDRESS, 31, 151, 2);
        $this->Ln(2);
    }

    private function renderParentGuardianInformation(StudentRegistration $registration): void
    {
        $this->sectionTitle('Parent/Guardian Information');
        $this->lineField("Father's Name", $registration->FATHER_NAME, 31, 67);
        $this->lineField("Father's CNIC", $registration->FATHER_CNIC_NO, 31, 49);
        $this->Ln(7);

        $this->lineField("Father's Occupation", $registration->FATHER_OCCUPATION, 39, 61);
        $this->lineField('University Employee', $this->yesNo($registration->IS_UNI_EMPLOYEE), 42, 34);
        $this->Ln(7);

        $this->lineField('Designation', $registration->DESIGNATION, 27, 63);
        $this->lineField('Department', $registration->DEPARTMENT, 26, 66);
        $this->Ln(7);

        $this->lineField('Guardian Relation', $registration->GUARDIAN_RELATION, 36, 50);
        $this->lineField('Guardian Name', $registration->GUARDIAN_NAME, 33, 59);
        $this->Ln(7);

        $this->lineField('Guardian CNIC', $registration->GUARDIAN_CNIC_NO, 32, 52);
        $this->lineField('Guardian Mobile', $registration->GUARDIAN_MOBILE_NO, 35, 56);
        $this->Ln(7);

        $this->lineField('Guardian Email', $registration->GUARDIAN_EMAIL, 33, 149);
        $this->Ln(7);

        $this->multiLineField('Guardian Address', $registration->GUARDIAN_ADDRESS, 36, 146, 2);
        $this->Ln(2);
    }

    private function renderSiblingInformation(StudentRegistration $registration): void
    {
        $this->sectionTitle('Brothers/Sisters Studying in Model School, University of Sindh, Hyderabad');

        $this->SetFont('Times', 'B', 9);
        $this->Cell(62, 6, 'Name', 0, 0);
        $this->Cell(64, 6, 'Class & Section', 0, 0);
        $this->Cell(40, 6, 'GR No.', 0, 1);
        $this->Line($this->left, $this->GetY(), $this->right, $this->GetY());

        $this->SetFont('Times', '', 9);
        $siblings = $registration->siblings ?? collect();
        $rowsPrinted = 0;

        foreach ($siblings->take(3) as $sibling) {
            $this->Cell(62, 7, $this->cleanText($sibling->NAME), 0, 0);
            $this->Cell(64, 7, $this->cleanText($sibling->CLASS_AND_SECTION), 0, 0);
            $this->Cell(40, 7, $this->cleanText($sibling->GR_NO), 0, 1);
            $this->Line($this->left, $this->GetY(), $this->right, $this->GetY());
            $rowsPrinted++;
        }

        while ($rowsPrinted < 2) {
            $this->Cell(62, 7, '', 0, 0);
            $this->Cell(64, 7, '', 0, 0);
            $this->Cell(40, 7, '', 0, 1);
            $this->Line($this->left, $this->GetY(), $this->right, $this->GetY());
            $rowsPrinted++;
        }

        $this->Ln(4);
    }

    private function renderDeclaration(): void
    {
        $this->SetFont('Times', 'I', 9);
        $this->MultiCell($this->contentWidth, 4.5, $this->cleanText('I certify that the information given above is correct to the best of my knowledge.'), 0, 'L');
        $this->Ln(5);

        $this->SetFont('Times', '', 9);
        $this->Cell(85, 6, 'Parent/Guardian Signature: ____________________', 0, 0);
        $this->Cell(95, 6, 'Office Signature: ____________________', 0, 1, 'R');
    }

    private function renderReceiptSection(StudentRegistration $registration): void
    {
        $candidateName = trim(($registration->NAME ?? '') . ' ' . ($registration->SURNAME ?? ''));

        $this->SetY(228);
        $this->SetDash(1.5, 1.5);
        $this->Line($this->left, 225, $this->right, 225);
        $this->SetDash();

        $this->SetFont('Times', 'B', 11);
        $this->Cell(0, 6, 'Receipt Section', 0, 1, 'L');

        $x = $this->left;
        $y = $this->GetY() + 1;
        $width = 96;
        $this->Rect($x, $y, $width, 51);

        $this->SetXY($x + 3, $y + 4);
        $this->receiptField('R. No', $this->registrationNumber($registration), 28, 61);
        $this->Ln(6);
        $this->SetX($x + 3);
        $this->receiptField('Name of Candidate', $candidateName, 36, 53);
        $this->Ln(6);
        $this->SetX($x + 3);
        $this->receiptField('Class', optional($registration->standard)->STANDARD_NAME ?? '', 18, 71);
        $this->Ln(6);
        $this->SetX($x + 3);
        $this->receiptField($this->relationLabel($registration), $registration->FATHER_NAME, 14, 75);
        $this->Ln(6);
        $this->SetX($x + 3);
        $this->receiptField('Date and Time for the Test', '', 47, 42);
        $this->Ln(6);
        $this->SetX($x + 3);
        $this->receiptField('At Venue', '', 22, 67);

        $this->SetXY(125, $y + 28);
        $this->SetFont('Times', '', 9);
        $this->Cell(65, 6, 'Authorized Signature: ____________________', 0, 1);
    }

    private function sectionTitle(string $title): void
    {
        $this->SetFont('Times', 'BU', 10);
        $this->Cell($this->contentWidth, 6, $this->cleanText($title), 0, 1);
    }

    private function lineField(string $label, ?string $value, int $labelWidth, int $valueWidth): void
    {
        $x = $this->GetX();
        $y = $this->GetY();

        $this->SetFont('Times', '', 9);
        $this->Cell($labelWidth, 5, $this->cleanText($label) . ':', 0, 0);
        $this->SetFont('Times', 'B', 9);
        $this->Cell($valueWidth, 5, $this->cleanText($value), 0, 0);
        $this->Line($x + $labelWidth, $y + 5, $x + $labelWidth + $valueWidth, $y + 5);
    }

    private function multiLineField(string $label, ?string $value, int $labelWidth, int $valueWidth, int $lines = 2): void
    {
        $x = $this->GetX();
        $y = $this->GetY();
        $lineHeight = 5;

        $this->SetFont('Times', '', 9);
        $this->Cell($labelWidth, $lineHeight, $this->cleanText($label) . ':', 0, 0);

        $valueX = $x + $labelWidth;
        $this->SetXY($valueX, $y);
        $this->SetFont('Times', 'B', 9);
        $this->MultiCell($valueWidth, $lineHeight, $this->cleanText($value), 0, 'L');

        for ($i = 1; $i <= $lines; $i++) {
            $lineY = $y + ($i * $lineHeight);
            $this->Line($valueX, $lineY, $valueX + $valueWidth, $lineY);
        }

        $this->SetXY($x, $y + ($lines * $lineHeight));
    }

    private function receiptField(string $label, ?string $value, int $labelWidth, int $valueWidth): void
    {
        $this->SetFont('Times', '', 8);
        $this->Cell($labelWidth, 5, $this->cleanText($label) . ':', 0, 0);
        $startX = $this->GetX();
        $startY = $this->GetY();
        $this->SetFont('Times', 'B', 8);
        $this->Cell($valueWidth, 5, $this->cleanText($value), 0, 0);
        $this->Line($startX, $startY + 5, $startX + $valueWidth, $startY + 5);
    }

    private function registrationNumber(StudentRegistration $registration): string
    {
        return str_pad((string) $registration->REG_ID, 6, '0', STR_PAD_LEFT);
    }

    private function relationLabel(StudentRegistration $registration): string
    {
        return ((string) $registration->GENDER === '2') ? 'D/o' : 'S/o';
    }

    private function genderText(StudentRegistration $registration): string
    {
        return ((string) $registration->GENDER === '2') ? 'Female' : 'Male';
    }

    private function yesNo($value): string
    {
        if ((string) $value === '1') {
            return 'Yes';
        }

        if ((string) $value === '2') {
            return 'No';
        }

        return '';
    }

    private function cleanText(?string $text): string
    {
        return iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text ?? '') ?: '';
    }

    private function SetDash(float $black = null, float $white = null): void
    {
        if ($black !== null) {
            $s = sprintf('[%.3F %.3F] 0 d', $black * $this->k, $white * $this->k);
        } else {
            $s = '[] 0 d';
        }

        $this->_out($s);
    }
}
