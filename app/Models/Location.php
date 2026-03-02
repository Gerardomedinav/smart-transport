<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuid;

class Location extends Model
{
    use HasUuid;

    public $incrementing = false;
    protected $keyType = 'string';

    // ¡Agregamos velocidad, nafta y parada aquí!
    protected $fillable = [
        'trip_id', 'latitude', 'longitude', 
        'speed', 'fuel_level', 'is_stopped'
    ];

    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }
}