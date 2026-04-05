<?php

namespace App\Events;

use App\Models\Location;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LocationUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $location;
    public $address;

    public function __construct(Location $location, $address = null)
    {
        // 🚀 Carga vehículo y dispara la búsqueda automática del chofer
        $this->location = $location->load(['trip.vehicle', 'trip.driver']);
        $this->address = $address;
    }

    public function broadcastOn(): array { return [new PrivateChannel('flota.seguimiento')]; }
    public function broadcastAs(): string { return 'location.updated'; }
}