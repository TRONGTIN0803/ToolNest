<?php

namespace App\Services;

use App\Models\Tool;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    public function recordToolUsage(Tool $tool, Request $request): void
    {
        $sessionKey = implode('|', [
            (string) $request->header('X-ToolNest-Session', ''),
            (string) $request->ip(),
            substr((string) $request->userAgent(), 0, 180),
        ]);
        $sessionHash = hash('sha256', $sessionKey);

        DB::transaction(function () use ($tool, $sessionHash) {
            $tool->usages()->create([
                'session_hash' => $sessionHash,
                'country_code' => null,
            ]);

            $tool->increment('usage_count');
        });
    }
}
