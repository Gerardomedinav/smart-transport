<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alert;
use Illuminate\Support\Facades\Auth;

class AlertController extends Controller
{
    public function index(Request $request)
    {
        $query = Alert::with(['vehicle', 'trip'])->latest();
        $user = Auth::user(); // 👈 Obtenemos el usuario actual

        // 🛡️ SEGURIDAD RBAC: Si es conductor, SOLO ve sus propias alertas
        if ($user->role === 'conductor') {
            $query->where('vehicle_id', $user->vehicle_id);
        } else {
            // Si es operario, aplicamos el filtro manual del Sidebar (si existe)
            if ($request->filled('vehicle') && $request->vehicle !== 'ALL') {
                $query->whereHas('vehicle', function($q) use ($request) {
                    $q->where('license_plate', $request->vehicle);
                });
            }
        }

        // Filtro por Categoría de Alerta (Lo usan ambos roles)
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

        return response()->json($query->paginate(15));
    }
}