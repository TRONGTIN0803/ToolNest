<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ToolResource;
use App\Models\Category;
use App\Models\Tool;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminToolController extends Controller
{
    public function index()
    {
        return ToolResource::collection(Tool::query()->with('category')->orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $tool = Tool::query()->create($data);
        $this->refreshCategoryCounts();

        return (new ToolResource($tool->load('category')))->response()->setStatusCode(201);
    }

    public function show(Tool $tool)
    {
        return new ToolResource($tool->load('category'));
    }

    public function update(Request $request, Tool $tool)
    {
        $tool->update($this->validated($request, $tool));
        $this->refreshCategoryCounts();

        return new ToolResource($tool->load('category'));
    }

    public function destroy(Tool $tool): JsonResponse
    {
        $tool->delete();
        $this->refreshCategoryCounts();

        return response()->json(['ok' => true]);
    }

    public function toggle(Tool $tool)
    {
        $tool->update(['is_active' => ! $tool->is_active]);

        return new ToolResource($tool->load('category'));
    }

    private function validated(Request $request, ?Tool $tool = null): array
    {
        return $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:200'],
            'slug' => ['required', 'string', 'max:220', 'unique:tools,slug'.($tool ? ','.$tool->id : '')],
            'tagline' => ['nullable', 'string', 'max:300'],
            'description' => ['nullable', 'string'],
            'how_to_use' => ['nullable', 'string'],
            'features' => ['nullable', 'array'],
            'component_key' => ['required', 'string', 'max:100'],
            'is_active' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_new' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
            'usage_count' => ['sometimes', 'integer', 'min:0'],
            'seo_title' => ['nullable', 'string', 'max:160'],
            'seo_description' => ['nullable', 'string', 'max:320'],
            'og_image' => ['nullable', 'string', 'max:500'],
            'faq' => ['nullable', 'array'],
            'related_tools' => ['nullable', 'array'],
        ]);
    }

    private function refreshCategoryCounts(): void
    {
        Category::query()->each(function (Category $category) {
            $category->update(['tool_count' => $category->tools()->where('is_active', true)->count()]);
        });
    }
}
