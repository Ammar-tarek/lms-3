<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\wallet;

class WalletController extends Controller
{


    public function index(Request $request)
    {
        $wallet = wallet::query();
    
        if (isset($request->id)) {
            $wallet = wallet::where('user_id', '=', $request->id)->first();
            if ($wallet) {
                return response()->json(['amount' => $wallet]);
            } else {
                return response()->json(['message' => 'Wallet not found for user'], 404);
            }
        }
    
        return response()->json(['message' => 'User ID not provided'], 400);
    }


    public function store(Request $request)
    {
        try {
            // Check if user ID exists in the database
            $wallet = Wallet::where('user_id', $request->user_id)->first();
    
            if ($wallet) {
                // User ID exists, update the wallet amount
                $wallet->amount += $request->amount;
                $wallet->save();
            } else {
                // User ID does not exist, create a new wallet record
                Wallet::create([
                    'amount' => $request->amount,
                    'user_id' => $request->user_id,
                    // 'isActive' => $request->isActive,
                ]);
            }
    
            // Return JSON response
            return response()->json([
                'message' => 'Wallet balance updated successfully'
            ], 200);
        } catch (\Exception $e) {
            // Return JSON response for any errors
            return response()->json([
                'message' => "Something went really wrong!"
            ], 500);
        }
    }
    

}
