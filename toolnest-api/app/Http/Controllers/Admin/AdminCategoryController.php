<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminCategoryController extends Controller
{
    public function index()
    {
        return CategoryResource::collection(Category::query()->orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $category = Category::query()->create($this->validated($request));

        return (new CategoryResource($category))->response()->setStatusCode(201);
    }

    public function show(Category $category)
    {
        return new CategoryResource($category->load('tools'));
    }

    public function update(Request $request, Category $category)
    {
        $category->update($this->validated($request, $category));

        return new CategoryResource($category);
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->tools()->exists()) {
            return response()->json([
                'message' => 'Cannot delete a category that still has tools.',
            ], 422);
        }

        $category->delete();

        return response()->json(['ok' => true]);
    }

    private function validated(Request $request, ?Category $category = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['required', 'string', 'max:120', 'unique:categories,slug'.($category ? ','.$category->id : '')],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:7'],
            'sort_order' => ['sometimes', 'integer'],
            'tool_count' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'seo_title' => ['nullable', 'string', 'max:160'],
            'seo_description' => ['nullable', 'string', 'max:320'],
        ]);
    }
}
