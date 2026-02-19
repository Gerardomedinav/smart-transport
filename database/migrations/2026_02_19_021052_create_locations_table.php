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
    Schema::create('locations', function (Blueprint $table) {
        $table->uuid('id')->primary();
        
        // Relación con el viaje: Usamos foreignUuid para mantener la coherencia
        // El index() es vital para que el mapa cargue rápido
        $table->foreignUuid('trip_id')->constrained()->onDelete('cascade')->index();

        // Datos GPS: Usamos decimal(10, 8) para latitud y (11, 8) para longitud
        // Esto da una precisión de milímetros, ideal para logística.
        $table->decimal('latitude', 10, 8);
        $table->decimal('longitude', 11, 8);

        $table->timestamps(); // Registra el momento exacto de la coordenada
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
