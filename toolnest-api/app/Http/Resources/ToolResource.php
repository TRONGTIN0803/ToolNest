<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ToolResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'tagline' => $this->tagline,
            'description' => $this->description,
            'how_to_use' => $this->how_to_use,
            'features' => $this->features ?? [],
            'component_key' => $this->component_key,
            'is_featured' => $this->is_featured,
            'is_new' => $this->is_new,
            'sort_order' => $this->sort_order,
            'usage_count' => $this->usage_count,
            'seo_title' => $this->seo_title,
            'seo_description' => $this->seo_description,
            'og_image' => $this->og_image,
            'faq' => $this->faq ?? [],
            'related_tools' => $this->related_tools ?? [],
            'category' => new CategoryResource($this->whenLoaded('category')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
