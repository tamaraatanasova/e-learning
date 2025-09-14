<?php

namespace App\Models;

use App\Models\News;
use App\Models\Course;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsToMany; 

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;


    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'face_embedding', 
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];


    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed', 
    ];

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_user', 'user_id', 'course_id');
    }
    public function news(): HasMany
    {
        return $this->hasMany(News::class);
    }
    public function enrolledCourses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_user', 'user_id', 'course_id');
    }
    public function taughtCourses()
    {
        return $this->hasMany(Course::class, 'user_id');
    }
}
