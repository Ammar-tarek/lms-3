<?php

namespace App\Http\Controllers;

use App\Models\grade;
use Illuminate\Http\Request;
use Carbon\Carbon;


class GradeController extends Controller
{
    //





    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'lesson_id' => 'required|exists:lessons,id',
            'id_of_type' => 'required|numeric',
            'type' => 'required',
            'grade' => 'required|numeric',
        ]);
        
        // Add the current date and time with hours and minutes in the specified timezone
        $validatedData['graded_date'] = Carbon::now()->setTimezone('Africa/Cairo')->format('Y-m-d H:i:s');
        
        if ($validatedData['type'] == 'assignment') {
            // For assignments, create a new record with the modified grade
            $newGrade = $validatedData['grade']; // You can modify the grade if needed
            $validatedData['grade'] = $newGrade;
            $grade = Grade::create($validatedData);
            return response()->json(['message' => 'Assignment grade created successfully', 'grade' => $grade], 201);
        } elseif ($validatedData['type'] == 'quiz') {
            // For quizzes, update the grade of the last record or create a new record if not found
            $lastGrade = Grade::where('user_id', $validatedData['user_id'])
                ->where('lesson_id', $validatedData['lesson_id'])
                ->where('id_of_type', $validatedData['id_of_type'])
                ->where('type', 'quiz')
                ->orderBy('graded_date', 'desc')
                ->first();
            
            if ($lastGrade) {
                $lastGrade->grade = $validatedData['grade'];
                $lastGrade->graded_date = $validatedData['graded_date'];
                $lastGrade->save();
                return response()->json(['message' => 'Quiz grade updated successfully', 'grade' => $lastGrade], 200);
            } else {
                // Create a new quiz grade record if not found
                $grade = Grade::create($validatedData);
                return response()->json(['message' => 'Quiz grade created successfully', 'grade' => $grade], 201);
            }
        } else {
            return response()->json(['message' => 'Invalid type'], 400);
        }
    }
    
    
    
    
}
