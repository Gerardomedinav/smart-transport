<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels - Smart Transport Formosa
|--------------------------------------------------------------------------
*/

// 1. Canal Estándar de Laravel (Notificaciones del Modelo User)
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// 2. Canal de Chat Privado (Mensajería entre Operario y Conductor)
Broadcast::channel('chat.{id}', function ($user, $id) {
    // Solo el usuario dueño del ID puede escuchar sus propios mensajes entrantes
    return (int) $user->id === (int) $id;
});

// 3. Canal de Telemetría GPS (Multitarea: Coordenadas de la Flota)
Broadcast::channel('flota.seguimiento', function ($user) {
    // Solo usuarios con rol autorizado pueden ver el movimiento en el mapa
    return in_array($user->role, ['operario', 'admin', 'conductor']);
});

// 4. Canal de Alertas Globales (Emergencias SOS y Accidentes)
Broadcast::channel('notificaciones.emergencia', function ($user) {
    // Todos los usuarios autenticados escuchan las alertas críticas
    return $user !== null;
});