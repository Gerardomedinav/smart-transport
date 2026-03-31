<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow; // 👈 CAMBIO: Usamos la interfaz de transmisión inmediata
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow // 👈 CAMBIO: Implementamos ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    /**
     * Define el canal privado del receptor.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat.'.$this->message->receiver_id),
        ];
    }
    
    /**
     * Alias del evento para el frontend.
     */
    public function broadcastAs()
    {
        return 'message.sent';
    }
}