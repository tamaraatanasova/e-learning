<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserCourseSeeder extends Seeder
{
    public function run(): void
    {
        // Креирај еден професор
        $professor = User::create([
            'name' => 'Professor Oak',
            'email' => 'prof@test.com',
            'password' => Hash::make('password'),
            'role' => 'professor',
        ]);

        // Креирај два студенти
        User::create([
            'name' => 'Student Ash',
            'email' => 'student@test.com',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);

        // Професорот креира два курса
        $professor->courses()->create([
            'title' => 'Introduction to Laravel',
            'description' => 'A comprehensive course on Laravel basics.'
        ]);

        $professor->courses()->create([
            'title' => 'Advanced Biometric Security',
            'description' => 'Deep dive into security concepts.'
        ]);
    }
}
