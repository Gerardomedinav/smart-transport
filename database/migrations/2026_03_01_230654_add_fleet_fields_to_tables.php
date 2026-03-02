<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('trips', function (Blueprint $table) {
            $table->string('origin')->nullable();
            $table->string('destination')->nullable();
            $table->decimal('destination_lat', 10, 8)->nullable();
            $table->decimal('destination_lng', 10, 8)->nullable();
            $table->timestamp('estimated_arrival')->nullable();
        });

        Schema::table('locations', function (Blueprint $table) {
            $table->integer('speed')->default(0);
            $table->decimal('fuel_level', 5, 2)->default(100.00); 
            $table->boolean('is_stopped')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('trips', function (Blueprint $table) {
            $table->dropColumn(['origin', 'destination', 'destination_lat', 'destination_lng', 'estimated_arrival']);
        });
        
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn(['speed', 'fuel_level', 'is_stopped']);
        });
    }
};