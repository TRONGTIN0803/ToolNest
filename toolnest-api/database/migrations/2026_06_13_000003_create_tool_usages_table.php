<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tool_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tool_id')->constrained()->cascadeOnDelete();
            $table->string('session_hash', 64)->nullable();
            $table->string('country_code', 2)->nullable();
            $table->timestamp('used_at')->useCurrent();

            $table->index(['tool_id', 'used_at']);
            $table->index('country_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tool_usages');
    }
};
