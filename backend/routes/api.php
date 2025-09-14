<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TagController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login/biometric', [AuthController::class, 'loginBiometric']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn(Request $request) => $request->user()->load('courses'));
    Route::post('/user/register-face', [AuthController::class, 'registerFace']);
    Route::put('/user/update', [UserController::class, 'update']);
    Route::post('/enroll', [EnrollmentController::class, 'enrollWithPin']);
    Route::get('/announcements', [NewsController::class, 'indexForUser']);

    Route::apiResource('courses', CourseController::class);
    Route::get('courses/{course}/students', [CourseController::class, 'listStudents']);
    Route::post('courses/{course}/students', [CourseController::class, 'enrollStudent']);
    Route::delete('courses/{course}/students/{student}', [CourseController::class, 'removeStudent']);
    Route::get('/my-courses', [App\Http\Controllers\CourseController::class, 'indexForUser']);
    Route::post('courses/{course}/change-pin', [CourseController::class, 'changePin']);

    Route::post('materials', [MaterialController::class, 'store']);
    Route::delete('materials/{material}', [MaterialController::class, 'destroy']);
    Route::get('materials/{material}/download', [MaterialController::class, 'download']);
    Route::get('/professor/courses-with-students', [CourseController::class, 'indexWithStudents']);

    Route::get('courses/{course}/news', [NewsController::class, 'index']);

    Route::apiResource('news', NewsController::class)->except(['index']);
    Route::get('/tags', [TagController::class, 'index']);
});
