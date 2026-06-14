<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Models\Post;

class PostController extends Controller
{
    public function index()
    {
        return PostResource::collection(
            Post::query()->where('status', 'published')->latest('published_at')->paginate(12),
        );
    }

    public function show(string $slug)
    {
        return new PostResource(
            Post::query()->where('slug', $slug)->where('status', 'published')->firstOrFail(),
        );
    }
}
