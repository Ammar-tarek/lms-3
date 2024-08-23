<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;


    protected $fillable = [
        'name',
        'description',
        'user_id',
        'isActive',
        'category',
        'image_path',

    ];

    public function instructor()
    {
        return $this->belongsTo(Instructor::class, 'instructor_id'); // Adjust foreign key as necessary
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class, 'course_id');  // Foreign key on the 'lessons' table
    }

    // Assuming there's an Assessment model related to courses
    public function Assignment()
    {
        return $this->hasMany(Assignment::class, 'course_id');  // Foreign key on the 'assessments' table
    }
}
