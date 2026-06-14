<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title', 300);
            $table->string('slug', 320)->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->string('thumbnail', 500)->nullable();
            $table->string('author', 100)->default('ToolNest Team');
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->unsignedInteger('view_count')->default(0);
            $table->unsignedTinyInteger('read_time')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->string('seo_title', 160)->nullable();
            $table->string('seo_description', 320)->nullable();
            $table->json('related_tools')->nullable();
            $table->timestamps();

            $table->fullText(['title', 'excerpt', 'content']);
            $table->index(['status', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
