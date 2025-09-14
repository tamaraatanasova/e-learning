<?php

namespace App\Policies;

use App\Models\Material;
use App\Models\User;
use App\Models\Course;

class MaterialPolicy
{

    public function create(User $user, Course $course): bool
    {
        return $user->id === $course->user_id;
    }


    public function delete(User $user, Material $material): bool
    {
        return $user->id === $material->course->user_id;
    }


    public function download(User $user, Material $material): bool
    {
        return true;
    }
}
