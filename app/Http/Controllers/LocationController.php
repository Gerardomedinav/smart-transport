<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Events\LocationUpdated;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function update(Request $request)
    {
        $location = Location::create([
            'trip_id' => $request->trip_id,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        broadcast(new LocationUpdated($location))->toOthers();

        return response()->json([
            'status' => 'ok'
        ]);
    }
}