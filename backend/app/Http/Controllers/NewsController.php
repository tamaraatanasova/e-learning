<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class NewsController extends Controller
{

    public function index(Course $course)
    {
        Gate::authorize('viewAny', [News::class, $course]);

        return $course->news()->with('user:id,name', 'tags')->latest()->get();
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'course_id' => 'required|exists:courses,id',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        $course = Course::findOrFail($validated['course_id']);

        Gate::authorize('create', [News::class, $course]);

        $news = $course->news()->create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'user_id' => $request->user()->id,
        ]);

        if (!empty($validated['tags'])) {
            $news->tags()->attach($validated['tags']);
        }

        return response()->json($news->load('user:id,name', 'tags'), 201);
    }


    public function show(News $news)
    {
        Gate::authorize('view', $news);
        return $news->load('user:id,name', 'tags');
    }

    public function update(Request $request, News $news)
    {
        Gate::authorize('update', $news);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        $news->update($validated);

        if ($request->has('tags')) {
            $news->tags()->sync($validated['tags'] ?? []);
        }

        return response()->json($news->load('user:id,name', 'tags'));
    }


    public function destroy(News $news)
    {
        Gate::authorize('delete', $news);
        $news->delete();
        return response()->json(null, 204);
    }

    public function indexForUser(Request $request)
    {
        $user = $request->user();
        $courseIds = [];

        if ($user->role === 'professor') {
            $courseIds = $user->taughtCourses()->pluck('id');
        } else {
            $courseIds = $user->courses()->pluck('id');
        }

        $news = News::whereIn('course_id', $courseIds)
            ->with([
                'user:id,name',
                'course:id,title',
                'tags'
            ])
            ->latest()
            ->get();

        $formattedNews = $news->map(function ($item) {
            $item->courseTitle = $item->course ? $item->course->title : 'Unknown Course';
            unset($item->course);
            return $item;
        });

        return response()->json($formattedNews);
    }
}
