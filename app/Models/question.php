<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class question extends Model
{
    use HasFactory;
    protected $fillable = [
        'questionText',
        'questionType',
        'quiz_id',
    ];
    
    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
    
}


