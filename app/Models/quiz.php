<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_name',
        'lesson_id',
        'isActive',

    ];

    public function lesson()
    {
        return $this->belongsTo(lesson::class, 'lesson_id');
    }
}
