<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuid;

class Location extends Model
{
    use HasUuid;

    public $incrementing = false;
    protected $keyType = 'string';

    // Importante: trip_id debe estar en fillable para permitir la creación masiva
    protected $fillable = ['trip_id', 'latitude', 'longitude'];

    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }
}