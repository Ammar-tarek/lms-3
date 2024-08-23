<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorequestionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'quiz_id' => 'required|integer|exists:quizzes,id',          // Ensures quiz_id is valid
            'questionType' => 'required|string|max:255',                // Ensures questionType is provided
            'isActive' => 'boolean',                                    // Optional, defaults to false
            'questionText' => 'nullable|string|max:255',                // Optional field, can be null
            'questionImage' => 'nullable|string|max:255',          
        ];
    }
}
