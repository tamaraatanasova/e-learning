<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CourseController extends Controller
{
    public function index()
    {
        return Course::with('professor:id,name')->latest()->get();
    }


    public function changePin(Request $request, Course $course)
    {
        $this->authorize('update', $course);

        $course->pin_code = Str::upper(Str::random(6));
        $course->save();

        return response()->json([
            'message' => 'PIN changed successfully.',
            'pin_code' => $course->pin_code,
        ]);
    }
    public function indexWithStudents(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'professor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $courses = $user->taughtCourses()
            ->with('enrolledStudents:id,name,email')
            ->get();

        return response()->json($courses);
    }
    // app/Http/Controllers/CourseController.php

 public function indexForUser(Request $request)
{
    $user = $request->user();
    $courses = [];

    if ($user->role === 'professor') {
        // КОРИСТИ ЈА ТОЧНАТА РЕЛАЦИЈА ЗА ПРОФЕСОРИ
        $courses = $user->taughtCourses()->with('professor:id,name')->latest()->get();
    } else {
        // КОРИСТИ ЈА ТОЧНАТА РЕЛАЦИЈА ЗА СТУДЕНТИ
        $courses = $user->enrolledCourses()->with('professor:id,name')->latest()->get();
    }

    return response()->json($courses);
}
    public function store(Request $request)
    {
        // Провери дали корисникот НЕМА дозвола да креира
        if (Gate::denies('create', Course::class)) {
            // Ако нема, прекини го извршувањето со "403 Forbidden" грешка
            abort(403, 'You are not authorized to create a course.');
        }

        // Овој дел од кодот ќе се изврши САМО АКО Gate::denies() врати false
        // (т.е. корисникот ИМА дозвола)
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $validated['pin_code'] = Str::upper(Str::random(6));

        // Сега, кога сме сигурни дека корисникот е авторизиран, ова ќе работи правилно
        $course = $request->user()->courses()->create($validated);

        return response()->json($course, 201);
    }

    public function show(Course $course)
    {
        Gate::authorize('view', $course);

        return $course->load(
            'professor:id,name',
            'materials',
            'news.user:id,name',
            'news.tags'
        );
    }
    public function update(Request $request, Course $course)
    {
        Gate::denies('update', $course);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
        ]);

        $course->update($validated);

        return response()->json($course);
    }

    public function destroy(Course $course)
    {
        Gate::denies('delete', $course);

        $course->delete();

        return response()->json(null, 204);
    }
    public function listStudents(Course $course)
    {
        Gate::denies('viewEnrolledStudents', $course);
        return $course->enrolledStudents()->where('role', 'student')->get();
    }

    public function enrollStudent(Request $request, Course $course)
    {
        Gate::denies('enrollStudent', $course);
        $validated = $request->validate([
            'student_id' => 'required|exists:users,id',
        ]);

        $student = User::findOrFail($validated['student_id']);
        if ($student->role !== 'student') {
            return response()->json(['message' => 'Only users with the role "student" can be enrolled.'], 422);
        }

        $course->enrolledStudents()->syncWithoutDetaching($student->id);

        return response()->json(['message' => 'Student enrolled successfully.']);
    }

    public function removeStudent(Course $course, User $student)
    {
        Gate::denies('removeStudent', $course);

        $course->enrolledStudents()->detach($student->id);

        return response()->json(['message' => 'Student removed from the course successfully.']);
    }
}
