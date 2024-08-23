<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class transaction extends Model
{
    use HasFactory;


    protected $fillable = [
        // 'user_id',
        'amount',
        'transaction_type',
        'from_user_id',
        'to_user_id',
        'transaction_medium',
        'date_issured',
    ];
}
