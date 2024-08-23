<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lesson_id',
        'id_of_type',
        'type',
        'grade',
        'graded_date',
    ];
}
