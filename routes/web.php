<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChatController; 
use App\Http\Middleware\IsOperario;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes - Smart Transport Formosa
|--------------------------------------------------------------------------
*/

// 🖥️ VISTA PÚBLICA (BIENVENIDA)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// 🟢 RUTAS GENERALES (Acceso para Operarios y Conductores)
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard principal con Mapa
    Route::get('/dashboard', function () { 
        return Inertia::render('Dashboard'); 
    })->name('dashboard');

    // 💬 SISTEMA DE COMUNICACIONES (Chat en tiempo real)
    Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');
    
    // API de Mensajes: Usamos {contactId} para sincronizar con el Controlador
   // Fíjate que el parámetro sea {contactId}
    Route::get('/api/messages/{contactId}', [ChatController::class, 'getMessages'])->name('api.messages.get');
    Route::post('/api/messages', [ChatController::class, 'store'])->name('api.messages.store');

});

// 🔴 RUTAS RESTRINGIDAS (Acceso EXCLUSIVO para Operarios)
Route::middleware(['auth', 'verified', IsOperario::class])->group(function () {
    
    // Módulo de Estadísticas y Analítica
    Route::get('/analytics', function () { 
        return Inertia::render('Analytics'); 
    })->name('analytics');
    
    // 👥 GESTIÓN DE PERSONAL: CRUD de Usuarios y Asignación de Camiones
    Route::resource('usuarios', UserController::class)->except(['show']);
});

// 👤 PERFIL DE USUARIO (Configuración de cuenta)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// 🔌 APIS INTERNAS (Endpoints de datos)
Route::middleware('auth')->prefix('api')->group(function () {
    
    // API de Alertas (Filtra automáticamente por vehículo si es conductor)
    Route::get('/alerts', [AlertController::class, 'index']);
    
    // API de Métricas (Solo para la vista de estadísticas del Operario)
    Route::middleware([IsOperario::class])->group(function () {
        Route::get('/analytics-metrics', [AnalyticsController::class, 'getMetrics'])->name('api.analytics.metrics');
    });
});

require __DIR__.'/auth.php';