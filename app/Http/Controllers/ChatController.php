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
    public function index()
    {
        $user = Auth::user();
        $contacts = User::where('role', $user->role === 'operario' ? 'conductor' : 'operario')->get();

        return Inertia::render('Chat/Index', [
            'contacts' => $contacts
        ]);
    }

    /**
     * Obtiene el historial paginado.
     */
    public function getMessages($contactId) 
    {
        $userId = Auth::id();
        
        // 🚀 PAGINACIÓN: Traemos de a 20, del más nuevo al más viejo
        return Message::where(function($q) use ($userId, $contactId) {
            $q->where('sender_id', $userId)->where('receiver_id', $contactId);
        })
        ->orWhere(function($q) use ($userId, $contactId) {
            $q->where('sender_id', $contactId)->where('receiver_id', $userId);
        })
        ->with('sender')
        ->latest() // Importante para que la página 1 sean los últimos mensajes
        ->paginate(20);
    }

    public function store(Request $request)
    {
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

        $msg->load('sender');
        broadcast(new MessageSent($msg))->toOthers();

        return response()->json($msg);
    }
}