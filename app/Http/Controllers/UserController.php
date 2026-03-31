<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('vehicle')->latest()->get();
        $vehicles = Vehicle::orderBy('license_plate')->get();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'vehicles' => $vehicles
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:operario,conductor',
            'vehicle_id' => 'nullable|exists:vehicles,id',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            // 🛡️ Transformamos strings vacíos a NULL para que PostgreSQL (UUID) no falle
            'vehicle_id' => ($request->role === 'operario' || empty($request->vehicle_id)) ? null : $request->vehicle_id,
        ]);

        return back();
    }

    public function update(Request $request, User $usuario)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $usuario->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|in:operario,conductor',
            'vehicle_id' => 'nullable|exists:vehicles,id',
        ]);

        $usuario->name = $request->name;
        $usuario->email = $request->email;
        $usuario->role = $request->role;
        // 🛡️ Igual que arriba, evitamos strings vacíos
        $usuario->vehicle_id = ($request->role === 'operario' || empty($request->vehicle_id)) ? null : $request->vehicle_id;

        if ($request->filled('password')) {
            $usuario->password = Hash::make($request->password);
        }

        $usuario->save();

        return back();
    }

    public function destroy(User $usuario)
    {
        $currentUser = \Illuminate\Support\Facades\Auth::user();
        if ($currentUser && $currentUser->id === $usuario->id) {
            return back()->withErrors(['error' => 'No puedes eliminar tu propia cuenta.']);
        }

        $usuario->delete();
        return back();
    }
}