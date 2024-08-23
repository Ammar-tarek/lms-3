<?php

namespace App\Http\Controllers;

use App\Models\lesson;
use App\Http\Requests\StorelessonRequest;
use App\Http\Requests\UpdatelessonRequest;
use App\Models\assignment;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use getID3;


class LessonController extends Controller
{
    /**
     * Display a listing of the resource.
     */

     public function viewLesson(Request $request)
     {
         try {
             if (!$request->has('id')) {
                 return response()->json([
                     "message" => "Problem in index request: 'id' parameter is missing"
                 ], 400);
             }
     
             $lessonId = $request->id;
             Log::info("Fetching lessons for course_id: $lessonId");
     
             $lessons = Lesson::with([
                 'assignments' => function ($query) {
                     $query->select('id', 'lesson_id', 'assignment_name');
                 },
                 'quizzes' => function ($query) {
                     $query->select('id', 'lesson_id', 'quiz_name', 'isActive');
                 }
             ])
             ->select('id', 'course_id', 'name', 'description', 'video_path', 'price')
             ->where('id', $lessonId)
             ->get();
     
             Log::info('Fetched lessons:', $lessons->toArray());
     
             // Filter out lessons without assignments or quizzes
             $lessons = $lessons->map(function ($lesson) {
                 if ($lesson->assignments->isEmpty()) {
                     unset($lesson->assignments);
                 }
                 if ($lesson->quizzes->isEmpty()) {
                     unset($lesson->quizzes);
                 }
                 return $lesson;
             });
     
             return response()->json([
                 'lessons' => $lessons,
                 "message" => "Done in index request"
             ], 200);       
         } catch (\Exception $e) {
             return response()->json([
                 'message' => "You have entered something Weird !",
                 'error' => $e->getMessage()
             ], 500);
         }
     }
     
    
    //  this is an request used to get specific one lesson and grades and display its details
    public function index(Request $request)
    {
        try {
            // Check if the 'id' query parameter is present
            if (!$request->has('id')) {
                return response()->json([
                    "message" => "Problem in index request: 'id' parameter is missing"
                ], 400); // Use 400 to indicate a bad request from the client
            }
    
            // Fetch the lessons with assignments, quizzes, and grades
            $lessons = Lesson::with([
                'assignments' => function ($query) {
                    $query->select('id', 'lesson_id', 'assignment_name');
                },
                'quizzes' => function ($query) {
                    $query->select('id', 'lesson_id', 'quiz_name', 'isActive');  // Add fields as required
                },
                'grades' => function ($query) use ($request) {
                    $query->select('id', 'lesson_id', 'user_id', 'grade', 'type', 'graded_date')
                          ->where('user_id', $request->user_id)
                          ->where('lesson_id', $request->id);  // Filter by lesson_id as well
                }
            ])
            ->select('id', 'course_id', 'name', 'description', 'video_path', 'price')
            ->where('id', $request->id)
            ->get();
    
            return response()->json([
                'lessons' => $lessons,
                "message" => "Done in index request"
            ], 200);       
        } catch (\Exception $e) {
            // Return Json Response
            return response()->json([
                'message' => "you have entered something weird!",
                'error' => $e->getMessage() // It's often helpful to include the actual error message for debugging
            ], 500);
        }
    }
    
    

