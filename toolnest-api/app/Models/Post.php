<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'thumbnail',
        'author',
        'status',
        'view_count',
        'read_time',
        'published_at',
        'seo_title',
        'seo_description',
        'related_tools',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'related_tools' => 'array',
    ];
}
