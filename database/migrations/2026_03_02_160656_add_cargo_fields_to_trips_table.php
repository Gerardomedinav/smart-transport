<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('trips', function (Blueprint $table) {
            $table->boolean('is_loaded')->default(false)->after('status');
            $table->decimal('cargo_weight', 8, 2)->default(0.00)->after('is_loaded'); // En Toneladas
        });
    }

    public function down(): void
    {
        Schema::table('trips', function (Blueprint $table) {
            $table->dropColumn(['is_loaded', 'cargo_weight']);
        });
    }
};