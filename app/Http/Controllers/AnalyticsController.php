<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Trip;
use App\Models\Alert;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function getMetrics(Request $request)
    {
        try {
            $time = $request->query('time', 'HOY');
            $ranges = $this->resolveRanges($time);
            $curr = $ranges['curr'];
            $prev = $ranges['prev'];

            // 1. KPIs con lógica de tendencia
            $dataCurrent = $this->getStatsByRange($curr['start'], $curr['end']);
            $dataPrevious = $this->getStatsByRange($prev['start'], $prev['end']);

            // 2. Mapa de calor (Infracciones por Ruta)
            $heatMapData = Alert::whereBetween('created_at', [$curr['start'], $curr['end']])
                ->whereIn('type', ['EXCESO_VELOCIDAD', 'OVERSPEED'])
                ->get()
                ->map(function($a) {
                    $addr = strtoupper($a->address ?? '');
                    if (str_contains($addr, '11')) return 'Ruta 11';
                    if (str_contains($addr, '81')) return 'Ruta 81';
                    return 'Zonas Urbanas';
                })->countBy()->map(fn($v, $k) => ['name' => $k, 'value' => $v])->values();

            return response()->json([
                'kpis' => [
                    'trips' => ['val' => $dataCurrent['trips'], 'trend' => $this->trend($dataCurrent['trips'], $dataPrevious['trips'])],
                    'cargo' => ['val' => round($dataCurrent['cargo'], 1), 'trend' => $this->trend($dataCurrent['cargo'], $dataPrevious['cargo'])],
                    'speed' => ['val' => $dataCurrent['speed'], 'trend' => $this->trend($dataCurrent['speed'], $dataPrevious['speed'])],
                    'efficiency' => ['val' => $dataCurrent['efficiency'], 'trend' => $this->trend($dataCurrent['efficiency'], $dataPrevious['efficiency'])],
                    'maintenance' => Alert::where('type', 'AVERIA')->where('created_at', '>=', now()->subDays(30))->count()
                ],
                'cargoData' => $this->getDynamicHistory($time, $curr['start']),
                'vehicleData' => $this->getVehicleStats($curr['start'], $curr['end']),
                'incidentData' => [
                    ['name' => 'Averías', 'value' => $dataCurrent['averias'], 'color' => '#EF4444'],
                    ['name' => 'Logística', 'value' => $dataCurrent['fuel'], 'color' => '#F59E0B'],
                ],
                'heatMapData' => $heatMapData
            ]);
        } catch (\Exception $e) {
            // Si algo falla, devolvemos error 500 con el mensaje para debuggear
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function resolveRanges($time) {
        $curr = ['end' => now()];
        if ($time === 'SEMANA') { 
            $curr['start'] = now()->startOfWeek(); 
            $prev = ['start' => now()->subWeek()->startOfWeek(), 'end' => now()->subWeek()->endOfWeek()]; 
        } elseif ($time === 'MES') { 
            $curr['start'] = now()->startOfMonth(); 
            $prev = ['start' => now()->subMonth()->startOfMonth(), 'end' => now()->subMonth()->endOfMonth()]; 
        } elseif ($time === 'ANUAL') { 
            $curr['start'] = now()->startOfYear(); 
            $prev = ['start' => now()->subYear()->startOfYear(), 'end' => now()->subYear()->endOfYear()]; 
        } else { 
            $curr['start'] = now()->startOfDay(); 
            $prev = ['start' => now()->subDay()->startOfDay(), 'end' => now()->subDay()->endOfDay()]; 
        }
        return ['curr' => $curr, 'prev' => $prev];
    }

    private function getStatsByRange($start, $end) {
        $trips = Trip::whereBetween('created_at', [$start, $end])->count();
        $cargo = Trip::whereBetween('created_at', [$start, $end])->sum('cargo_weight');
        return [
            'trips' => $trips, 'cargo' => $cargo,
            'speed' => Alert::whereBetween('created_at', [$start, $end])->where('type', 'EXCESO_VELOCIDAD')->count(),
            'averias' => Alert::whereBetween('created_at', [$start, $end])->where('type', 'AVERIA')->count(),
            'fuel' => Alert::whereBetween('created_at', [$start, $end])->whereIn('type', ['SIN_COMBUSTIBLE', 'LOW_FUEL'])->count(),
            'efficiency' => $trips > 0 ? round($cargo / ($trips * 135), 2) : 0
        ];
    }

    // 🚀 MEJORA: Agrupación DB-Agnostic (Funciona en MySQL, Postgres y SQLite)
    private function getDynamicHistory($time, $start) {
        $data = Trip::where('created_at', '>=', $start)->get();

        if ($time === 'ANUAL') {
            return $data->groupBy(fn($d) => Carbon::parse($d->created_at)->isoFormat('MMM'))
                ->map(fn($group, $key) => ['name' => $key, 'toneladas' => round($group->sum('cargo_weight'), 1)])->values();
        } elseif ($time === 'HOY') {
            return $data->groupBy(fn($d) => Carbon::parse($d->created_at)->format('H:00'))
                ->map(fn($group, $key) => ['name' => $key, 'toneladas' => round($group->sum('cargo_weight'), 1)])->values();
        }

        return $data->groupBy(fn($d) => Carbon::parse($d->created_at)->isoFormat('DD/MM'))
            ->map(fn($group, $key) => ['name' => $key, 'toneladas' => round($group->sum('cargo_weight'), 1)])->values();
    }

    private function trend($c, $p) { return ($p <= 0) ? 0 : round((($c - $p) / $p) * 100, 1); }

    private function getVehicleStats($s, $e) {
        return Trip::whereBetween('trips.created_at', [$s, $e])
            ->whereNotNull('vehicle_id')
            ->with('vehicle')
            ->get()
            ->groupBy('vehicle_id')
            ->map(function($trips) {
                return [
                    'patente' => $trips->first()->vehicle->license_plate ?? 'S/P',
                    'carga' => round($trips->sum('cargo_weight'), 1)
                ];
            })->values();
    }
}