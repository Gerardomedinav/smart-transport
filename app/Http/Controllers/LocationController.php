<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Alert;
use App\Models\Trip;
use App\Events\LocationUpdated;
use App\Events\AlertCreated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class LocationController extends Controller
{
    public function update(Request $request)
    {
        $location = Location::create([
            'trip_id' => $request->trip_id,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'speed' => $request->speed ?? 0,
            'fuel_level' => $request->fuel_level ?? 100,
            'is_stopped' => $request->is_stopped ?? false,
        ]);

        $address = $this->getReadableAddress($request->latitude, $request->longitude);
        $trip = Trip::find($request->trip_id);
        $vehicleId = $trip ? $trip->vehicle_id : null;

        if ($vehicleId) {
            if ($request->speed > 80) {
                $alert = Alert::create([
                    'vehicle_id' => $vehicleId,
                    'trip_id' => $request->trip_id,
                    'type' => 'OVERSPEED',
                    'message' => 'Exceso de velocidad: ' . $request->speed . ' km/h',
                    'latitude' => $request->latitude,
                    'longitude' => $request->longitude,
                    'address' => $address, // 👈 GUARDADO
                ]);
                broadcast(new AlertCreated($alert))->toOthers();
            }

            if ($request->fuel_level <= 15) {
                $recentAlert = Alert::where('vehicle_id', $vehicleId)
                                    ->where('type', 'LOW_FUEL')
                                    ->where('created_at', '>=', now()->subHours(1))
                                    ->exists();
                if (!$recentAlert) {
                    $alert = Alert::create([
                        'vehicle_id' => $vehicleId,
                        'trip_id' => $request->trip_id,
                        'type' => 'LOW_FUEL',
                        'message' => 'Reserva de combustible: ' . $request->fuel_level . '%',
                        'latitude' => $request->latitude,
                        'longitude' => $request->longitude,
                        'address' => $address, // 👈 GUARDADO
                    ]);
                    broadcast(new AlertCreated($alert))->toOthers();
                }
            }
        }

        // 🚀 PASAMOS ADDRESS AL EVENTO
        broadcast(new LocationUpdated($location, $address))->toOthers();

        return response()->json(['status' => 'ok', 'address' => $address]);
    }

    private function getReadableAddress($lat, $lng)
    {
        try {
            $response = Http::withHeaders(['User-Agent' => 'SmartTransport'])
                ->get("https://nominatim.openstreetmap.org/reverse", [
                    'format' => 'json', 'lat' => $lat, 'lon' => $lng,
                ]);
            $data = $response->json();
            $road = $data['address']['road'] ?? 'Ruta';
            $city = $data['address']['city'] ?? $data['address']['town'] ?? $data['address']['village'] ?? 'Localidad';
            return "{$road}, {$city}, Formosa";
        } catch (\Exception $e) {
            return "COORD: {$lat}, {$lng}";
        }
    }
}