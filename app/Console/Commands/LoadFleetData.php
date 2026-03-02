<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Vehicle;
use App\Models\Trip;
use App\Models\Location;
use Carbon\Carbon;

class LoadFleetData extends Command
{
    protected $signature = 'fleet:load';
    protected $description = 'Carga los datos iniciales de la flota';

    public function handle()
    {
        $this->info('Iniciando carga de datos avanzada...');

        Trip::truncate();
        Location::truncate();

        // 1. LOS 4 VEHÍCULOS
        $v1 = Vehicle::firstOrCreate(['license_plate' => 'AB 123 CD'], ['model' => 'Volvo FH']);
        $v2 = Vehicle::firstOrCreate(['license_plate' => 'AF 987 XX'], ['model' => 'Scania R']);
        $v3 = Vehicle::firstOrCreate(['license_plate' => 'XY 456 ZW'], ['model' => 'Mercedes Benz']); // El que se avería
        $v4 = Vehicle::firstOrCreate(['license_plate' => 'PQ 789 RS'], ['model' => 'Iveco Stralis']); // El que se queda sin nafta

        $formosaLat = -26.1849; $formosaLng = -58.1731;
        $clorindaLat = -25.2848; $clorindaLng = -57.7185;
        $piraneLat = -25.7324; $piraneLng = -59.1086;
        $coloradoLat = -26.3050; $coloradoLng = -59.3580;

 // V1: Formosa -> Clorinda (Cargado pesado)
        $t1 = Trip::create(['vehicle_id' => $v1->id, 'start_time' => Carbon::now(), 'status' => 'EN_RUTA', 'is_loaded' => true, 'cargo_weight' => 28.50, 'origin' => 'Formosa', 'destination' => 'Clorinda', 'destination_lat' => $clorindaLat, 'destination_lng' => $clorindaLng]);
        Location::create(['trip_id' => $t1->id, 'latitude' => $formosaLat, 'longitude' => $formosaLng, 'speed' => 0, 'fuel_level' => 100, 'is_stopped' => true]);

        // V2: Formosa -> Pirané (Vacío)
        $t2 = Trip::create(['vehicle_id' => $v2->id, 'start_time' => Carbon::now(), 'status' => 'EN_RUTA', 'is_loaded' => false, 'cargo_weight' => 0.00, 'origin' => 'Formosa', 'destination' => 'Pirané', 'destination_lat' => $piraneLat, 'destination_lng' => $piraneLng]);
        Location::create(['trip_id' => $t2->id, 'latitude' => $formosaLat, 'longitude' => $formosaLng, 'speed' => 0, 'fuel_level' => 100, 'is_stopped' => true]);

        // V3: El Colorado -> Formosa (Cargado al límite, por eso se averiará)
        $t3 = Trip::create(['vehicle_id' => $v3->id, 'start_time' => Carbon::now(), 'status' => 'EN_RUTA', 'is_loaded' => true, 'cargo_weight' => 32.00, 'origin' => 'El Colorado', 'destination' => 'Formosa', 'destination_lat' => $formosaLat, 'destination_lng' => $formosaLng]);
        Location::create(['trip_id' => $t3->id, 'latitude' => $coloradoLat, 'longitude' => $coloradoLng, 'speed' => 0, 'fuel_level' => 100, 'is_stopped' => true]);

        // V4: Clorinda -> Formosa (Vacío, pero pierde nafta)
        $t4 = Trip::create(['vehicle_id' => $v4->id, 'start_time' => Carbon::now(), 'status' => 'EN_RUTA', 'is_loaded' => false, 'cargo_weight' => 0.00, 'origin' => 'Clorinda', 'destination' => 'Formosa', 'destination_lat' => $formosaLat, 'destination_lng' => $formosaLng]);
        Location::create(['trip_id' => $t4->id, 'latitude' => $clorindaLat, 'longitude' => $clorindaLng, 'speed' => 0, 'fuel_level' => 20, 'is_stopped' => true]);
        
        $this->info('✅ Flota de 4 camiones desplegada en sus orígenes.');
    }
}