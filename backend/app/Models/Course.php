<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'user_id',
        'pin_code',
    ];

    public function professor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }


    public function enrolledStudents()
    {
        return $this->belongsToMany(User::class, 'course_user', 'course_id', 'user_id');
    }

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class);
    }

    public function news(): HasMany
    {
        return $this->hasMany(News::class);
    }
}
