<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class answer extends Model
{
    use HasFactory;
    protected $fillable = [
        
        'Question_id', 
        'AnswerText' ,
        'isCorrect',

    ];

    // Inside App\Models\answer.php
    
    public function question()
    {
        return $this->belongsTo(question::class, 'Question_id', 'id');
    }
}
