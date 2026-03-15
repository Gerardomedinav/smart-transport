<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsOperario
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Si el usuario está autenticado pero su rol NO es operario, lo bloqueamos con un error 403
        if (Auth::check() && Auth::user()->role !== 'operario') {
            abort(403, 'Acceso denegado. Esta sección es exclusiva para Operadores de Flota.');
        }

        return $next($request);
    }
}