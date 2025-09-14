<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class MaterialController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'file' => 'required|file|mimes:pdf,doc,docx,ppt,pptx,zip,rar|max:10240'
        ]);

        $course = Course::findOrFail($validated['course_id']);

        Gate::authorize('update', $course);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $filePath = $file->store('materials', 'public');

        $material = $course->materials()->create([
            'file_name' => $originalName,
            'file_path' => $filePath,
            'file_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
        ]);

        return response()->json($material, 201);
    }

    public function destroy(Material $material)
    {
        Gate::authorize('update', $material->course);

        Storage::disk('public')->delete($material->file_path);
        $material->delete();

        return response()->json(null, 204);
    }

    public function download(Material $material)
    {
        Gate::authorize('view', $material->course);

        return Storage::disk('public')->download($material->file_path, $material->file_name);
    }
}
