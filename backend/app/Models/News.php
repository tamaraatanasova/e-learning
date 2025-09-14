<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'user_id',
        'course_id',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }


    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }


    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'news_tag');
    }
}
