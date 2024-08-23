<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;


class CourseController extends Controller
{
    /** Done 
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $courses = Course::query();
    
        if (isset($request->id)) {
            $courses = Course::where('user_id', '=', $request->id)->get();
        }

        return response()->json([
            'courses' => $courses,
            "Done in index request"
        ], 200);
    }

    /** 
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseRequest $request)
    {
        try {
            $imageName = $request->image->getClientOriginalName();
            Course::create([
                'name' => $request->name,
                'category' => $request->category,
                'image_path' => $imageName,
                'description' => $request->description,
                'user_id' => $request->teacher_id,
                'isActive' => $request->isActive ?? true,  // Default to active if not provided
            ]);

            $request->image->move('uploads/', $imageName);

            return response()->json([
                'message' => "Course successfully created."
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Something went wrong in store course!"
            ], 500);
        }
    }

    /** 
     * Show the form for editing the specified resource.
     */
    public function showCourse(Request $request)
    {
        if (isset($request->id)) {
            $courses = Course::where('id', '=', $request->id)->get();
            return response()->json([$courses]);
        }

        return response()->json('Please try again to get course for editing.');
    }

    /** 
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        if (isset($request->id)) {
            $courses = Course::where('user_id', '=', $request->id)->get();
            return response()->json(['success' => $courses]);
        }

        return response()->json('Please try again to get courses.');
    }

    /** 
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseRequest $request, $id)
    {
        try {
            // Retrieve the course by ID or fail if not found
            $course = Course::findOrFail($id);
    
            // Check if a new image file is uploaded and handle it
            if ($request->hasFile('image')) {
                $imageName = $request->image->getClientOriginalName();
    
                // Delete the old image file if it exists
                if ($course->image && file_exists(public_path('uploads/' . $course->image))) {
                    unlink(public_path('uploads/' . $course->image));
                    Log::info("Deleted old image file: uploads/{$course->image}");
                }
    
                // Move the new image file to the desired directory
                $request->image->move(public_path('uploads/'), $imageName);
    
                // Update the course's image path
                $course->image = $imageName;
            }
    
            // Update the course data
            $course->update([
                'name' => $request->name,
                'category' => $request->category,
                'description' => $request->description,
                'user_id' => $request->teacher_id,
                'isActive' => $request->isActive ?? true,  // Default to active if not provided
            ]);
    
            // Return a success response
            return response()->json([
                'message' => "Course successfully updated.",
                'course' => $course
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
    public function destroy(Course $course)
    {
        //
    }

    /** 
     * Toggle the active status of a course.
     */
    public function toggleStatus(Request $request)
    {
        try {
            $course = Course::find($request->courseId);

            if (!$course) {
                return response()->json(['message' => 'Course not found.'], 404);
            }

            // Toggle the active status
            $course->isActive = !$course->isActive;
            $course->save();

            return response()->json(['success' => $course]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error toggling course status.'], 500);
        }
    }
}
