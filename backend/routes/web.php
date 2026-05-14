<?php

use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\File;

Route::get('/student-photo/{path}', function ($path) {

    $fullPath = base_path('../resource/uploads/' . $path);

    if (!File::exists($fullPath)) {
        abort(404);
    }

    return response()->file($fullPath);

})->where('path', '.*');

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-pdf', ['\App\Http\Controllers\PdfController', 'testPDF']);
