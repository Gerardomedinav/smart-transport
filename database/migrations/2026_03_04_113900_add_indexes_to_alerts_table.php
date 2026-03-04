<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('alerts', function (Blueprint $table) {
            // 🚀 Aceleradores de Búsqueda
            $table->index('type');
            $table->index('created_at'); // Crucial porque usamos ->latest()
            $table->index('vehicle_id');
        });
    }

    public function down(): void
    {
        Schema::table('alerts', function (Blueprint $table) {
            $table->dropIndex(['type']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['vehicle_id']);
        });
    }
};