<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->when($request->route('slug') !== null, $this->content),
            'thumbnail' => $this->thumbnail,
            'author' => $this->author,
            'read_time' => $this->read_time,
            'published_at' => $this->published_at?->toISOString(),
            'seo_title' => $this->seo_title,
            'seo_description' => $this->seo_description,
            'related_tools' => $this->related_tools ?? [],
        ];
    }
}
