<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSettingsController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Setting::query()->pluck('value', 'key'));
    }

    public function update(Request $request): JsonResponse
    {
        foreach ($request->all() as $key => $value) {
            Setting::query()->updateOrCreate(['key' => $key], ['value' => $value, 'type' => 'string']);
        }

        return response()->json(['ok' => true]);
    }
}
