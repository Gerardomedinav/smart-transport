import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Estilos e Iconos
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

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
    const [position, setPosition] = useState([-26.1849, -58.1731]);
    const [vehicle, setVehicle] = useState(null);

useEffect(() => {
    console.log('--- Sintonizando Smart Transport ---');
    
    // Escuchamos el canal 'fleet-monitoring'
    const channel = window.Echo.channel('fleet-monitoring');

    // IMPORTANTE: Escuchamos el alias exacto 'location.updated'
    channel.listen('.location.updated', (e) => {
        console.log('¡SEÑAL RECIBIDA!', e); // Si ves esto en consola, el camión aparecerá
        
        const loc = e.location;
        if (loc) {
            const newLat = parseFloat(loc.latitude);
            const newLng = parseFloat(loc.longitude);

            if (!isNaN(newLat)) {
                setPosition([newLat, newLng]);
                
                // Verificamos si los datos del Volvo vienen en el paquete
                if (loc.trip && loc.trip.vehicle) {
                    setVehicle(loc.trip.vehicle);
                }
            }
        }
    });

    return () => window.Echo.leave('fleet-monitoring');
}, []);
    return (
        <div className="h-[600px] w-full border-4 border-white rounded-xl shadow-xl overflow-hidden">
            <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                
                <Marker position={position} icon={vehicle ? truckIcon : DefaultIcon}>
                    <Popup>
                        <div className="text-center">
                            <h3 className="font-bold text-blue-700">
                                {vehicle ? `Volvo ${vehicle.model}` : 'Transporte en vivo'}
                            </h3>
                            <p className="text-sm">
                                {vehicle ? `Patente: ${vehicle.license_plate}` : 'Sincronizando datos...'}
                            </p>
                        </div>
                    </Popup>
                </Marker>

                <ChangeView center={position} />
            </MapContainer>
        </div>
    );
}