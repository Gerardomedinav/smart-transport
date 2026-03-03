<?php

namespace App\Events;

use App\Models\Alert;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AlertCreated implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public $alert;

    public function __construct(Alert $alert)
    {
        $this->alert = $alert;
    }

    public function broadcastOn()
    {
        return new Channel('fleet-monitoring');
    }

    public function broadcastAs()
    {
        return 'alert.created';
    }

    public function broadcastWith()
    {
        return [
            'alert' => $this->alert->load(['vehicle', 'trip'])->toArray()
        ];
    }
}