<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RandomStrings extends Model
{
    use HasFactory;


    protected $fillable = [
        'CreatedFrom',
        'random_string',
        'usedFrom',
        'lessonId',
        'used_at',
    ];



}
