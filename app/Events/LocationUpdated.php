<?php

namespace App\Events;

use App\Models\Location;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast; // <--- VITAL
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LocationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $location;

    public function __construct(Location $location)
    {
        // Pasamos el modelo de localización que acabamos de guardar
        $this->location = $location;
    }

    public function broadcastOn(): array
    {
        // Canal público para que cualquier Dashboard de monitoreo lo escuche
        return [
            new Channel('fleet-monitoring'),
        ];
    }

    public function broadcastAs(): string
    {
        // Nombre del evento que escucharemos en React
        return 'location.updated';
    }
}