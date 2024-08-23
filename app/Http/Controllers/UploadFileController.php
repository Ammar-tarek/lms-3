<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UploadFileController extends Controller
{
    public function UploadFile(Request $request){
        $file = $request->file('file');
        $name = $file->getClientOriginalName();
        $file->move('uploads', $name);
        return response()->json([
            "massage" => "file uploaded successfully",
            'name' => $name
        ]);
    }
}
