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

        while (!$this->shouldStop()) {
            foreach ($trips as $trip) {
                // Refrescamos el viaje desde la BD por si cambió de estado (ej: si le agregamos carga)
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

                // Movemos el camión matemáticamente
                $s['lat'] += ($targetLat - $s['lat']) * 0.05;
                $s['lng'] += ($targetLng - $s['lng']) * 0.05;
                
                // ==================================================
                // 🧠 EVENTO 1: CONSUMO INTELIGENTE DE COMBUSTIBLE
                // ==================================================
                if ($license === 'PQ 789 RS') {
                    // El camión de Clorinda tiene el tanque roto, pierde 1.5% por ciclo
                    $s['fuel'] -= 1.5; 
                    if ($s['fuel'] <= 0) {
                        $s['fuel'] = 0;
                        $trip->update(['status' => 'SIN_COMBUSTIBLE']); // 🚨 BACKEND CAMBIA EL ESTADO
                        $this->error("⛽ [{$license}] Se ha quedado sin combustible.");
                    }
                } else {
                    // Magia Matemática: Si tiene carga gasta el doble (0.8), si está vacío gasta normal (0.4)
                    $consumptionRate = $trip->is_loaded ? 0.8 : 0.4;
                    $s['fuel'] -= $consumptionRate;
                }

                // ==================================================
                // 🚨 EVENTO 2: AVERÍA (V3 - El Colorado)
                // ==================================================
                if ($license === 'XY 456 ZW' && $trip->status !== 'AVERIA') {
                    $distLat = abs($targetLat - $s['lat']);
                    if ($distLat < 0.06) { 
                        $trip->update(['status' => 'AVERIA']); // 🚨 BACKEND CAMBIA EL ESTADO
                        $this->error("🚨 [{$license}] Avería de motor detectada.");
                    }
                }

                // ==================================================
                // 🏁 LLEGADA A DESTINO
                // ==================================================
                $distLatFinal = abs($targetLat - $s['lat']);
                $distLngFinal = abs($targetLng - $s['lng']);
                if ($distLatFinal < 0.005 && $distLngFinal < 0.005) {
                    $trip->update(['status' => 'COMPLETADO']); // 🚨 BACKEND CAMBIA EL ESTADO
                    $s['lat'] = $targetLat;
                    $s['lng'] = $targetLng;
                    $this->info("🏁 [{$license}] HA LLEGADO A DESTINO.");
                }

                // Si sigue en ruta y no pasó nada de lo anterior, transmite en movimiento
                if ($trip->status === 'EN_RUTA') {
                    $speed = rand(70, 85);
                    $this->broadcastLocation($trip, $s, $speed, false);
                }
            }
            sleep(2);
        }

        $this->info('✅ Simulación de GPS finalizada.');
        return 0;
    }

    private function shouldStop()
    {
        return false; // Set this to true when you want to stop the command
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

        // AL DISPARAR EL EVENTO, REVERB LLEVARÁ EL $trip->status ACTUALIZADO HACIA REACT
        broadcast(new LocationUpdated($location));
        
        $statusStr = $isStopped ? "🛑 DETENIDO ({$trip->status})" : "⚡ {$speed}km/h";
        $this->line("📡 Transmitiendo -> {$trip->vehicle->license_plate} | {$statusStr}");
    }
}