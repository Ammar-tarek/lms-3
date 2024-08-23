<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorelessonRequest extends FormRequest
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
            'name' => 'required|string|max:255|not_regex:/[<>=\'"%&$;]/', // Disallow certain characters
            'description' => 'required|string|not_regex:/[<>=\'"%&$;]/',
            // 'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'price' => 'required|numeric',
            'course_id' => 'required|integer|exists:courses,id',
          ];
    }
}