    public function viewedlessons(Request $request)
    {
        try {
            if (!$request->has('user_id')) {
                return response()->json([
                    "message" => "Problem in request: 'user_id' parameter is missing"
                ], 400);
            }

            $userId = $request->user_id;

            // Fetch all payments for the user
            $payments = Payment::where('user_id', $userId)->get();

            // Ensure payments data is retrieved correctly
            if ($payments->isEmpty()) {
                return response()->json([
                    'message' => "No payments found for user_id: $userId"
                ], 404);
            }

            // Get distinct lesson IDs from payments
            $lessonIds = $payments->pluck('lesson_id')->unique()->toArray();

            if (empty($lessonIds)) {
                return response()->json([
                    'message' => "No lessons found for payments"
                ], 404);
            }

            // Fetch lessons with their details, assignments, quizzes, and grades
            $lessons = Lesson::with([
                'assignments' => function ($query) {
                    $query->select('id', 'lesson_id', 'assignment_name');
                },
                'quizzes' => function ($query) {
                    $query->select('id', 'lesson_id', 'quiz_name', 'isActive');
                },
                'grades' => function ($query) use ($userId) {
                    $query->select('id', 'lesson_id', 'user_id', 'grade', 'type', 'graded_date')
                          ->where('user_id', $userId);
                }
            ])
            ->select('id', 'name', 'description', 'price')
            ->whereIn('id', $lessonIds)
            ->get();

            // Ensure lessons data is retrieved correctly
            if ($lessons->isEmpty()) {
                return response()->json([
                    'message' => "No lessons found for the given IDs"
                ], 404);
            }

            // Map payments to lessons
            $lessonsWithPayments = $lessons->map(function ($lesson) use ($payments) {
                // Find the payment related to this lesson
                $payment = $payments->firstWhere('lesson_id', $lesson->id);
                $lesson->payment = $payment; // Add payment info to lesson
                return $lesson;
            });

            return response()->json([
                'lessons' => $lessonsWithPayments,
                "message" => "Lessons retrieved successfully"
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => "Error retrieving lessons from payments",
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // this is an request used to get all lessons that the instructor has created
    public function instructor_Lessons(Request $request)
    {
        try {
            // Check if the 'id' query parameter is present
            if (!$request->has('id')) {
                return response()->json([
                    "message" => "Problem in index request: 'id' parameter is missing"
                ], 400); // Use 400 to indicate a bad request from the client
            }

            // Fetch lessons along with their assignments and quizzes
            $lessons = Lesson::with([
                'assignments' => function ($query) {
                    $query->select('id', 'lesson_id', 'assignment_name');
                },
                'quizzes' => function ($query) {
                    $query->select('id', 'lesson_id', 'quiz_name', 'isActive');
                }
            ])
            ->select('id', 'course_id', 'name', 'description', 'video_path', 'price')
            ->where('course_id', $request->id)
            ->get();

            // Map over the lessons to include video duration and grades
            $lessons = $lessons->map(function ($lesson) {
                // Fetch grades only if needed
                $grades = $lesson->grades()->where('type', 'quiz')->get();
                
                // Include grades only if they are not empty
                if ($grades->isNotEmpty()) {
                    $lesson->grades = $grades;
                } else {
                    // Remove grades if empty
                    unset($lesson->grades);
                }

                // Get the video duration using getID3
                if ($lesson->video_path) {
                    $videoPath = public_path('videos/' . $lesson->video_path);
                    if (file_exists($videoPath)) {
                        try {
                            $getID3 = new getID3();
                            $fileInfo = $getID3->analyze($videoPath);
                            if (isset($fileInfo['playtime_seconds'])) {
                                $duration = $fileInfo['playtime_seconds'];
                                $lesson->video_duration = gmdate("H:i:s", $duration);
                            } else {
                                $lesson->video_duration = 'Error retrieving duration';
                            }
                        } catch (\Exception $e) {
                            $lesson->video_duration = 'Error retrieving duration';
                        }
                    } else {
                        $lesson->video_duration = 'File not found';
                    }
                } else {
                    $lesson->video_duration = 'No video';
                }

                return $lesson;
            });

            return response()->json([
                'lessons' => $lessons,
                "message" => "Done in index request"
            ], 200);
        } catch (\Exception $e) {
            // Return Json Response
            return response()->json([
                'message' => "you have entered something Weird !",
                'error' => $e->getMessage() // It's often helpful to include the actual error message for debugging
            ], 500);
        }
    }
    
    
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorelessonRequest $request)
    {
        try {
            $image = $request->image;
            $imageName = $request->image->getClientOriginalName();
      
            // Create Product
            lesson::create([
                'name' => $request->name,
                'video_path' => $imageName,
                'description' => $request->description,
                'price' => $request->price,
                'course_id' => $request->course_id,
            ]);
      
            // $request->image->move('uploads/', $imageName);

            $image->move('videos', $imageName);
            // Save Image in Storage folder
            // Storage::disk('public')->put($imageName, file_get_contents($request->image));
      
            // Return Json Response
            return response()->json([
                'message' => "Product successfully created."
            ],200);
        } catch (\Exception $e) {
            // Return Json Response
            return response()->json([
                'message' => "Something went really wrong!"
            ],500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(lesson $lesson)
    {
        //
    }
    public function show(Request $request)
    {
        $lesson = Lesson::query();
    
        if (isset($request->id)) {
            $lesson = Lesson::where('course_id', '=', $request->id)
                ->with('assignments')
                ->get();
        } else {
            // $lesson = Lesson::with('assignments')->get();
        }
    
        return response()->json([
            'lessons' => $lesson,
            "Done in show request"
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */

     public function update(UpdatelessonRequest $request, $id)
     {
         try {
             // Find the lesson by ID
             $lesson = Lesson::findOrFail($id);
     
             // Check if a new video file is uploaded and handle it
             if ($request->hasFile('video_path')) {
                  // Define the path for video storage
            $videoPath = public_path('videos');

            // Get the old video file path
            $oldVideoPath = $lesson->video_path;

            // Check if the old video file exists and delete it
            if ($oldVideoPath && file_exists($videoPath . '/' . $oldVideoPath)) {
                if (unlink($videoPath . '/' . $oldVideoPath)) {
                    Log::info("Successfully deleted old video file: $oldVideoPath");
                } else {
                    Log::warning("Failed to delete old video file: $oldVideoPath");
                }
            } else {
                Log::info("No old video file found to delete: $oldVideoPath");
            }
     
                 // Save the new video file
                 $newVideo = $request->file('video_path');
                 $newVideoName = $newVideo->getClientOriginalName(); // Use a timestamp to avoid name conflicts
                 $newVideo->move(public_path('videos'), $newVideoName);
     
                 // Update the lesson's video path
                 $lesson->video_path = $newVideoName;
             }
     
             // Update only the fields that are present in the request
             $lesson->name = $request->input('name', $lesson->name);
             $lesson->description = $request->input('description', $lesson->description);
             $lesson->price = $request->input('price', $lesson->price);
             $lesson->course_id = $request->input('course_id', $lesson->course_id);
     
             // Save the updated lesson
             $lesson->save();
     
             // Return a success response
             return response()->json([
                 'message' => "Lesson successfully updated.",
                 'lesson' => $lesson
             ], 200);
         } catch (\Exception $e) {
             // Handle any errors and return a failure response
             return response()->json([
                 'message' => "Something went wrong during the update!",
                 'error' => $e->getMessage()
             ], 500);
         }
     }
     


    /**
     * Remove the specified resource from storage.
     */  
    public function destroy($lessonId)
    {
        try {
            // Find the lesson by ID
            $lesson = Lesson::findOrFail($lessonId);
            $videoPath = $lesson->video_path;
    
            // Check if the video_path is not null and file exists before deleting
            if ($videoPath) {
                $videoFilePath = public_path('videos/' . $videoPath);
    
                if (file_exists($videoFilePath)) {
                    if (unlink($videoFilePath)) {
                        Log::info("Successfully deleted video file: $videoFilePath");
                    } else {
                        Log::warning("Failed to delete video file: $videoFilePath");
                    }
                } else {
                    Log::warning("Video file not found: $videoFilePath");
                }
            } else {
                Log::info("No video path provided for deletion.");
            }
    
            // Delete the lesson record from the database
            $lesson->delete();
    
            return response()->json([
                'message' => "Lesson and associated video successfully deleted."
            ], 200);
        } catch (\Exception $e) {
            // Handle any errors and return a failure response
            return response()->json([
                'message' => "Something went wrong!",
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    
    
}
