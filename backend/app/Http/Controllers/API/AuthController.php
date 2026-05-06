<?php
namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\UserRole;
use App\Models\UserRoleRelation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
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

        DB::beginTransaction();
        $user = User::create([
            'NAME' => $request->name,
            'EMAIL' => $request->email,
            'PASSWORD' => Hash::make($request->password)
        ]);

        if($user){
            $role = UserRole::where('ROLE_NAME', 'OPERATOR')->first();

            UserRoleRelation::create([
                'USER_ID' => $user->USER_ID,
                'ROLE_ID' => $role->ROLE_ID
            ]);
        }

        $token = JWTAuth::fromUser($user);

        $user = User::with(['roles.role'])->find($user->USER_ID);

        DB::commit();
        return response()->json(compact('user', 'token'), 201);
    }
    catch(\Exception $e){
        DB::rollBack();
        return response()->json(['error_message' => $e->getMessage()], 500);
    }

}

public function login(Request $request){
    $credentials = $request->only('email', 'password');

    $data = [
        'EMAIL' => $request->email,
        'password' => $request->password
    ];

    //return $data;

    if (!$token = Auth::guard('api')->attempt($data)) {
        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    $user = User::with(['roles.role'])
        ->where('EMAIL', $data['EMAIL'])
        ->first();

    return response()->json(compact('token', 'user'));
}

    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'Logged out successfully']);
    }

    private function postMailRequest($url, $params, $method = "POST")
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->send($method, $url, [
            'json' => $params,
        ]);

        return [
            'response' => $response->body(),
            'response_code' => $response->status(),
        ];
    }

    public function sendPasswordResetLink(Request $request)
    {
        // Validate Email
        $validation = Validator::make(
            $request->all(),
            [
                "email" => "required|email|exists:users,EMAIL",
            ]
        );

        if ($validation->fails()) {
            return response()->json([
                "status" => false,
                "message" => "Validation failed.",
                "errors" => $validation->errors()
            ], 401);
        }

        // Find user
        $user = DB::table('users')->where('EMAIL', $request->email)->first();

        if (!$user) {
            return response()->json([
                "status" => false,
                "message" => "Email does'nt exist."
            ], 404);
        }

        // Generate Reset Token
        $token = Str::random(64);
        $expiry = Carbon::now()->addMinutes(30); // Token expires in 30 minutes

        // Store Reset Token in Database
        DB::table('users')->updateOrInsert(
            ['EMAIL' => $request->email],
            [
                'FORGET_PASSWORD' => $token,
                'FORGET_DATE_TIME' => Carbon::now(),
            ]
        );

        // Generate Password Reset Link
        $resetLink = env('APP_URL') .'/reset_password?token=' . $token;

        $param = [
            'to' => $user->EMAIL,
            'subject' => 'Reset Password',
            'email_body' => 'Follow this link to reset your password.'. "<br/>" . $resetLink,
            'sender_id' => 1,
            'reply_to' => 'info@usindh.edu.pk'
        ];

        if($this->postMailRequest(env('MAIL_API_URL'), $param)){
            return response()->json([
                "status" => true,
                "message" => "Password reset link generated successfully.",
                "reset_link" => $resetLink
            ], 200);
        }

        return response()->json([
            "status" => true,
            "message" => "Unable to reset the password.",
        ], 500);
    }

    public function resetPassword(Request $request){
        $validation = Validator::make(
            $request->all(),
            [
                "forgetPasswordToken" => "required|exists:users,FORGET_PASSWORD",
                "newPassword" => "required|min:6|confirmed:confirmNewPassword",
                "confirmNewPassword" => "required|min:6",
            ]
        );

        if($validation->stopOnFirstFailure()->fails()){
            return response()->json(
                [
                    "status" => false,
                    "message" => "Validation failed.",
                    "error_message" => $validation->errors()->first()
                ],
                401
            );
        }

        $data = User::updateOrCreate(
            ['FORGET_PASSWORD' => $request->forgetPasswordToken],
            ['PASSWORD' => $request->newPassword]
        );

        if($data){
            return response()->json(
                [
                    "status" => true,
                    "message" => "Password changed successfully."
                ], 200
            );
        }

        return response()->json(
            array(
                "status" => false,
                "message" => "Failed to change password."
            ), 500
        );
    }
}
