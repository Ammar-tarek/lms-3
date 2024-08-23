<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignment_name',
        'lesson_id',
        'isActive',

    ];

    public function lesson()
    {
        return $this->belongsTo(lesson::class, 'lesson_id');
    }
}
