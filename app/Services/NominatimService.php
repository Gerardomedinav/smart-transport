<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NominatimService
{
    public function getAddress($lat, $lng)
    {
        try {
            // ⚠️ REGLA DE ORO DE NOMINATIM: Siempre enviar un User-Agent identificando tu app
            $response = Http::withHeaders([
                'User-Agent' => 'SmartTransport/1.0 (contacto@tu-email.com)'
            ])->timeout(5)->get('https://nominatim.openstreetmap.org/reverse', [
                'format' => 'jsonv2',
                'lat' => $lat,
                'lon' => $lng,
                'zoom' => 18, // Nivel de zoom de calles/rutas
                'addressdetails' => 1
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // Extraemos un texto limpio (ej: "Ruta Nacional 11, Formosa")
                $road = $data['address']['road'] ?? '';
                $city = $data['address']['city'] ?? $data['address']['town'] ?? $data['address']['county'] ?? '';
                $state = $data['address']['state'] ?? '';

                if ($road) {
                    return "{$road}, {$city}";
                }
                
                // Si no hay ruta exacta, devolvemos el nombre general
                return $data['display_name'] ?? 'Ubicación en mapa desconocida';
            }
        } catch (\Exception $e) {
            Log::error("Fallo API Nominatim: " . $e->getMessage());
        }

        return 'Ubicación temporalmente no disponible';
    }
}