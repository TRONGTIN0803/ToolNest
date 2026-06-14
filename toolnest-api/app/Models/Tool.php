<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tool extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'tagline',
        'description',
        'how_to_use',
        'features',
        'component_key',
        'is_active',
        'is_featured',
        'is_new',
        'sort_order',
        'usage_count',
        'seo_title',
        'seo_description',
        'og_image',
        'faq',
        'related_tools',
    ];

    protected $casts = [
        'features' => 'array',
        'faq' => 'array',
        'related_tools' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'is_new' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function usages(): HasMany
    {
        return $this->hasMany(ToolUsage::class);
    }
}
