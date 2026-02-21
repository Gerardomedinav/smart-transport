<?php

namespace App\Events;

use App\Models\Location;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast; // <--- VITAL
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LocationUpdated implements ShouldBroadcastNow // <--- Agregá "Now" al final
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $location;

public function __construct(Location $location)
{
    // Esto es lo que saca el mapa del estado "Sincronizando"
    $this->location = $location->load('trip.vehicle');
}
    public function broadcastOn(): array
    {
        // Canal público para que cualquier Dashboard de monitoreo lo escuche
        return [
            new Channel('fleet-monitoring'),
        ];
    }

 public function broadcastAs(): string { return 'location.updated'; }
}