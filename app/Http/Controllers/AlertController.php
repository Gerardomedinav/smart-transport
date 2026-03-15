<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alert;

class AlertController extends Controller
{
    public function index(Request $request)
    {
        $query = Alert::with(['vehicle', 'trip'])->latest();

        // 1. Filtro por Categoría
        if ($request->filled('type') && $request->type !== 'ALL') {
            switch ($request->type) {
                case 'CRITICAL':
                    $query->whereIn('type', ['AVERIA', 'SIN_COMBUSTIBLE', 'PANICO', 'AUXILIO', 'GPS_APAGADO']);
                    break;
                case 'SPEED':
                    $query->where('type', 'EXCESO_VELOCIDAD');
                    break;
                case 'ROUTE':
                    $query->whereIn('type', ['SALIDA', 'LLEGADA_DESTINO']);
                    break;
            }
        }

        // 2. Filtro por Vehículo
        if ($request->filled('vehicle') && $request->vehicle !== 'ALL') {
            $query->whereHas('vehicle', function($q) use ($request) {
                $q->where('license_plate', $request->vehicle);
            });
        }

        return response()->json($query->paginate(15));
    }
}