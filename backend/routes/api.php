<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\SchoolController;
use App\Http\Controllers\API\StandardController;
use App\Http\Controllers\API\SessionController;
use App\Http\Controllers\API\StudentController;
use App\Http\Controllers\API\GuardianRelationController;
use App\Http\Controllers\API\EnrolmentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('register', [AuthController::class, 'register']);
    Route::post('logout', [AuthController::class, 'logout']);
});

Route::prefix('school')->group(function () {
    Route::get('get', [SchoolController::class, 'index']);
    Route::post('add', [SchoolController::class, 'store']);
    Route::put('edit/{id}', [SchoolController::class, 'update']);
    Route::delete('delete/{id}', [SchoolController::class, 'destroy']);
});

Route::prefix('standard')->group(function () {
    Route::get('get', [StandardController::class, 'index']);
    Route::get('get/{id}', [StandardController::class, 'show']);
    Route::post('add', [StandardController::class, 'store']);
    Route::put('edit/{id}', [StandardController::class, 'update']);
    Route::delete('delete/{id}', [StandardController::class, 'destroy']);
});

Route::prefix('session')->group(function () {
    Route::get('get', [SessionController::class, 'index']);
    Route::get('get/{id}', [SessionController::class, 'show']);
    Route::post('add', [SessionController::class, 'store']);
    Route::put('edit/{id}', [SessionController::class, 'update']);
    Route::delete('delete/{id}', [SessionController::class, 'destroy']);
});

Route::prefix('student')->group(function () {
    Route::get('get', [StudentController::class, 'index']);
    Route::get('get/{id}', [StudentController::class, 'show']);
    Route::get('get_by_school/{schoolId}', [StudentController::class, 'getBySchoolId']);
    Route::post('add', [StudentController::class, 'store']);
    Route::put('edit/{id}', [StudentController::class, 'update']);
    Route::delete('delete/{id}', [StudentController::class, 'destroy']);
});

Route::prefix('guardian')->group(function () {
    Route::get('get', [GuardianRelationController::class, 'index']);
    Route::get('get/{id}', [GuardianRelationController::class, 'show']);
    Route::post('add', [GuardianRelationController::class, 'store']);
    Route::put('edit/{id}', [GuardianRelationController::class, 'update']);
    Route::delete('delete/{id}', [GuardianRelationController::class, 'destroy']);
});

Route::prefix('standard')->group(function () {
    Route::get('get', [StandardController::class, 'index']);
    Route::get('get/{id}', [StandardController::class, 'show']);
    Route::get('get_by_school_id/{schoolId}', [StandardController::class, 'getBySchoolId']);
    Route::post('add', [StandardController::class, 'store']);
    Route::put('edit/{id}', [StandardController::class, 'update']);
    Route::delete('delete/{id}', [StandardController::class, 'destroy']);
});

Route::prefix('enrolment')->group(function () {
    Route::post('get', [EnrolmentController::class, 'getFilteredEnrolments']);
    Route::get('get/{id}', [EnrolmentController::class, 'show']);
    Route::post('add', [EnrolmentController::class, 'store']);
    Route::put('edit/{id}', [EnrolmentController::class, 'update']);
    Route::delete('delete/{id}', [EnrolmentController::class, 'destroy']);
});
