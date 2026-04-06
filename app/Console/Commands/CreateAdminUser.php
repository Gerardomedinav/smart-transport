<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    // Este es el nombre que usarás en la terminal
    protected $signature = 'system:create-admin';

    protected $description = 'Crea un usuario administrador inicial para Smart Transport';

    public function handle()
    {
        $this->info('--- Creación de Administrador Pro ---');

        $email = $this->ask('Ingresa el correo electrónico');

        if (User::where('email', $email)->exists()) {
            $this->error('El correo ya está registrado.');
            return;
        }

        $name = $this->ask('Nombre completo');
        $password = $this->secret('Contraseña (no se verá)');

        User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'operario', // Rol de administrador en tu sistema
        ]);

        $this->info("✅ ¡Listo! El operario $name ya puede entrar al sistema.");
    }
}