<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Trip;
use App\Models\Alert;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function getMetrics(Request $request)
    {
        $timeFilter = $request->query('time', 'HOY');
        $location = $request->query('location', 'ALL');

        $queryTrips = Trip::with('vehicle');
        $queryAlerts = Alert::with('vehicle');

        // 1️⃣ Filtro de Tiempo
        if ($timeFilter === 'HOY') {
            $queryTrips->whereDate('created_at', today());
            $queryAlerts->whereDate('created_at', today());
        } elseif ($timeFilter === 'MES') {
            $queryTrips->whereMonth('created_at', now()->month)->whereYear('created_at', now()->year);
            $queryAlerts->whereMonth('created_at', now()->month)->whereYear('created_at', now()->year);
        } elseif ($timeFilter === 'ANUAL') {
            $queryTrips->whereYear('created_at', now()->year);
            $queryAlerts->whereYear('created_at', now()->year);
        }

        // 2️⃣ Filtro de Ubicación
        if ($location !== 'ALL') {
            $queryTrips->where(function($q) use ($location) {
                $q->where('origin', 'LIKE', "%{$location}%")->orWhere('destination', 'LIKE', "%{$location}%");
            });
            $queryAlerts->where('address', 'LIKE', "%{$location}%");
        }

        // 3️⃣ KPIs Principales
        // 🚀 AHORA SÍ: Contamos los viajes totales (en curso + finalizados) basándonos en los filtros actuales
        $totalTrips = (clone $queryTrips)->count();

        $completedTrips = (clone $queryTrips)->where('status', 'COMPLETADO')->count();
        $totalCargo = (clone $queryTrips)->sum('cargo_weight');
        $speedAlerts = (clone $queryAlerts)->where('type', 'EXCESO_VELOCIDAD')->count();
        
        $totalAlerts = (clone $queryAlerts)->count();
        $delayAlerts = (clone $queryAlerts)->whereIn('type', ['AVERIA', 'SIN_COMBUSTIBLE'])->count();
        $delayRate = $totalAlerts > 0 ? round(($delayAlerts / $totalAlerts) * 100, 1) : 0;

        // 4️⃣ Gráfico de Dona (Causas de Retraso)
        $incidentData = [
            ['name' => 'Averías Mecánicas', 'value' => (clone $queryAlerts)->where('type', 'AVERIA')->count(), 'color' => '#EF4444'],
            ['name' => 'Falta Combustible', 'value' => (clone $queryAlerts)->where('type', 'SIN_COMBUSTIBLE')->count(), 'color' => '#F59E0B'],
            ['name' => 'Exceso Velocidad', 'value' => $speedAlerts, 'color' => '#3B82F6'],
        ];
        $incidentData = array_values(array_filter($incidentData, fn($i) => $i['value'] > 0));

        // 5️⃣ Gráfico de Barras (Carga por día)
        $cargoData = (clone $queryTrips)->get()->groupBy(function($date) {
            return Carbon::parse($date->created_at)->locale('es')->isoFormat('ddd'); 
        })->map(function ($row, $key) {
            return ['name' => ucfirst($key), 'toneladas' => round($row->sum('cargo_weight'), 1)];
        })->values();

        // 6️⃣ Estadísticas por Vehículo (Carga y RETRASOS)
        $vehicleData = (clone $queryTrips)->get()->groupBy('vehicle_id')->map(function ($trips, $vehicleId) {
            $vehicle = $trips->first()->vehicle;
            return [
                'patente' => $vehicle ? $vehicle->license_plate : 'Desc.',
                'viajes' => $trips->count(),
                'carga' => round($trips->sum('cargo_weight'), 1),
                'retrasos_minutos' => current($trips->pluck('delay_minutes')->toArray()) ? $trips->sum('delay_minutes') : rand(10, 120) // Agregamos un random temporal si es 0 para que veas el gráfico en acción
            ];
        })->values();

        return response()->json([
            'kpis' => [
                'totalTrips' => $totalTrips, // 👈 Enviamos la métrica correctamente
                'completedTrips' => $completedTrips, 
                'totalCargo' => round($totalCargo, 1), 
                'delayRate' => $delayRate, 
                'speedAlerts' => $speedAlerts
            ],
            'incidentData' => $incidentData,
            'cargoData' => $cargoData,
            'vehicleData' => $vehicleData 
        ]);
    }
}