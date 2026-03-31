<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\HasUuid;

class Trip extends Model
{
    use HasUuid, SoftDeletes;

    public $incrementing = false;
    protected $keyType = 'string';

    // ¡Agregamos los destinos y el usuario aquí!
    protected $fillable = [
        'vehicle_id', 
        'user_id',    // 🚨 AGREGADO: Relación con el chofer
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

    public function locations()
    {
        return $this->hasMany(Location::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    // 🚨 ESTA ES LA FUNCIÓN QUE SOLUCIONA EL ERROR "RelationNotFoundException"
    public function driver()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}