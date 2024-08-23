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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();            
            $table->foreignId('quiz_id')->constrained()->onUpdate('cascade')->onDelete('cascade');
            $table->string('questionType')->default("assignment");
            $table->boolean('isActive')->default(false);
            $table->string('questionText')->nullable();
            $table->string('questionImage')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};

















