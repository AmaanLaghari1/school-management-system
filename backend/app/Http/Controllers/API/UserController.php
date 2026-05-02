<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    //
    public function index(){
        try {
            $record = User::all();

            return response()->json($record, 200);
        }
        catch (\Exception $e) {
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $record = User::find($id);

            return response()->json($record, 200);
        }
        catch (\Exception $e) {
            return response()->json(['error_message' => $e->getMessage()], 500);
        }
    }
}
