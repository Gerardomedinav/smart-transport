import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix de Iconos estándar
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048313.png', 
    iconSize: [45, 45],
    iconAnchor: [22, 45],
    popupAnchor: [0, -45],
});

function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, map.getZoom());
    }, [center]);
    return null;
}

export default function TrackingMap() {
    const [position, setPosition] = useState([-26.1849, -58.1731]); // Formosa
    const [vehicle, setVehicle] = useState(null);

    useEffect(() => {
        const channel = window.Echo.channel('fleet-monitoring');
        channel.listen('.location.updated', (e) => {
            const loc = e.location;
            if (loc) {
                const newLat = parseFloat(loc.latitude);
                const newLng = parseFloat(loc.longitude);
                if (!isNaN(newLat)) {
                    setPosition([newLat, newLng]);
                    if (loc.trip && loc.trip.vehicle) {
                        setVehicle(loc.trip.vehicle);
                    }
                }
            }
        });
        return () => window.Echo.leave('fleet-monitoring');
    }, []);

    return (
        <div className="h-full w-full bg-white"> 
            <MapContainer 
                center={position} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer 
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                />
                
                <Marker position={position} icon={vehicle ? truckIcon : DefaultIcon}>
                    <Popup>
                        <div className="text-center font-sans">
                            <h3 className="font-black text-blue-700 uppercase tracking-tighter">
                                {vehicle ? `Volvo ${vehicle.model}` : 'Unidad en Formosa'}
                            </h3>
                            <p className="text-[10px] font-bold text-gray-600 uppercase">
                                {vehicle ? `Patente: ${vehicle.license_plate}` : 'Rastreo Satelital Activo'}
                            </p>
                        </div>
                    </Popup>
                </Marker>

                <ChangeView center={position} />
            </MapContainer>
        </div>
    );
}