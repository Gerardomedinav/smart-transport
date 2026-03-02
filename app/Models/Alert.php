<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuid;

class Alert extends Model
{
    use HasUuid;

    // Desactivamos el autoincremento tradicional porque usamos UUIDs
    public $incrementing = false;
    protected $keyType = 'string';

    // Asignación masiva segura: solo permitimos guardar estos campos
    protected $fillable = [
        'vehicle_id',
        'trip_id',
        'type',
        'message',
        'latitude',
        'longitude',
        'is_acknowledged',
    ];

    // Forzamos a Laravel a convertir los tipos de datos automáticamente (Casting)
    protected $casts = [
        'is_acknowledged' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    /**
     * Relación: Esta alerta pertenece a un vehículo específico.
     */
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Relación: Esta alerta ocurrió durante un viaje específico.
     */
    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }
}