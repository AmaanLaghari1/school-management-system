<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\FeeLedger;

class FeeLedgerController extends Controller
{
    public function index(){
        try {
            FeeLedger::with(['student', 'fee_list'])->get();
        }
        catch (\Exception $e) {
            return response()->json([
                'message' => 'Internal Server Error!',
                'error_message' => $e->getMessage()
            ], 500);
        }
    }
}
