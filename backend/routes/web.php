<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-pdf', ['\App\Http\Controllers\PdfController', 'testPDF']);
