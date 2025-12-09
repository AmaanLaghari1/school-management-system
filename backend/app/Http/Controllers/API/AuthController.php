<?php
namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
public function register(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8'
        ])->stopOnFirstFailure();

        if($validator->fails()){
            return response()->json([
                'error_message' => $validator->errors()->first()
            ], 403);
        }

        $user = User::create([
            'NAME' => $request->name,
            'EMAIL' => $request->email,
            'PASSWORD' => Hash::make($request->password)
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user', 'token'), 201);
    }
    catch(\Exception $e){
        return response()->json(['error_message' => $e->getMessage()], 500);
    }

}

public function login(Request $request)
{
$credentials = $request->only('email', 'password');

$data = [
  'EMAIL' => $request->email,
  'password' => $request->password
];

//return $data;

if (!$token = Auth::guard('api')->attempt($data)) {
return response()->json(['error' => 'Invalid credentials'], 401);
}

return response()->json(compact('token'));
}

public function logout()
{
auth()->logout();
return response()->json(['message' => 'Logged out successfully']);
}
}
