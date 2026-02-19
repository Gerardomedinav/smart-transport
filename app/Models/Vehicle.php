<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\HasUuid; 

class Vehicle extends Model
{
    use HasUuid, SoftDeletes;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'license_plate',
        'model'
    ];

    public function trips()
    {
        // Usamos la ruta completa para evitar cualquier error de "Class not found"
        return $this->hasMany(\App\Models\Trip::class);
    }
}