<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key', 100)->unique();
            $table->text('value')->nullable();
            $table->enum('type', ['string', 'json', 'boolean'])->default('string');
        });

        Schema::create('ad_placements', function (Blueprint $table) {
            $table->id();
            $table->string('slot_key', 100)->unique();
            $table->string('name', 100)->nullable();
            $table->text('ad_code')->nullable();
            $table->boolean('is_active')->default(true);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_placements');
        Schema::dropIfExists('settings');
    }
};
