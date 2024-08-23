<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash; // Correct import for Hash facade


class AuthController extends Controller
{
    public function signup(SignupRequest $request)
    {
        $data = $request->validated();
        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'security_question' => $data['security_question'],
            'security_answer' => bcrypt($data['security_answer']),
        ]);

        $token = $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
    
        // Attempt to authenticate the user
        if (!Auth::attempt($credentials)) {
            return response([
                'message' => 'Provided email or password is incorrect'
            ], 422);
        }
    
        /** @var \App\Models\User $user */
        $user = Auth::user();
    
        // Check if the user is active
        if (!$user->status) {
            // Log the user out immediately if they are inactive
            Auth::logout();
            return response([
                'message' => 'Your account is inactive.'
            ], 403);
        }
    
        // Create a token for the authenticated user
        $token = $user->createToken('main')->plainTextToken;
    
        return response(compact('user', 'token'));
    }
    

    public function sendResetLink(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'security_question' => 'required|string',
            'security_answer' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if ($user && $user->security_question === $request->security_question && $user->security_answer === $request->security_answer) {
            // Logic to send reset link or token
            return response()->json(['message' => 'Verification successful. Proceed to reset password.'], 200);
        }

        return response()->json(['errors' => ['security_answer' => ['Incorrect security question or answer.']]], 422);
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Find the user by email
        $user = User::where('email', $request->email)->first();

        if ($user) {
            // Check if the new password is the same as the old password
            if (Hash::check($request->password, $user->password)) {
                return response()->json(['errors' => ['password' => ['The new password cannot be the same as the old password.']]], 422);
            }

            // Update the user's password
            $user->password = bcrypt($request->password);
            $user->save();

            return response()->json(['message' => 'Password reset successful'], 200);
        }

        return response()->json(['errors' => ['email' => ['User not found']]], 422);
    }

    public function logout(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        // $user->currentAccessToken()->delete();
        return response('', 204);
    }
}
