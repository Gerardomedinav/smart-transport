<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Trip;
use App\Models\Location;
use App\Models\Alert;
use App\Events\LocationUpdated;

class SimulateGPS extends Command
{
    protected $signature = 'fleet:gps';
    protected $description = 'Simula GPS, envía estados por Reverb y audita alertas complejas';

    public function handle()
    {
        $this->info('🛰️ Iniciando transmisión y auditoría de flota...');
        
        $trips = Trip::with('vehicle')->whereNotIn('status', ['COMPLETADO'])->get();

        // 🧠 MÁQUINA DE ESTADOS: Aquí recordamos qué alertas ya se enviaron para no hacer spam
        $state = [];
        foreach ($trips as $trip) {
            $lastLoc = Location::where('trip_id', $trip->id)->latest()->first();
            $state[$trip->id] = [
                'lat' => $lastLoc->latitude,
                'lng' => $lastLoc->longitude,
                'fuel' => $lastLoc->fuel_level,
                'weight' => $trip->cargo_weight, // Guardamos el peso inicial
                'alert_salida' => false,
                'alert_combustible_bajo' => false,
                'alert_velocidad' => false,
                'tiempo_detenido' => 0, // Segundos detenido
                'alert_detencion' => false,
            ];
        }

        while (true) {
            foreach ($trips as $trip) {
                // Refrescamos para detectar cambios hechos a mano en la Base de Datos (ej: Peso)
                $trip->refresh();
                $s = &$state[$trip->id];
                $license = $trip->vehicle->license_plate;

                // ==========================================
                // 1️⃣ ALERTA: SALIDA (Solo la primera vez)
                // ==========================================
                if (!$s['alert_salida']) {
                    $this->crearAlerta($trip, $s, 'SALIDA', "Inicio de ruta desde {$trip->origin} hacia {$trip->destination}.");
                    $s['alert_salida'] = true;
                }

                // ==========================================
                // 2️⃣ ALERTA: MODIFICACIÓN DE CARGA EN RUTA
                // ==========================================
                if ($trip->is_loaded && $trip->cargo_weight != $s['weight']) {
                    $this->crearAlerta($trip, $s, 'CARGA_MODIFICADA', "El peso de la carga fue alterado de {$s['weight']} a {$trip->cargo_weight} Ton.");
                    $s['weight'] = $trip->cargo_weight; // Actualizamos la memoria
                    $this->warn("📦 [{$license}] Cambio de peso detectado.");
                }

                // Si ya terminó su ciclo, solo transmite detenido
                if (in_array($trip->status, ['AVERIA', 'SIN_COMBUSTIBLE', 'COMPLETADO'])) {
                    $this->broadcastLocation($trip, $s, 0, true);
                    continue;
                }

                $targetLat = $trip->destination_lat;
                $targetLng = $trip->destination_lng;

                // Movimiento
                $s['lat'] += ($targetLat - $s['lat']) * 0.05;
                $s['lng'] += ($targetLng - $s['lng']) * 0.05;
                
                // Consumo de Combustible
                if ($license === 'PQ 789 RS') {
                    $s['fuel'] -= 1.5; 
                    if ($s['fuel'] <= 0) {
                        $s['fuel'] = 0;
                        $trip->update(['status' => 'SIN_COMBUSTIBLE']); 
                        $this->crearAlerta($trip, $s, 'SIN_COMBUSTIBLE', "El vehículo se ha quedado sin combustible en la ruta.");
                        $this->error("⛽ [{$license}] Tanque vacío.");
                    }
                } else {
                    $consumptionRate = $trip->is_loaded ? 0.8 : 0.4;
                    $s['fuel'] -= $consumptionRate;
                }

                // ==========================================
                // 3️⃣ ALERTA: COMBUSTIBLE BAJO (< 15%)
                // ==========================================
                if ($s['fuel'] <= 15 && $s['fuel'] > 0 && !$s['alert_combustible_bajo']) {
                    $this->crearAlerta($trip, $s, 'COMBUSTIBLE_BAJO', "Nivel crítico de combustible: " . round($s['fuel'], 1) . "%.");
                    $s['alert_combustible_bajo'] = true;
                    $this->warn("⚠️ [{$license}] Combustible bajo.");
                }

                // Avería V3
                if ($license === 'XY 456 ZW' && $trip->status !== 'AVERIA') {
                    $distLat = abs($targetLat - $s['lat']);
                    if ($distLat < 0.06) { 
                        $trip->update(['status' => 'AVERIA']); 
                        $this->crearAlerta($trip, $s, 'AVERIA', "Falla mecánica crítica reportada en el motor.");
                        $this->error("🚨 [{$license}] Avería de motor.");
                    }
                }

                // ==========================================
                // 4️⃣ ALERTA: LLEGADA A DESTINO
                // ==========================================
                $distLatFinal = abs($targetLat - $s['lat']);
                $distLngFinal = abs($targetLng - $s['lng']);
                if ($distLatFinal < 0.005 && $distLngFinal < 0.005) {
                    $trip->update(['status' => 'COMPLETADO']);
                    $s['lat'] = $targetLat;
                    $s['lng'] = $targetLng;
                    $this->crearAlerta($trip, $s, 'LLEGADA_DESTINO', "El vehículo llegó exitosamente a {$trip->destination}.");
                    $this->info("🏁 [{$license}] LLEGÓ A DESTINO.");
                }

                // Simulación de Velocidad y Paradas
                if ($trip->status === 'EN_RUTA') {
                    $speed = rand(70, 85);

                    // ==========================================
                    // 5️⃣ ALERTA: EXCESO DE VELOCIDAD (> 80 km/h)
                    // ==========================================
                    if ($speed > 80) {
                        if (!$s['alert_velocidad']) {
                            $this->crearAlerta($trip, $s, 'EXCESO_VELOCIDAD', "El vehículo excedió el límite de velocidad a {$speed} km/h.");
                            $s['alert_velocidad'] = true; // No hace spam
                        }
                    } else {
                        // Si baja de 80, reseteamos la alerta para que vuelva a avisar si acelera de nuevo
                        $s['alert_velocidad'] = false; 
                    }

                    // Forzamos una parada al camión AF 987 XX para probar la alerta de 15 mins
                    if ($license === 'AF 987 XX' && $s['fuel'] < 80 && $s['fuel'] > 60) {
                        $speed = 0; 
                    }

                    // ==========================================
                    // 6️⃣ ALERTA: DETENIDO MUCHO TIEMPO
                    // ==========================================
                    if ($speed == 0) {
                        $s['tiempo_detenido'] += 2; // Suma los 2 seg del sleep()
                        
                        // ⏱️ NOTA: Puse 14 segundos (14) para que puedas probarlo AHORA MISMO.
                        // En producción cámbialo a 900 (15 minutos x 60 segundos).
                        $limiteSegundos = 14; 

                        if ($s['tiempo_detenido'] >= $limiteSegundos && !$s['alert_detencion']) {
                            $this->crearAlerta($trip, $s, 'DETENCION_PROLONGADA', "Vehículo detenido en ruta por un tiempo inusual.");
                            $s['alert_detencion'] = true;
                            $this->error("🛑 [{$license}] Alerta de detención prolongada.");
                        }
                    } else {
                        // Si se mueve, reiniciamos el cronómetro de paradas
                        $s['tiempo_detenido'] = 0;
                        $s['alert_detencion'] = false;
                    }

                    $this->broadcastLocation($trip, $s, $speed, ($speed == 0));
                }
            }
            sleep(2);
        }
    }

