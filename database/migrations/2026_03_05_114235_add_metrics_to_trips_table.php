<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('trips', function (Blueprint $table) {
            $table->dateTime('estimated_arrival_time')->nullable()->after('status'); // ETA calculado al salir
            $table->dateTime('actual_arrival_time')->nullable()->after('estimated_arrival_time'); // Llegada real
            $table->integer('delay_minutes')->default(0)->after('actual_arrival_time'); // Minutos de retraso
            $table->decimal('delivered_cargo', 8, 2)->nullable()->after('cargo_weight'); // Carga entregada exitosamente
        });
    }

    public function down(): void
    {
        Schema::table('trips', function (Blueprint $table) {
            $table->dropColumn(['estimated_arrival_time', 'actual_arrival_time', 'delay_minutes', 'delivered_cargo']);
        });
    }
};