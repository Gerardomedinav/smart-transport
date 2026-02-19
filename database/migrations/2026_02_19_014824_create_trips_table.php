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
    Schema::create('trips', function (Blueprint $table) {
        $table->uuid('id')->primary();
        
        // Relación Enterprise: vehicle_id debe ser uuid
        // El index() asegura que las búsquedas por camión sean instantáneas
        $table->foreignUuid('vehicle_id')
              ->constrained()
              ->index() 
              ->onDelete('cascade');

        $table->dateTime('start_time');
        $table->dateTime('end_time')->nullable();
        $table->string('status')->default('in_progress')->index();
        
        $table->softDeletes(); // Tu regla de auditoría
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};
