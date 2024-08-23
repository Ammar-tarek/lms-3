<?php

namespace App\Http\Controllers;

use App\Models\instructor;
use App\Http\Requests\StoreinstructorRequest;
use App\Http\Requests\UpdateinstructorRequest;
use Illuminate\Http\Request;


class InstructorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $instructors = instructor::query();
    
        if (isset($request->id)) {
            $instructors = instructor::where('user_id', '=', $request->id)->get();
            // $courses = Course::where('teacher_id', '=', $request->id)->get()->store();
        }
    
        return response()->json([
            'instructors' => $instructors,
        ], 200);
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
    public function store(StoreinstructorRequest $request)
    {
        try {
            $imageName = $request->image->getClientOriginalName();
    //   $image = $request->file('image');
            // Create Product
            instructor::create([
                'name' => $request->name,
                'description' => $request->description,
                'image_path' => $imageName,
                'user_id' => $request->teacher_id,
            ]);
      
            // Save Image in Storage folder
            $request->image->move('uploads/', $imageName);

            // Storage::disk('public')->put($imageName, file_get_contents($request->image));
      
            // Return Json Response
            return response()->json([
                'message' => "instractor successfully created."
            ],200);
        } catch (\Exception $e) {
            // Return Json Response
            return response()->json([
                'message' => "Something went really wrong instractor section!"
            ],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(instructor $instructor)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(instructor $instructor)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateinstructorRequest $request, instructor $instructor)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(instructor $instructor)
    {
        //
    }
}
