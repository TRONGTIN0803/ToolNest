<?php

namespace App\Services;

use App\Models\Post;
use App\Models\Tool;
use Illuminate\Database\Eloquent\Collection;

class SearchService
{
    public function tools(string $query, int $limit = 20): Collection
    {
        return Tool::query()
            ->where('is_active', true)
            ->with('category')
            ->where(function ($builder) use ($query) {
                $builder
                    ->where('name', 'like', "%{$query}%")
                    ->orWhere('slug', 'like', "%{$query}%")
                    ->orWhere('tagline', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%")
                    ->orWhere('component_key', 'like', "%{$query}%");
            })
            ->orderByDesc('usage_count')
            ->limit($limit)
            ->get();
    }

    public function posts(string $query, int $limit = 10): Collection
    {
        return Post::query()
            ->where('status', 'published')
            ->where(function ($builder) use ($query) {
                $builder
                    ->where('title', 'like', "%{$query}%")
                    ->orWhere('excerpt', 'like', "%{$query}%")
                    ->orWhere('content', 'like', "%{$query}%");
            })
            ->latest('published_at')
            ->limit($limit)
            ->get();
    }

    public function suggestions(string $query = '', int $limit = 8): Collection
    {
        return Tool::query()
            ->where('is_active', true)
            ->when($query !== '', function ($builder) use ($query) {
                $builder
                    ->where('name', 'like', "%{$query}%")
                    ->orWhere('slug', 'like', "%{$query}%")
                    ->orWhere('tagline', 'like', "%{$query}%");
            })
            ->orderByDesc('usage_count')
            ->limit($limit)
            ->get();
    }
}
