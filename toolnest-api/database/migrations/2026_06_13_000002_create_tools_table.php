<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tools', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained();
            $table->string('name', 200);
            $table->string('slug', 220)->unique();
            $table->string('tagline', 300)->nullable();
            $table->text('description')->nullable();
            $table->longText('how_to_use')->nullable();
            $table->json('features')->nullable();
            $table->string('component_key', 100);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new')->default(false);
            $table->smallInteger('sort_order')->default(0);
            $table->unsignedInteger('usage_count')->default(0);
            $table->string('seo_title', 160)->nullable();
            $table->string('seo_description', 320)->nullable();
            $table->string('og_image', 500)->nullable();
            $table->json('faq')->nullable();
            $table->json('related_tools')->nullable();
            $table->timestamps();

            $table->index('slug');
            $table->index('category_id');
            $table->index('is_featured');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tools');
    }
};
