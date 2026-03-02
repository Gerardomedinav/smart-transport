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
        Schema::create('alerts', function (Blueprint $table) {
            // 1. Usamos UUID como clave primaria para mantener la coherencia
            $table->uuid('id')->primary();
            
            // 2. Claves foráneas también como UUID
            $table->foreignUuid('vehicle_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('trip_id')->nullable()->constrained()->onDelete('cascade');
            
            // 3. Tipificación y mensaje de la alerta
            $table->string('type'); // Ej: 'LOW_FUEL', 'OVERSPEED', 'LONG_STOP'
            $table->text('message');
            
            // 4. Coordenadas exactas del incidente
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 10, 8)->nullable();
            
            // 5. Control de lectura en la Terminal de Formosa
            $table->boolean('is_acknowledged')->default(false);
            
            // 6. Fechas de creación y actualización
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};