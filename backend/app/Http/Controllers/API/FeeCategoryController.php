<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\FeeCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class FeeCategoryController extends Controller
{
    //
    public function index(){
        try {
            $record = FeeCategory::all();
            return response()->json($record, 200);
        }
        catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id){
        try {
            $record = FeeCategory::find($id);
            return response()->json($record, 200);
        }
        catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request){
        try {
            $validation = Validator::make($request->all(),[
                'cat_title' => 'required',
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json(['error' => $validation->errors()], 400);
            }

            DB::beginTransaction();
            $record = FeeCategory::create([
                'CAT_TITLE' => $request->cat_title??'',
                'REMARKS' => $request->remarks??'',
            ]);
            DB::commit();

            return response()->json(['message' => 'Fee category created successfully...'], 200);
        }
        catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Unable to create fee category!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request){
        try {
            $validation = Validator::make($request->all(),[
                'cat_title' => 'required',
                'fee_cat_id' => 'required'
            ]);

            if($validation->fails()){
                return response()->json(['error' => $validation->errors()], 400);
            }

            $record = FeeCategory::find($request->fee_cat_id);

            DB::beginTransaction();
            $record->update([
                'CAT_TITLE' => $request->cat_title,
                'REMARKS' => $request->remarks??'',
                'ACTIVE' => $request->active??1,
            ]);
            DB::commit();

            return response()->json(['message' => 'Fee category updated successfully...'], 200);
        }
        catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Unable to update fee category!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request){
        try {
            $validation = Validator::make($request->all(),[
                'fee_cat_id' => 'required'
            ])->stopOnFirstFailure();

            if($validation->fails()){
                return response()->json(['error' => $validation->errors()], 400);
            }

            $record = FeeCategory::find($request->fee_cat_id);
            DB::beginTransaction();
            $record->delete();
            DB::commit();

            return response()->json(['message' => 'Fee category deleted successfully...'], 200);
        }
        catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Unable to delete fee category!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
