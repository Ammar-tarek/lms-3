<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use App\Models\wallet;
use App\Models\payment;
use App\Models\transaction;
use App\Models\enrollment;


class PaymentController extends Controller
{

    public function index(Request $request)
    {
        try {
            $userId = $request->user_id;
            $courseId = $request->course_id;
    
            $payments = Payment::where('user_id', $userId)
                ->where('course_id', $courseId)
                ->get();
    
            return response()->json([
                'message' => 'Payments fetched successfully',
                'payments' => $payments,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching payments: ' . $e->getMessage());
    
            return response()->json([
                'message' => 'Failed to fetch payments',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    

    public function store(Request $request)
    {
        try {
            $userWallet = Wallet::where('user_id', "=", $request->user_id)->first();
            $teacherWallet = Wallet::firstOrCreate(['user_id' => $request->teacher_id], ['amount' => 0]);
    
            if (!$userWallet) {
                throw new \Exception('User wallet not found');
            }
    
            if ($userWallet->amount < $request->cost) {
                throw new \Exception('Insufficient balance in user wallet');
            }
    
            $userWallet->update([
                'amount' => $userWallet->amount - $request->cost
            ]);
    
            $teacherWallet->update([
                'amount' => $teacherWallet->amount + $request->cost
            ]);
    
            Payment::create([
                'user_id' => $request->user_id,
                'course_id' => $request->course_id,
                'lesson_id' => $request->lesson_id,
                'cost' => $request->cost,
                'payment_date' => Carbon::now()->setTimezone('Africa/Cairo')->format('Y-m-d H:i:s'),
            ]);
    
            Enrollment::create([
                'user_id' => $request->user_id,
                'course_id' => $request->course_id,
                'instructor_id' => $request->teacher_id,
                'enrollment_date' => Carbon::now()->setTimezone('Africa/Cairo')->format('Y-m-d H:i:s'),
            ]);
    
            Transaction::create([
                'transaction_type' => "withdraw",
                'transaction_medium' => "randomString",
                'from_user_id' => $request->user_id,
                'to_user_id' => $request->teacher_id,
                'amount' => $request->cost,
                'date_issued' => Carbon::now()->setTimezone('Africa/Cairo')->format('Y-m-d H:i:s'),
            ]);
    
            return response()->json([
                'message' => 'Transaction completed and wallet balance updated successfully'
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Payment Error: ' . $e->getMessage());
    
            return response()->json([
                'message' => 'Something went really wrong in transaction!',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }
    


    
}
