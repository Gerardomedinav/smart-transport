<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Trip;
use App\Models\Location;
use App\Events\LocationUpdated;

class SimulateGPS extends Command
{
    protected $signature = 'fleet:gps';
    protected $description = 'Simula GPS y envía estados reales por Reverb WebSockets';

    public function handle()
    {
        $this->info('🛰️ Iniciando transmisión de 4 vehículos hacia Reverb...');
        
        // Traemos los viajes que NO estén completados
        $trips = Trip::with('vehicle')->whereNotIn('status', ['COMPLETADO'])->get();

        $state = [];
        foreach ($trips as $trip) {
            $lastLoc = Location::where('trip_id', $trip->id)->latest()->first();
            $state[$trip->id] = [
                'lat' => $lastLoc->latitude,
                'lng' => $lastLoc->longitude,
                'fuel' => $lastLoc->fuel_level,
            ];
        }

        while (true) {
            foreach ($trips as $trip) {
                // Refrescamos el viaje desde la BD por si cambió de estado
                $trip->refresh();
                $s = &$state[$trip->id];
                $license = $trip->vehicle->license_plate;

                // Si ya está averiado, sin nafta o completado, transmite que está detenido (Velocidad 0)
                if (in_array($trip->status, ['AVERIA', 'SIN_COMBUSTIBLE', 'COMPLETADO'])) {
                    $this->broadcastLocation($trip, $s, 0, true);
                    continue;
                }

                $targetLat = $trip->destination_lat;
                $targetLng = $trip->destination_lng;

                // Movemos el camión
                $s['lat'] += ($targetLat - $s['lat']) * 0.05;
                $s['lng'] += ($targetLng - $s['lng']) * 0.05;
                
                // EVENTO 1: Consumo de nafta (V4 se queda sin nafta)
                if ($license === 'PQ 789 RS') {
                    $s['fuel'] -= 1.5; 
                    if ($s['fuel'] <= 0) {
                        $s['fuel'] = 0;
                        $trip->update(['status' => 'SIN_COMBUSTIBLE']); // 🚨 BACKEND CAMBIA EL ESTADO
                        $this->error("⛽ [{$license}] Se ha quedado sin combustible.");
                    }
                } else {
                    $s['fuel'] -= 0.5;
                }

                // EVENTO 2: Avería a mitad de camino (V3 - El Colorado)
                if ($license === 'XY 456 ZW' && $trip->status !== 'AVERIA') {
                    $distLat = abs($targetLat - $s['lat']);
                    if ($distLat < 0.06) { 
                        $trip->update(['status' => 'AVERIA']); // 🚨 BACKEND CAMBIA EL ESTADO
                        $this->error("🚨 [{$license}] Avería de motor detectada.");
                    }
                }

                // LLEGADA A DESTINO
                $distLatFinal = abs($targetLat - $s['lat']);
                $distLngFinal = abs($targetLng - $s['lng']);
                if ($distLatFinal < 0.005 && $distLngFinal < 0.005) {
                    $trip->update(['status' => 'COMPLETADO']); // 🚨 BACKEND CAMBIA EL ESTADO
                    $s['lat'] = $targetLat;
                    $s['lng'] = $targetLng;
                    $this->info("🏁 [{$license}] HA LLEGADO A DESTINO.");
                }

                // Si sigue en ruta, transmite en movimiento
                if ($trip->status === 'EN_RUTA') {
                    $speed = rand(70, 85);
                    $this->broadcastLocation($trip, $s, $speed, false);
                }
            }
            sleep(2);
        }
    }

    private function broadcastLocation($trip, $state, $speed, $isStopped)
    {
        $location = Location::create([
            'trip_id' => $trip->id,
            'latitude' => $state['lat'],
            'longitude' => $state['lng'],
            'speed' => $speed,
            'fuel_level' => max(0, $state['fuel']),
            'is_stopped' => $isStopped,
        ]);

        // AL DISPARAR EL EVENTO, REVERB LLEVARÁ EL $trip->status ACTUALIZADO
        broadcast(new LocationUpdated($location));
        
        $statusStr = $isStopped ? "🛑 DETENIDO ({$trip->status})" : "⚡ {$speed}km/h";
        $this->line("📡 Transmitiendo -> {$trip->vehicle->license_plate} | {$statusStr}");
    }
}