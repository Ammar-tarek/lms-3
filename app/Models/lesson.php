<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'video_path',
        'description',
        'price',
        'course_id',
    ];


    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');  // Assuming 'course_id' is the foreign key in 'lessons' table
    }
    public function assignments()
    {
        return $this->hasMany(Assignment::class);  // Specify the foreign key if not default
    }
    public function quizzes()
    {
        return $this->hasMany(Quiz::class, 'lesson_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function grades()
{
    return $this->hasMany(Grade::class);
}



}