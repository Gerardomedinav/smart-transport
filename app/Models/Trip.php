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

    // ¡Agregamos los destinos aquí!
    protected $fillable = [
        'vehicle_id', 'start_time', 'end_time', 'status', 
        'origin', 'destination', 'destination_lat', 'destination_lng'
    ];

    public function locations()
    {
        return $this->hasMany(Location::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}