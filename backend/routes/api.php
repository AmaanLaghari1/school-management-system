<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\FeeCategoryController;
use App\Http\Controllers\API\FeeListController;
use App\Http\Controllers\API\FeeLedgerController;
use App\Http\Controllers\API\FeeVoucherController;
use App\Http\Controllers\API\SchoolController;
use App\Http\Controllers\API\StandardController;
use App\Http\Controllers\API\SessionController;
use App\Http\Controllers\API\StudentController;
use App\Http\Controllers\API\GuardianRelationController;
use App\Http\Controllers\API\EnrolmentController;
use App\Http\Controllers\API\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\API\StudentRegistrationController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('registration/get_by', [StudentRegistrationController::class, 'getByFilters']);
Route::post('registration/register_student', [StudentRegistrationController::class, 'store']);
Route::post('registration/update_registration/{id}', [StudentRegistrationController::class, 'update']);
Route::get('registration/pdf/{id}', [StudentRegistrationController::class, 'pdf']);

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('register', [AuthController::class, 'register']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('forgot_password', [AuthController::class, 'sendPasswordResetLink']);
    Route::post('reset_password', [AuthController::class, 'resetPassword']);
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
    Route::get('get_by_school/{schoolId}', [SessionController::class, 'getSessionBySchoolId']);
});

Route::prefix('student')->group(function () {
    Route::get('get', [StudentController::class, 'index']);
    Route::get('get/{id}', [StudentController::class, 'show']);
    Route::get('get_by_school/{schoolId}', [StudentController::class, 'getBySchoolId']);
    Route::post('add', [StudentController::class, 'store']);
    Route::put('edit/{id}', [StudentController::class, 'update']);
    Route::delete('delete/{id}', [StudentController::class, 'destroy']);
});

Route::prefix('user')->group(function () {
    Route::get('get', [UserController::class, 'index']);
    Route::get('get/{id}', [UserController::class, 'show']);
    Route::get('get_by_school/{schoolId}', [UserController::class, 'getBySchoolId']);
    Route::post('add', [UserController::class, 'store']);
    Route::put('edit/{id}', [UserController::class, 'update']);
    Route::delete('delete/{id}', [UserController::class, 'destroy']);
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
    Route::post('promote', [EnrolmentController::class, 'promoteClass']);
    Route::post('toggle-active', [EnrolmentController::class, 'toggleActiveStatus']);
    Route::get('get_by_filters/{sessionId}/{standardId}', [EnrolmentController::class, 'getEnrolmentByFilters']);
});

Route::prefix('fee')->group(function () {
    Route::prefix('category')->group(function () {
        Route::get('get', [FeeCategoryController::class, 'index']);
        Route::get('get/{id}', [FeeCategoryController::class, 'show']);
        Route::post('post', [FeeCategoryController::class, 'store']);
        Route::post('put', [FeeCategoryController::class, 'update']);
        Route::post('delete', [FeeCategoryController::class, 'destroy']);
    });

    Route::prefix('fee_list')->group(function () {
        Route::get('get', [FeeListController::class, 'index']);
        Route::get('get/{id}', [FeeListController::class, 'show']);
        Route::post('post', [FeeListController::class, 'store']);
        Route::post('put', [FeeListController::class, 'update']);
        Route::post('delete', [FeeListController::class, 'destroy']);
        Route::post('get_filtered', [FeeListController::class, 'getFilteredFeeList']);
    });

    Route::prefix('fee_ledger')->group(function () {
        Route::get('get', [FeeLedgerController::class, 'index']);
        Route::get('get/{id}', [FeeLedgerController::class, 'show']);
        Route::post('post', [FeeLedgerController::class, 'store']);
        Route::post('put', [FeeLedgerController::class, 'update']);
        Route::post('delete', [FeeLedgerController::class, 'destroy']);
    });

    Route::prefix('fee_voucher')->group(function () {
        Route::get('get', [FeeVoucherController::class, 'index']);
        Route::get('get/{id}', [FeeVoucherController::class, 'show']);
        Route::get('get_by_school/{schoolId}', [FeeVoucherController::class, 'getBySchoolId']);;
        Route::post('post', [FeeVoucherController::class, 'store']);
        Route::post('put', [FeeVoucherController::class, 'update']);
        Route::post('delete', [FeeVoucherController::class, 'destroy']);
        Route::post('/test-pdf', [PdfController::class, 'testPDF']);

    });
});
