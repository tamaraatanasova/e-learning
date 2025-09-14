<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CoursePolicy
{

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Course $course): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->role === 'professor';
    }


    public function update(User $user, Course $course): bool
    {
        return $user->id === $course->user_id;
    }


    public function delete(User $user, Course $course): bool
    {
        return $user->id === $course->user_id;
    }

    public function viewEnrolledStudents(User $user, Course $course): bool
    {
        return $user->id === $course->user_id;
    }

    public function enrollStudent(User $user, Course $course): bool
    {
        return $user->id === $course->user_id;
    }

 
    public function removeStudent(User $user, Course $course): bool
    {
        return $user->id === $course->user_id;
    }
}
