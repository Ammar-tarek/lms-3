<?php

namespace App\Http\Controllers;

use App\Models\quiz;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function index(Request $request)
    {
        $quiz = quiz::query();
    
        if (isset($request->id)) {
            $quiz = quiz::where('lesson_id', '=', $request->id)->get();
            // $courses = Course::where('teacher_id', '=', $request->id)->get()->store();
        }
    
        return response()->json(
            $quiz);
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
            quiz::create([
                'quiz_name' => $request->name,
                'lesson_id' => $request->lesson_id,
                'isActive' => $request->isActive,
            ]);
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
}
