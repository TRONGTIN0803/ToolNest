<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Models\ToolUsage;
use Illuminate\Http\JsonResponse;

class AdminAnalyticsController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'tool_uses' => ToolUsage::query()->count(),
            'tools' => Tool::query()->count(),
            'top_tools' => Tool::query()->orderByDesc('usage_count')->limit(10)->get(['name', 'slug', 'usage_count']),
        ]);
    }

    public function chart(): JsonResponse
    {
        return response()->json([]);
    }
}
