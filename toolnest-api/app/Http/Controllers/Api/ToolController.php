<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ToolResource;
use App\Models\Tool;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ToolController extends Controller
{
    public function index()
    {
        return ToolResource::collection(
            Tool::query()->where('is_active', true)->with('category')->orderBy('sort_order')->get(),
        );
    }

    public function featured()
    {
        return ToolResource::collection(
            Tool::query()->where('is_active', true)->where('is_featured', true)->with('category')->orderByDesc('usage_count')->get(),
        );
    }

    public function popular()
    {
        return ToolResource::collection(
            Tool::query()->where('is_active', true)->with('category')->orderByDesc('usage_count')->limit(20)->get(),
        );
    }

    public function newest()
    {
        return ToolResource::collection(
            Tool::query()->where('is_active', true)->where('is_new', true)->with('category')->latest()->get(),
        );
    }

    public function show(string $slug)
    {
        return new ToolResource(
            Tool::query()->where('slug', $slug)->where('is_active', true)->with('category')->firstOrFail(),
        );
    }

    public function related(string $slug)
    {
        $tool = Tool::query()->where('slug', $slug)->firstOrFail();

        return ToolResource::collection(
            Tool::query()->whereIn('slug', $tool->related_tools ?? [])->where('is_active', true)->with('category')->get(),
        );
    }

    public function recordUsage(Request $request, string $slug, AnalyticsService $analytics): JsonResponse
    {
        $tool = Tool::query()->where('slug', $slug)->where('is_active', true)->firstOrFail();
        $analytics->recordToolUsage($tool, $request);

        return response()->json([
            'ok' => true,
            'usage_count' => $tool->fresh()->usage_count,
        ]);
    }
}
