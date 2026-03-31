<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Events\MessageSent; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{
    /**
     * Muestra la vista principal del chat con la lista de contactos.
     */
    public function index()
    {
        $user = Auth::user();
        
        // El operario ve conductores, el conductor ve operarios
        $contacts = User::where('role', $user->role === 'operario' ? 'conductor' : 'operario')->get();

        return Inertia::render('Chat/Index', [
            'contacts' => $contacts
        ]);
    }

    /**
     * Obtiene el historial completo de la conversación entre dos usuarios.
     * Fusionado para traer tanto mensajes enviados como recibidos.
     */
    public function getMessages($contactId) 
    {
        $userId = Auth::id();
        $contactId = (int) $contactId; 
        
        return Message::where(function($q) use ($userId, $contactId) {
            // Caso A: Yo soy el remitente y el contacto el receptor
            $q->where('sender_id', $userId)
              ->where('receiver_id', $contactId);
        })
        ->orWhere(function($q) use ($userId, $contactId) {
            // Caso B: El contacto es el remitente y yo soy el receptor
            $q->where('sender_id', $contactId)
              ->where('receiver_id', $userId);
        })
        ->with('sender') // Carga los datos del que envió el mensaje para las burbujas
        ->orderBy('created_at', 'asc')
        ->get();
    }

    /**
     * Guarda un nuevo mensaje y lo transmite en tiempo real.
     */
    public function store(Request $request)
    {
        // Validación estricta para evitar errores SQL
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
            'is_critical' => 'boolean'
        ]);

        $msg = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'content' => $request->input('content'),
            'is_critical' => $request->is_critical ?? false,
        ]);

        // Cargamos el remitente para que el frontend sepa quién habla al recibir el evento
        $msg->load('sender');

        // 🚀 TIEMPO REAL: Disparar el evento para Reverb/Pusher
        broadcast(new MessageSent($msg))->toOthers();

        return response()->json($msg);
    }
}