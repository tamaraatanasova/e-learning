<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function enrollWithPin(Request $request)
    {
        $validated = $request->validate([
            'pin_code' => 'required|string|size:6',
        ]);

        $course = Course::where('pin_code', strtoupper($validated['pin_code']))->first();

        if (!$course) {
            return response()->json(['message' => 'Course with this PIN not found.'], 404);
        }

        $user = $request->user();

        if ($user->role !== 'student') {
            return response()->json(['message' => 'Only students can enroll in courses.'], 403);
        }

        $course->enrolledStudents()->syncWithoutDetaching($user->id);

        return response()->json([
            'message' => 'Successfully enrolled in course!',
            'course' => $course
        ]);
    }
}
