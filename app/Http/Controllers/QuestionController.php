<?php

namespace App\Http\Controllers;

use App\Models\question;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Models\answer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->id) {
            // Check if questionType is provided in the request
            $query = question::where('quiz_id', $request->id)
                            ->with('answers'); // Make sure 'answers' matches the method name in the question model
            
            if ($request->has('questionType')) {
                $query->where('questionType', $request->questionType); // Assuming the column name is 'question_type'
            }
    
            $questions = $query->get();
    
            if ($questions->isEmpty()) {
                return response()->json([
                    'message' => 'No questions found for the provided quiz ID and question type'
                ], 404); // Not Found
            }
    
            return response()->json($questions);
        }
    
        return response()->json([
            'message' => 'Quiz ID not provided'
        ], 400); // Bad Request
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
    public function store(StoreQuestionRequest $request)
    {
        try {
            // Ensure questionType is provided or set a default value
            $questionType = $request->has('questionType') ? $request->questionType : 'Assignment';
    
            // Determine the type and handle accordingly
            if (strtolower($questionType) === 'quiz') {
                // Create Question as Quiz
                $newQuestion = question::create([
                    'questionText' => $request->questionText,
                    'quiz_id' => $request->quiz_id,
                    'questionType' => 'Quiz', // Explicitly set as 'Quiz'
                ]);
            } else {
                // Create Question as Assignment
                $newQuestion = question::create([
                    'questionText' => $request->questionText,
                    'quiz_id' => $request->quiz_id,
                    'questionType' => 'Assignment', // Explicitly set as 'Assignment'
                ]);
            }
    
            // Assuming $request->options is an array of options where one is marked as correct
            foreach ($request->options as $option) {
                answer::create([
                    'Question_id' => $newQuestion->id, // Use the ID of the newly created question
                    'AnswerText' => $option['text'],
                    'isCorrect' => $option['correct'] ?? false, // Assuming 'correct' is a boolean in each option
                ]);
            }
    
            // Return Json Response
            return response()->json([
                'message' => "Question and answers successfully created."
            ], 200);
        } catch (\Exception $e) {
            // Return Json Response
            return response()->json([
                'message' => "Something went really wrong!",
                'error' => $e->getMessage() // It's often helpful to include the actual error message for debugging
            ], 500);
        }
    }
    
    
    

    /**
     * Display the specified resource.
     */
    public function show(question $question)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQuestionRequest $request, question $question)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        try {
            $qu = question::find($request->id);
            $qu->delete();
            return response()->json([
                'message' => 'Question successfully deleted.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}