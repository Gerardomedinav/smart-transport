<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request; // 👈 IMPORTANTE: Agregamos Request para leer los filtros
use Inertia\Inertia;
use App\Models\Alert;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// 🚨 API de Auditoría Interactiva (Paginación + Filtros)
Route::get('/api/alerts', function (Request $request) {
    $query = Alert::with(['vehicle', 'trip'])->latest();

    // 1. Filtro por Categoría de Alerta
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

    // 2. Filtro por Vehículo Específico (Patente)
    if ($request->filled('vehicle') && $request->vehicle !== 'ALL') {
        $query->whereHas('vehicle', function($q) use ($request) {
            $q->where('license_plate', $request->vehicle);
        });
    }

    // 3. Devolvemos resultados paginados (15 por página)
    return response()->json($query->paginate(15));
})->middleware(['auth']);

require __DIR__.'/auth.php';