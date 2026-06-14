<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ToolUsage extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'tool_id',
        'session_hash',
        'country_code',
        'used_at',
    ];

    protected $casts = [
        'used_at' => 'datetime',
    ];

    public function tool(): BelongsTo
    {
        return $this->belongsTo(Tool::class);
    }
}
