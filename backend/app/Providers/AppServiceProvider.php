<?php

namespace App\Providers;

use App\Models\News;
use App\Models\Course;
use App\Models\Material;
use App\Policies\NewsPolicy;
use App\Policies\CoursePolicy;
use App\Policies\MaterialPolicy;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    protected $policies = [
        Course::class => CoursePolicy::class,
        Material::class => MaterialPolicy::class,
        News::class => NewsPolicy::class,
    ];
    
    public function register(): void
    {
    }


    public function boot(): void
    {
        
    }
}
