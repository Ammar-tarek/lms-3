<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;



class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        try {
            // Get the instructor_id, search query, page, and limit from the request
            $instructorId = $request->input('instructor_id');
            $searchQuery = $request->input('search', '');
            $page = $request->input('page', 1);
            $limit = $request->input('limit', 50);
            
            // Ensure the instructor_id is provided
            if (!$instructorId) {
                return response()->json(array('error' => 'Instructor ID is required.'), 400);
            }
    
            // Build the query for users who are included in the enrollments table with the specified instructor_id
            $query = User::whereHas('enrollments', function($query) use ($instructorId) {
                $query->where('instructor_id', $instructorId);
            })->with(['enrollments.course']);
    
            // Apply the search query to filter users by name or email
            if ($searchQuery) {
                $query->where(function($q) use ($searchQuery) {
                    $q->where('name', 'like', '%' . $searchQuery . '%')
                      ->orWhere('email', 'like', '%' . $searchQuery . '%');
                });
            }
    
            // Get the total count of users
            $totalUsers = $query->count();
    
            // Paginate the results
            $users = $query->skip(($page - 1) * $limit)->take($limit)->get();
    
            // Return the users with their enrollment and course details as a JSON response, along with pagination data
            return response()->json(array(
                'users' => $users,
                'totalPages' => ceil($totalUsers / $limit),
                'currentPage' => $page,
            ));
        } catch (\Exception $e) {
            // Return an error response with the exception message
            return response()->json(array('error' => 'Failed to fetch users. ' . $e->getMessage()), 500);
        }
    }
    
    

    public function changeUserStatus(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'user_id' => 'required|exists:users,id',
                'status' => 'required|boolean', // Ensures status is a boolean value (true/false)
            ]);
    
            // Find the user by ID
            $user = User::findOrFail($request->user_id);
    
            // Update the status (true/false will be stored as 1/0 in the database)
            $user->status = $request->status;
            $user->save();
    
            // Return the updated user
            return response()->json([
                'message' => 'User status updated successfully',
                'user' => new UserResource($user)
            ]);
        } catch (\Exception $e) {
            // Handle any other exceptions
            return response()->json([
                'message' => 'Failed to update user status.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    

public function st_in_lesson(Request $request)
{
    try {
        // Get the lesson ID from the request
        $lessonId = $request->input('lesson_id');
        
        // Ensure the lesson ID is provided
        if (!$lessonId) {
            return response()->json(['error' => 'Lesson ID is required.'], 400);
        }

        // Fetch users who have payments related to the specified lesson
        $users = User::whereHas('payments', function($query) use ($lessonId) {
            $query->where('lesson_id', $lessonId);
        })->with([
            'payments' => function($query) use ($lessonId) {
                $query->where('lesson_id', $lessonId)->with('lesson');
            },
            'grades' => function ($query) use ($lessonId) {
                $query->where('lesson_id', $lessonId)
                      ->select('id', 'lesson_id', 'user_id', 'grade', 'type', 'graded_date')
                      ->orderBy('graded_date', 'desc');// Order by graded_date descending to get the latest grade first
            }
        ])->get();

        // Return the users with their payment, lesson, assignment, quiz, and grades details as a JSON response
        return response()->json(['users' => $users]);
    } catch (\Exception $e) {
        // Return an error response with the exception message
        return response()->json(['error' => 'Failed to fetch users with payments and grades. ' . $e->getMessage()], 500);
    }
}

    
    
    
    
    
    
    
    
    


    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StoreUserRequest $request
     * @return \Illuminate\Http\Response
     */
    // public function store(StoreUserRequest $request)
    // {
    //     $data = $request->validated();
    //     $data['password'] = bcrypt($data['password']);
    //     $user = User::create($data);

    //     return response(new UserResource($user) , 201);
    // }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UpdateUserRequest $request
     * @param \App\Models\User                     $user
     * @return \Illuminate\Http\Response
     */
    public function userStatus(Request $request)
    {
        try {
            // Find the user by ID
            $user = User::find($request->user_id);
    
            // Check if the user was found
            if (!$user) {
                return response()->json(['message' => 'User not found.'], 404);
            }
    
            // Toggle the status
            $user->active = !$user->active;
    
            // Save the changes
            $user->save();
    
            // Return the updated user
            return response()->json(['message' => 'User status updated successfully', 'user' => $user]);
        } catch (\Exception $e) {
            // Handle any other exceptions
            return response()->json(['message' => 'Failed to update user status.', 'error' => $e->getMessage()], 500);
        }
    }
    
    
    
    

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response("", 204);
    }
}
