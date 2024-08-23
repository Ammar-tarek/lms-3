<?php

namespace App\Http\Controllers;

use App\Models\transaction;
use Illuminate\Http\Request;
use App\Models\wallet;

use Carbon\Carbon;
use Illuminate\Support\Facades\Log; // Add this import



class TransactionController extends Controller
{

    public function index(Request $request)
{
    try {
        // Check if user ID is provided
        if (!isset($request->id)) {
            return response()->json([
                'message' => 'User ID is required'
            ], 400);
        }

        // Fetch wallet details for the user
        $wallet = Wallet::where('user_id', $request->id)->first();

        // Check if wallet exists for the user
        if (!$wallet) {
            return response()->json([
                'message' => 'Wallet not found for this user'
            ], 404);
        }

        // Fetch all transactions for the user, ordered by date in descending order
        $transactions = Transaction::where('from_user_id', $request->id)
                                    ->orWhere('to_user_id', $request->id)
                                    ->orderBy('created_at', 'desc')
                                    ->get();

        // Return wallet amount and transactions
        return response()->json([
            'wallet' => $wallet,
            'transactions' => $transactions
        ], 200);
    } catch (\Exception $e) {
        // Return JSON response for any errors
        return response()->json([
            'message' => "Something went really wrong!"
        ], 500);
    }
}

    



public function store(Request $request)
{
    try {
        // Validate request data
        $validatedData = $request->validate([
            // 'user_id' => 'required|exists:users,id',
            'transaction_type' => 'required|in:deposit,withdraw',
            'amount' => 'required|numeric|min:0.01',
            'from_user_id' => 'required|exists:users,id',
            'to_user_id' => 'required|exists:users,id',
            'transaction_medium' => 'required|string|max:255',
        ]);

        // Check if user ID exists in the wallet table
        $wallet = Wallet::where('user_id', $request->user_id)->first();

        // Update or create wallet record
        if ($wallet) {
            // User ID exists, update the wallet amount
            if ($request->transaction_type === 'deposit') {
                $wallet->amount += $request->amount;
            } elseif ($request->transaction_type === 'withdraw') {
                // Ensure the wallet has enough balance for the withdrawal
                if ($wallet->amount >= $request->amount) {
                    $wallet->amount -= $request->amount;
                } else {
                    return response()->json(['message' => 'Insufficient funds for withdrawal'], 400);
                }
            }
            $wallet->save();
        } else {
            // User ID does not exist, create a new wallet record
            if ($request->transaction_type === 'deposit') {
                Wallet::create([
                    'amount' => $request->amount,
                    'user_id' => $request->user_id,
                ]);
            } else {
                return response()->json(['message' => 'User not found for withdrawal'], 400);
            }
        }

        // Create a new transaction record
        Transaction::create([
            // 'user_id' => $request->user_id,
            'transaction_type' => $request->transaction_type,
            'from_user_id' => $request->from_user_id,
            'to_user_id' => $request->to_user_id,
            'date_issured' => Carbon::now()->setTimezone('Africa/Cairo')->format('Y-m-d H:i:s'), // Save the current date and time with hours and minutes in the specified timezone
            'amount' => $request->amount,
            'transaction_medium' => $request->transaction_medium,
        ]);

        // Return JSON response
        return response()->json([
            'message' => 'Transaction completed and wallet balance updated successfully'
        ], 200);
    } catch (\Illuminate\Validation\ValidationException $e) {
        // Return JSON response for validation errors
        return response()->json([
            'message' => $e->getMessage(),
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        // Log the error message
        Log::error('Transaction Error: ' . $e->getMessage());

        // Return JSON response for any other errors
        return response()->json([
            'message' => "Something went really wrong in transaction!",
            'error' => $e->getMessage(),
        ], 500);
    }
}



}
