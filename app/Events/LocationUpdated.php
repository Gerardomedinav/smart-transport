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
    public $address; // 👈 AGREGADO PARA EL MAPA

    public function __construct(Location $location, $address = null)
    {
        $this->location = $location->load('trip.vehicle');
        $this->address = $address; // 👈 ASIGNADO
    }

    public function broadcastOn(): array
    {
        return [new PrivateChannel('flota.seguimiento')];
    }

    public function broadcastAs(): string { return 'location.updated'; }
}