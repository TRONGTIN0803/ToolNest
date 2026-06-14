<?php

use App\Http\Controllers\Admin\AdminAnalyticsController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Admin\AdminToolController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\ToolController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{slug}', [CategoryController::class, 'show']);

    Route::get('/tools', [ToolController::class, 'index']);
    Route::get('/tools/featured', [ToolController::class, 'featured']);
    Route::get('/tools/popular', [ToolController::class, 'popular']);
    Route::get('/tools/new', [ToolController::class, 'newest']);
    Route::get('/tools/{slug}', [ToolController::class, 'show']);
    Route::get('/tools/{slug}/related', [ToolController::class, 'related']);
    Route::post('/tools/{slug}/usage', [ToolController::class, 'recordUsage'])->middleware('throttle:tool-usage');

    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{slug}', [PostController::class, 'show']);

    Route::get('/search', [SearchController::class, 'search']);
    Route::get('/search/suggestions', [SearchController::class, 'suggestions']);

    Route::post('/admin/login', [AdminAuthController::class, 'login']);

    Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/stats', [AdminAnalyticsController::class, 'stats']);
        Route::get('/stats/chart', [AdminAnalyticsController::class, 'chart']);
        Route::apiResource('/tools', AdminToolController::class);
        Route::patch('/tools/{tool}/toggle', [AdminToolController::class, 'toggle']);
        Route::apiResource('/categories', AdminCategoryController::class);
        Route::get('/settings', [AdminSettingsController::class, 'index']);
        Route::put('/settings', [AdminSettingsController::class, 'update']);
    });
});
