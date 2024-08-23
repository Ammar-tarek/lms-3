<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class instructor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image_path',
        'user_id',
        'isActive',

    ];
    public function courses()
    {
        return $this->hasMany(Course::class, 'user_id'); // Adjust foreign key as necessary
    }
}
