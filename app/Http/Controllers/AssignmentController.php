<?php

namespace App\Http\Controllers;

use App\Models\assignment;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        $assignment = assignment::query();
    
        if (isset($request->id)) {
            $assignment = assignment::where('lesson_id', '=', $request->id)->get();
            // $courses = Course::where('teacher_id', '=', $request->id)->get()->store();
        }
    
        return response()->json(
            $assignment);
    }

    public function store(Request $request)
    {
        // if ($request->isActive === "on"){
        //     $isActive = 1;
        // } elseif ($request->isActive === "off"){
        //     $isActive = 0;
        // }
        try {
            // Create Product
            assignment::create([
                'assignment_name' => $request->name,
                'lesson_id' => $request->lesson_id,
                'isActive' => $request->isActive,
            ]);
            // Return Json Response
            return response()->json([
                'message' => "assignment successfully created."
            ],200);
        } catch (\Exception $e) {
            // Return Json Response
            return response()->json([
                'message' => "Something went really wrong!!"
            ],500);
        }
    }}
