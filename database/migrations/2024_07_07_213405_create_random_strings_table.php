<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('random_strings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('CreatedFrom');
            $table->string('random_string', 8)->unique();
            $table->unsignedBigInteger('usedFrom')->nullable();
            $table->unsignedBigInteger('lessonId')->nullable();
            $table->string('string_status')->nullable();
            $table->dateTime('used_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('random_strings');
    }
};
