<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Alert;
use App\Models\Trip;
use App\Events\LocationUpdated;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function update(Request $request)
    {
        // 1. Guardamos la posición y estado del vehículo
        $location = Location::create([
            'trip_id' => $request->trip_id,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'speed' => $request->speed ?? 0,
            'fuel_level' => $request->fuel_level ?? 100,
            'is_stopped' => $request->is_stopped ?? false,
        ]);

        // ==========================================
        // 🚨 MOTOR DE ALERTAS (Nivel Empresarial)
        // ==========================================
        $trip = Trip::find($request->trip_id);
        $vehicleId = $trip ? $trip->vehicle_id : null;

        if ($vehicleId) {
            // Regla 1: Exceso de velocidad
            if ($request->speed > 80) {
                Alert::create([
                    'vehicle_id' => $vehicleId,
                    'trip_id' => $request->trip_id,
                    'type' => 'OVERSPEED',
                    'message' => 'Exceso de velocidad: ' . $request->speed . ' km/h',
                    'latitude' => $request->latitude,
                    'longitude' => $request->longitude,
                ]);
            }

            // Regla 2: Combustible Bajo (con Anti-Spam de 1 hora)
            if ($request->fuel_level <= 15) {
                $recentAlert = Alert::where('vehicle_id', $vehicleId)
                                    ->where('type', 'LOW_FUEL')
                                    ->where('created_at', '>=', now()->subHours(1))
                                    ->exists();
                if (!$recentAlert) {
                    Alert::create([
                        'vehicle_id' => $vehicleId,
                        'trip_id' => $request->trip_id,
                        'type' => 'LOW_FUEL',
                        'message' => 'Reserva de combustible: ' . $request->fuel_level . '%',
                        'latitude' => $request->latitude,
                        'longitude' => $request->longitude,
                    ]);
                }
            }
        }

        // 2. Transmitimos a todos los Dashboards por WebSockets (Reverb)
        broadcast(new LocationUpdated($location))->toOthers();

        return response()->json([
            'status' => 'ok',
            'location_id' => $location->id
        ]);
    }
}