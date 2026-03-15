<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Agregamos el rol
            $table->string('role')->default('operario')->after('email'); 
            
            // 🚀 CORRECCIÓN: Usamos foreignUuid en lugar de foreignId
            $table->foreignUuid('vehicle_id')->nullable()->constrained('vehicles')->nullOnDelete()->after('role');
        });
    }
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['vehicle_id']);
            $table->dropColumn(['role', 'vehicle_id']);
        });
    }
};