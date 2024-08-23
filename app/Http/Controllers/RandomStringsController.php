<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RandomStrings;
use App\Models\payment;
use App\Models\transaction;
use App\Models\enrollment;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Lesson; 


class RandomStringsController extends Controller
{
    // Function to retrieve random strings by CreatedFrom with pagination
    public function index(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'search' => 'string|nullable',
            'page' => 'integer|nullable',
            'per_page' => 'integer|nullable',
        ]);
    
        $userId = $request->user_id;
        $search = $request->search;
        $perPage = $request->per_page ?? 50;
    
        $query = RandomStrings::where('CreatedFrom', $userId);
    
        if ($search) {
            $query->where('random_string', 'LIKE', "%{$search}%");
        }
    
        $randomStrings = $query->paginate($perPage);
    
        // Fetch the user names for CreatedFrom and usedFrom IDs
        $userIds = $randomStrings->pluck('CreatedFrom')->unique()->toArray();
        $usedFromIds = $randomStrings->pluck('usedFrom')->unique()->toArray();
        $allUserIds = array_merge($userIds, $usedFromIds);
        $users = User::whereIn('id', $allUserIds)->get()->keyBy('id');
    
        // Fetch lesson names for lessonId
        $lessonIds = $randomStrings->pluck('lessonId')->unique()->toArray();
        $lessons = Lesson::whereIn('id', $lessonIds)->get(['id', 'name'])->keyBy('id');
    
        $randomStringsWithNames = $randomStrings->map(function ($randomString) use ($users, $lessons) {
            return [
                'id' => $randomString->id,
                'random_string' => $randomString->random_string,
                'string_status' => $randomString->string_status,
                'created_at' => $randomString->created_at,
                'used_at' => $randomString->used_at,
                'lessonId' => $randomString->lessonId,
                'lessonName' => $lessons->get($randomString->lessonId)->name ?? null,
                'CreatedFrom' => $users->get($randomString->CreatedFrom)->name ?? null,
                'usedFrom' => $users->get($randomString->usedFrom)->name ?? null,
            ];
        });
    
        return response()->json([
            'message' => 'Random strings retrieved successfully',
            'data' => $randomStringsWithNames,
            'pagination' => [
                'total' => $randomStrings->total(),
                'per_page' => $randomStrings->perPage(),
                'current_page' => $randomStrings->currentPage(),
                'last_page' => $randomStrings->lastPage(),
                'from' => $randomStrings->firstItem(),
                'to' => $randomStrings->lastItem(),
            ]
        ]);
    }
    

    // Function to fill CreatedFrom and random_string
    public function createRandomStrings(Request $request)
    {
        $request->validate([
            'CreatedFrom' => 'required|integer',
        ]);
    
        $createdFrom = $request->CreatedFrom;
        $randomStrings = [];
    
        for ($i = 0; $i < 100; $i++) {
            $randomString = Str::random(8);
    
            // Check if the random string already exists
            while (RandomStrings::where('random_string', $randomString)->exists()) {
                $randomString = Str::random(8); // Generate a new random string
            }
    
            $newRandomString = new RandomStrings();
            $newRandomString->CreatedFrom = $createdFrom;
            $newRandomString->random_string = $randomString;
            $newRandomString->save();
    
            $randomStrings[] = $newRandomString;
        }
    
        return response()->json(['message' => '100 random strings created successfully', 'data' => $randomStrings]);
    }

    // Function to fill usedFrom, lessonId, and used_at
    public function useRandomString(Request $request)
    {
        $request->validate([
            'random_string' => 'required|string|size:8',
            'usedFrom' => 'required|integer',
            'lessonId' => 'required|integer',
            'user_id' => 'required|integer',
            'course_id' => 'required|integer',
            'teacher_id' => 'required|integer',
            'cost' => 'required|numeric',
        ]);
    
        // Find the random string in the database
        $randomString = RandomStrings::where('random_string', $request->random_string)->first();
    
        if (!$randomString) {
            return response()->json(['message' => 'Random string not found'], 404);
        }
    
        // Check if the random string has been used before
        if ($randomString->usedFrom) {
            return response()->json(['message' => 'This random string has been used before'], 400);
        }
    
        // Update the random string with the new data
        $randomString->usedFrom = $request->usedFrom;
        $randomString->lessonId = $request->lessonId;
        $randomString->string_status = "used";
        $randomString->used_at = Carbon::now()->setTimezone('Africa/Cairo')->format('Y-m-d H:i:s');
        $randomString->save();
    
        // Create Payment, Enrollment, and Transaction records
        Payment::create([
            'user_id' => $request->user_id,
            'course_id' => $request->course_id,
            'lesson_id' => $request->lessonId,
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
            'transaction_medium' => "payment",
            'from_user_id' => $request->user_id,
            'to_user_id' => $request->teacher_id,
            'amount' => $request->cost,
            'date_issued' => Carbon::now()->setTimezone('Africa/Cairo')->format('Y-m-d H:i:s'),
        ]);
    
        return response()->json(['message' => 'Random string updated successfully and payment processed', 'data' => $randomString]);
    }

    public function updateRandomStringsStatus(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:random_strings,id',
            'status' => 'required|string|in:printed',
        ]);

        $ids = $request->ids;
        $status = $request->status;

        RandomStrings::whereIn('id', $ids)->update(['string_status' => $status]);

        return response()->json(['message' => 'Random string status updated successfully']);
    }
    
}
