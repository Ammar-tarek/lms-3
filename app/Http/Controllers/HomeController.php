<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\instructor;
use App\Models\Course;
use Illuminate\Support\Facades\DB;

use function Laravel\Prompts\select;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $instructors = Instructor::with(['courses' => function($query) {
            $query->where('isActive', '=', '1'); // Only active courses
        }])
        ->where('isActive', '=', '1')
        ->get();
    
        // Optionally, if you also need to fetch courses independently
        $courses = Course::where('isActive', '=', '1')->get();
    
        return response()->json([
            'instructors' => $instructors,
            'courses' => $courses,
            "message" => "Done in index Home request"
        ], 200);
    }
    // public function showLessons(Request $request)
    // {
    //     $instructors = instructor::query();
    //     $instructors = instructor::where('isActive', '=', '1')->get();
    //     $courses = Course::query();
    //     $courses = Course::where('isActive', '=', '1')->get();
    
    //     // if (isset($request->id)) {
    //     //     // $courses = Course::where('teacher_id', '=', $request->id)->get()->store();
    //     // }

    //     return response()->json([
    //         'courses' => $courses,
    //         'instructors' => $instructors,
    //         "Done in index Home request"
    //     ], 200);
    // }
}
