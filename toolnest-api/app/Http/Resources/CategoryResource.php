<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'icon' => $this->icon,
            'color' => $this->color,
            'sort_order' => $this->sort_order,
            'tool_count' => $this->tool_count,
            'seo_title' => $this->seo_title,
            'seo_description' => $this->seo_description,
            'tools' => ToolResource::collection($this->whenLoaded('tools')),
        ];
    }
}
