<?php

namespace App\Events;

use App\Models\Alert;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AlertCreated implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public $alert;

    public function __construct(Alert $alert)
    {
        // Cargamos vehículo, viaje y chofer para tener la info completa
        $this->alert = $alert;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('notificaciones.emergencia');
    }

    public function broadcastAs() { return 'alert.created'; }

    public function broadcastWith()
    {
        // Aseguramos que cargue las relaciones y devuelva el array con address y coordenadas
        return [
            'alert' => $this->alert->load(['vehicle', 'trip.driver'])->toArray()
        ];
    }
}