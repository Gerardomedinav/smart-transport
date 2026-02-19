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

    protected $fillable = ['vehicle_id', 'start_time', 'end_time', 'status'];

    /**
     * Relación Enterprise: Un viaje tiene muchas localizaciones GPS.
     */
    public function locations()
    {
        return $this->hasMany(Location::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}