<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Http\Resources\ToolResource;
use App\Models\Tool;
use App\Services\SearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request, SearchService $search): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:120'],
        ]);
        $query = trim((string) ($validated['q'] ?? ''));

        if ($query === '') {
            return response()->json(['tools' => [], 'posts' => []]);
        }

        return response()->json([
            'query' => $query,
            'tools' => ToolResource::collection($search->tools($query)),
            'posts' => PostResource::collection($search->posts($query)),
        ]);
    }

    public function suggestions(Request $request, SearchService $search): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:120'],
        ]);
        $query = trim((string) ($validated['q'] ?? ''));

        return response()->json([
            'query' => $query,
            'suggestions' => $search->suggestions($query)->map(fn (Tool $tool) => [
                'name' => $tool->name,
                'slug' => $tool->slug,
                'tagline' => $tool->tagline,
            ])->values(),
        ]);
    }
}
