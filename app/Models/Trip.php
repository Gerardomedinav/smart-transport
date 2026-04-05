<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\HasUuid;
use App\Models\User;

class Trip extends Model
{
    use HasUuid, SoftDeletes;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'vehicle_id', 
        'user_id',
        'start_time', 
        'end_time', 
        'status', 
        'is_loaded', 
        'cargo_weight', 
        'origin', 
        'destination', 
        'destination_lat', 
        'destination_lng'
    ];

    public function locations() { return $this->hasMany(Location::class); }
    public function vehicle() { return $this->belongsTo(Vehicle::class); }

    /**
     * 👤 RELACIÓN INTELIGENTE:
     * Intenta traer el chofer del viaje, si no hay, trae al asignado al vehículo.
     */
    public function driver()
    {
        return $this->belongsTo(User::class, 'user_id')
            ->withDefault(function ($user, $trip) {
                // Si el viaje no tiene user_id, buscamos quién tiene este camión asignado
                return User::where('vehicle_id', $trip->vehicle_id)->first() 
                    ?? new User(['name' => 'Chofer no asignado']);
            });
    }
}