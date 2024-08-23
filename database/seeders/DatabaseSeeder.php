<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Course;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Course::factory(10)->create();

        \App\Models\Course::factory()->create([
            'course_catagory' => 'Test User',
            'courseName' => 'test@example.com',
            'courseDescription' => 'test@example.com',
            'abstract' => 'test@example.com',
            'bibliography' => 'test@example.com',
        ]);
    }
}
