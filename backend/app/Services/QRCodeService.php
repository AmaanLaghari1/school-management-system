<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QRCodeService
{
    /**
     * Generate or fetch a QR code file.
     *
     * @param string $text The text to encode in the QR code
     * @param string $filename Desired filename for the QR code
     * @return string Full path to the QR code image
     */
    public function generate(string $text, string $filename = 'images/qrcode.png'): string
    {
        // Clean the filename to prevent absolute paths
        $filename = ltrim(str_replace(['\\', '//'], '/', $filename), '/');

        $path = 'public/' . $filename;

        if (!Storage::exists($path)) {
            $qr = QrCode::format('png')->size(300)->generate($text);
            Storage::put($path, $qr);
        }

        return storage_path('app/' . $path);
    }
}