    // Función Helper para crear alertas más fácil y limpio
  // Función Helper para crear alertas más fácil y limpio
// Función Helper para crear alertas
    private function crearAlerta($trip, $state, $tipo, $mensaje)
    {
        $address = null;
        
        // 🚨 LISTA DE ALERTAS CRÍTICAS QUE REQUIEREN GEOCODIFICACIÓN (API)
        $alertasCriticas = ['AVERIA', 'SIN_COMBUSTIBLE', 'PANICO', 'AUXILIO', 'GPS_APAGADO'];

        if (in_array($tipo, $alertasCriticas)) {
            $geocoder = new \App\Services\NominatimService();
            // Traducimos coordenadas a nombre de ruta
            $address = $geocoder->getAddress($state['lat'], $state['lng']);
            $this->warn("🗺️ Traduciendo ubicación: {$address}"); // Log para que lo veas en la consola
        }

        $alert = Alert::create([
            'vehicle_id' => $trip->vehicle_id,
            'trip_id' => $trip->id,
            'type' => $tipo,
            'message' => $mensaje,
            'latitude' => $state['lat'],
            'longitude' => $state['lng'],
            'address' => $address // Guardamos la dirección en texto
        ]);

        broadcast(new \App\Events\AlertCreated($alert));
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

        broadcast(new LocationUpdated($location));
        
        $statusStr = $isStopped ? "🛑 DETENIDO ({$trip->status})" : "⚡ {$speed}km/h";
        $this->line("📡 Transmitiendo -> {$trip->vehicle->license_plate} | {$statusStr}");
    }
}