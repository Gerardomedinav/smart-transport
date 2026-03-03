import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 🎨 PALETA DE COLORES
const BRAND_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

const getVehicleColor = (licensePlate) => {
    let hash = 0;
    for (let i = 0; i < licensePlate.length; i++) {
        hash = licensePlate.charCodeAt(i) + ((hash << 5) - hash);
    }
    return BRAND_COLORS[Math.abs(hash) % BRAND_COLORS.length];
};

// 🚚 CREADOR DE MARCADORES CON SVGs PUROS
const createCustomMarker = (vehicle, tripStatus, isStopped) => {
    const color = getVehicleColor(vehicle.license_plate);
    
    const svgCamion = `<svg viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7"><path d="M3 4C1.89543 4 1 4.89543 1 6V17H3.0625C3.38501 18.705 4.87321 20 6.66667 20C8.46012 20 9.94833 18.705 10.2708 17H13.7292C14.0517 18.705 15.5399 20 17.3333 20C19.1268 20 20.615 18.705 20.9375 17H23V12L19 4H3ZM3 6H16V12H3V6ZM17 6L20 12H17V6ZM6.66667 15C5.74619 15 5 15.7462 5 16.6667C5 17.5871 5.74619 18.3333 6.66667 18.3333C7.58714 18.3333 8.33333 17.5871 8.33333 16.6667C8.33333 15.7462 7.58714 15 6.66667 15ZM17.3333 15C16.4128 15 15.6667 15.7462 15.6667 16.6667C15.6667 17.5871 16.4128 18.3333 17.3333 18.3333C18.2538 18.3333 19 17.5871 19 16.6667C19 15.7462 18.2538 15 17.3333 15Z"/></svg>`;
    const svgHerramienta = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.31.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.675-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd" /></svg>`;
    const svgSurtidor = `<svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M19.5 8C18.12 8 17 9.12 17 10.5V14H16V6C16 4.9 15.1 4 14 4H6C4.9 4 4 4.9 4 6V20H16V16H17V10.5C17 9.67 17.67 9 18.5 9C19.33 9 20 9.67 20 10.5V20H22V10.5C22 9.12 20.88 8 19.5 8ZM14 14H6V6H14V14Z"/></svg>`;

    let activeIcon = svgCamion;
    let pulseHtml = '';
    let bgClass = 'bg-white text-gray-800'; 

    if (tripStatus === 'SIN_COMBUSTIBLE') {
        activeIcon = svgSurtidor;
        pulseHtml = `<div class="absolute inset-0 rounded-full border-4 border-orange-500 animate-ping opacity-75"></div>`;
        bgClass = 'bg-orange-100 text-orange-600';
    } else if (tripStatus === 'AVERIA') {
        activeIcon = svgHerramienta;
        pulseHtml = `<div class="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-75"></div>`;
        bgClass = 'bg-red-100 text-red-600';
    } else if (tripStatus === 'COMPLETADO' || isStopped) {
        bgClass = 'bg-gray-200 text-gray-500 grayscale opacity-80';
    }

    return L.divIcon({
        className: 'bg-transparent border-none',
        html: `
            <div class="relative flex flex-col items-center justify-center w-12 h-12 hover:scale-110 transition-transform cursor-pointer">
                ${pulseHtml}
                <div class="relative z-10 flex items-center justify-center w-10 h-10 rounded-full shadow-lg border-[3px] ${bgClass}" style="border-color: ${color};">
                    ${activeIcon}
                </div>
                <span class="absolute -bottom-4 px-2 py-[2px] rounded text-[10px] font-black text-white shadow-md whitespace-nowrap z-20" style="background-color: ${color};">
                    ${vehicle.license_plate}
                </span>
            </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48]
    });
};

const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    if (!lat2 || !lon2) return 0;
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const calculateETA = (distanceKm, speed) => {
    if (distanceKm < 1) return "Llegó al destino";
    if (speed <= 0) return "N/D (Detenido)"; 
    const totalHours = distanceKm / speed; 
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    if (hours === 0) return `${minutes} min`;
    return `${hours}h ${minutes}m`;
};

function MapResizeController({ isMaximized, isFeedOpen }) {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => { map.invalidateSize(); }, 350);
        return () => clearTimeout(timer);
    }, [isMaximized, isFeedOpen, map]);
    return null;
}

export default function TrackingMap() {
    const [fleet, setFleet] = useState({});
    const [isFeedOpen, setIsFeedOpen] = useState(true);
    const [isMaximized, setIsMaximized] = useState(false);
    const [liveAlerts, setLiveAlerts] = useState([]);

    const mapCenter = [-25.7324, -58.6086];

    useEffect(() => {
        const channel = window.Echo.channel('fleet-monitoring');
        
        channel.listen('.location.updated', (e) => {
            const loc = e.location; 
            if (loc && loc.trip && loc.trip.vehicle) {
                const vid = loc.trip.vehicle.id;
                
                setFleet(prev => ({
                    ...prev,
                    [vid]: {
                        ...loc.trip.vehicle,
                        lat: parseFloat(loc.latitude),
                        lng: parseFloat(loc.longitude),
                        speed: loc.speed,
                        fuel: parseFloat(loc.fuel_level),
                        is_stopped: loc.is_stopped,
                        trip_status: loc.trip.status,
                        origin: loc.trip.origin || 'Desconocido',
                        destination: loc.trip.destination || 'Sin destino',
                        destLat: parseFloat(loc.trip.destination_lat),
                        destLng: parseFloat(loc.trip.destination_lng),
                        is_loaded: loc.trip.is_loaded,
                        cargo_weight: parseFloat(loc.trip.cargo_weight)
                    }
                }));
            }
        });

        channel.listen('.alert.created', (e) => {
            const newAlert = e.alert;

            // ESTILOS POR DEFECTO
            let bgColor = 'bg-blue-50';
            let badgeStyle = 'bg-white border-blue-200 text-blue-600';
            let cardStyle = 'border-blue-200';
            
            // 🚨 ICONO DE PELIGRO EN SVG (Para las críticas)
            const dangerIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5 inline-block mr-1 -mt-0.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;

            let finalTypeHtml = newAlert.type.replace('_', ' ');

            // 🎨 LÓGICA DE COLORES INTENSOS PARA CRÍTICAS
            if (newAlert.type === 'AVERIA') { 
                bgColor = 'bg-red-50'; 
                cardStyle = 'border-red-500 shadow-md shadow-red-500/20'; 
                badgeStyle = 'bg-red-600 text-white border-red-700 animate-pulse'; // Rojo Intenso y pulsa
                finalTypeHtml = dangerIcon + 'AVERÍA CRÍTICA';
            } else if (newAlert.type === 'SIN_COMBUSTIBLE') { 
                bgColor = 'bg-orange-50'; 
                cardStyle = 'border-orange-500 shadow-md shadow-orange-500/20';
                badgeStyle = 'bg-orange-600 text-white border-orange-700 animate-pulse'; // Naranja Intenso
                finalTypeHtml = dangerIcon + 'SIN COMBUSTIBLE';
            } else if (newAlert.type === 'EXCESO_VELOCIDAD') { 
                bgColor = 'bg-amber-50'; 
                cardStyle = 'border-amber-300';
                badgeStyle = 'bg-amber-100 text-amber-700 border-amber-300'; 
            } else if (newAlert.type === 'LLEGADA_DESTINO') { 
                bgColor = 'bg-green-50'; 
                cardStyle = 'border-green-200';
                badgeStyle = 'bg-white text-green-600 border-green-200'; 
            } else if (newAlert.type === 'CARGA_MODIFICADA') {
                bgColor = 'bg-purple-50'; 
                cardStyle = 'border-purple-200';
                badgeStyle = 'bg-white text-purple-600 border-purple-200';
            }

            const timeString = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

            const vehiclePlate = newAlert.vehicle ? newAlert.vehicle.license_plate : 'Sin Patente';
            const vehicleModel = newAlert.vehicle ? newAlert.vehicle.model : 'Desconocido';
            const tripOrigin = newAlert.trip ? newAlert.trip.origin : 'N/D';
            const tripDestination = newAlert.trip ? newAlert.trip.destination : 'N/D';

            const alertUI = {
                id: newAlert.id,
                typeHtml: finalTypeHtml, // Ahora pasamos el HTML con el ícono
                message: newAlert.message,
                time: timeString,
                badgeStyle: badgeStyle,
                cardStyle: cardStyle,
                bg: bgColor,
                plate: vehiclePlate,
                model: vehicleModel,
                origin: tripOrigin,
                destination: tripDestination,
                lat: parseFloat(newAlert.latitude || 0),
                lng: parseFloat(newAlert.longitude || 0)
            };

            setLiveAlerts(prev => [alertUI, ...prev]);
        });
        
        return () => window.Echo.leave('fleet-monitoring');
    }, []);

    const wrapperClasses = isMaximized 
        ? "fixed inset-0 z-[9999] w-screen h-screen bg-slate-100 flex" 
        : "h-full w-full bg-slate-100 relative overflow-hidden flex";

    return (
        <div className={wrapperClasses}>
            
            {/* 🗺️ ZONA DEL MAPA */}
            <div className="flex-1 relative h-full w-full flex flex-col">
                
                {/* 🎛️ CONTROLES FLOTANTES */}
                <div className="absolute top-4 right-4 z-[500] flex gap-3">
                    <button 
                        onClick={() => setIsMaximized(!isMaximized)} 
                        className="bg-slate-900 text-white px-4 py-2.5 rounded-lg font-black tracking-widest text-[10px] uppercase shadow-xl hover:bg-slate-800 transition-all active:scale-95 border border-slate-700 flex items-center gap-2"
                    >
                        {isMaximized ? '🗗 Minimizar Mapa' : '🖵 Pantalla Completa'}
                    </button>

                    <button 
                        onClick={() => setIsFeedOpen(!isFeedOpen)} 
                        className={`text-white px-4 py-2.5 rounded-lg font-black tracking-widest text-[10px] uppercase shadow-xl transition-all active:scale-95 border flex items-center gap-2 
                        ${isFeedOpen ? 'bg-blue-600 border-blue-500 hover:bg-blue-500' : 'bg-green-600 border-green-500 hover:bg-green-500'}`}
                    >
                        {isFeedOpen ? '▶ Ocultar Alertas' : '◀ Ver Alertas'}
                    </button>
                </div>

                {Object.keys(fleet).length === 0 && (
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[400] bg-black/80 text-white px-6 py-2 rounded-full font-bold text-sm shadow-xl animate-pulse">
                        📡 Esperando señal de GPS...
                    </div>
                )}

                <MapContainer center={mapCenter} zoom={8} style={{ height: '100%', width: '100%' }} className="z-0 flex-1">
                    <MapResizeController isMaximized={isMaximized} isFeedOpen={isFeedOpen} />
                    
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    
                    {Object.values(fleet).map((v) => {
                        const distance = calculateDistanceKm(v.lat, v.lng, v.destLat, v.destLng);
                        const vehicleColor = getVehicleColor(v.license_plate);
                        
                        let statusBadgeText = '✅ EN RUTA';
                        let statusBadgeStyle = 'bg-green-100 text-green-800 border border-green-300';

                        if (v.trip_status === 'SIN_COMBUSTIBLE') {
                            statusBadgeText = '⛽ DETENIDO SIN COMBUSTIBLE';
                            statusBadgeStyle = 'bg-orange-100 text-orange-800 border border-orange-400 animate-pulse';
                        } else if (v.trip_status === 'AVERIA') {
                            statusBadgeText = '🚨 DETENIDO POR AVERÍA';
                            statusBadgeStyle = 'bg-red-100 text-red-800 border border-red-400 animate-pulse';
                        } else if (v.trip_status === 'COMPLETADO') {
                            statusBadgeText = '🏁 LLEGÓ A DESTINO';
                            statusBadgeStyle = 'bg-blue-100 text-blue-800 border border-blue-300';
                        } else if (v.is_stopped) {
                            statusBadgeText = '🛑 DETENIDO';
                            statusBadgeStyle = 'bg-gray-200 text-gray-800 border border-gray-400';
                        }

                        return (
                            <Marker key={v.id} position={[v.lat, v.lng]} icon={createCustomMarker(v, v.trip_status, v.is_stopped)}>
                                <Popup>
                                    <div className="text-left font-sans min-w-[240px]">
                                        <h3 className="font-black uppercase tracking-tighter text-white text-sm p-2 rounded-t-md text-center" style={{ backgroundColor: vehicleColor }}>
                                            {v.model} - {v.license_plate}
                                        </h3>
                                        
                                        <div className="space-y-1.5 mt-3 px-2">
                                            <p className="text-xs font-bold text-gray-700 flex justify-between">
                                                <span>🚀 Salida:</span> <span style={{ color: vehicleColor }}>{v.origin}</span>
                                            </p>
                                            <p className="text-xs font-bold text-gray-700 flex justify-between">
                                                <span>🏁 Destino:</span> <span style={{ color: vehicleColor }}>{v.destination}</span>
                                            </p>

                                            <p className="text-xs font-bold text-gray-700 flex justify-between bg-slate-100 p-1.5 rounded my-1 border border-slate-200">
                                                <span>{v.is_loaded ? '📦 Carga:' : '🪹 Carga:'}</span> 
                                                <span className={v.is_loaded ? 'text-amber-700 font-black' : 'text-gray-500 font-black'}>
                                                    {v.is_loaded ? `${v.cargo_weight.toFixed(1)} Ton` : 'Vacío'}
                                                </span>
                                            </p>

                                            <p className="text-xs font-bold text-gray-700 flex justify-between">
                                                <span>📏 Restante:</span> <span>{distance.toFixed(1)} km</span>
                                            </p>
                                            <p className="text-xs font-bold text-gray-700 flex justify-between">
                                                <span>⏳ ETA:</span> <span className="text-green-600 font-black">{calculateETA(distance, v.speed)}</span>
                                            </p>
                                            <p className="text-xs font-bold text-gray-700 flex justify-between">
                                                <span>⚡ Vel:</span> <span className={v.speed > 80 ? 'text-red-600 font-black' : 'text-gray-900'}>{v.speed} km/h</span>
                                            </p>
                                            <p className="text-xs font-bold text-gray-700 flex justify-between">
                                                <span>⛽ Nafta:</span> <span className={v.fuel <= 15 ? 'text-red-600 font-black' : 'text-gray-900'}>{v.fuel.toFixed(1)}%</span>
                                            </p>
                                        </div>

                                        <p className={`text-[10px] mt-4 mx-2 p-2 rounded font-black uppercase text-center tracking-wide shadow-sm ${statusBadgeStyle}`}>
                                            {statusBadgeText}
                                        </p>

                                        <div className="mt-2 pt-2 border-t border-gray-200 flex justify-center items-center gap-1.5 text-[10px] font-bold text-gray-500 bg-gray-50 p-1 rounded">
                                            <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {v.lat.toFixed(5)}, {v.lng.toFixed(5)}
                                        </div>

                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>

            {/* 📋 SIDEBAR LATERAL (FEED DE ALERTAS) */}
            <div className={`transition-all duration-300 ease-in-out flex flex-col bg-white border-l border-gray-200 z-[600] ${isFeedOpen ? 'w-80 shadow-[-5px_0_15px_-5px_rgba(0,0,0,0.1)]' : 'w-0 opacity-0 overflow-hidden'}`}>
                <div className="w-80 h-full flex flex-col">
                    <div className="bg-slate-800 p-4 shadow-md shrink-0">
                        <h2 className="text-white font-black flex items-center gap-2 tracking-wide text-sm">
                            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            FEED DE AUDITORÍA
                        </h2>
                        <p className="text-slate-400 text-xs mt-1">Eventos en tiempo real</p>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                        {liveAlerts.length === 0 ? (
                            <p className="text-center text-gray-400 text-xs font-bold mt-10">Escuchando señales GPS...</p>
                        ) : (
                            liveAlerts.map((alert, index) => (
                                <div key={`${alert.id}-${index}`} className={`p-3 rounded-lg border-2 ${alert.bg} ${alert.cardStyle} transition-all hover:shadow-lg animate-fade-in-up flex flex-col gap-2`}>
                                    
                                    {/* Cabecera: Tipo de Alerta (Ahora con soporte HTML para el icono) y Hora */}
                                    <div className="flex justify-between items-start">
                                        <span 
                                            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${alert.badgeStyle}`}
                                            dangerouslySetInnerHTML={{ __html: alert.typeHtml }}
                                        />
                                        <span className="text-[10px] font-bold text-gray-500 mt-1">{alert.time}</span>
                                    </div>
                                    
                                    {/* Mensaje descriptivo */}
                                    <p className="text-xs text-gray-900 font-black leading-relaxed tracking-tight">
                                        {alert.message}
                                    </p>

                                    {/* 📦 Info del Vehículo y Ruta */}
                                    <div className="bg-white/80 p-2 rounded border border-black/10 mt-1 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-800 flex items-center gap-1.5 mb-1.5">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-slate-500"><path d="M3 4C1.89543 4 1 4.89543 1 6V17H3.0625C3.38501 18.705 4.87321 20 6.66667 20C8.46012 20 9.94833 18.705 10.2708 17H13.7292C14.0517 18.705 15.5399 20 17.3333 20C19.1268 20 20.615 18.705 20.9375 17H23V12L19 4H3ZM3 6H16V12H3V6ZM17 6L20 12H17V6ZM6.66667 15C5.74619 15 5 15.7462 5 16.6667C5 17.5871 5.74619 18.3333 6.66667 18.3333C7.58714 18.3333 8.33333 17.5871 8.33333 16.6667C8.33333 15.7462 7.58714 15 6.66667 15ZM17.3333 15C16.4128 15 15.6667 15.7462 15.6667 16.6667C15.6667 17.5871 16.4128 18.3333 17.3333 18.3333C18.2538 18.3333 19 17.5871 19 16.6667C19 15.7462 18.2538 15 17.3333 15Z"/></svg>
                                            {alert.plate} <span className="font-bold text-slate-500">({alert.model})</span>
                                        </p>
                                        <div className="flex flex-col gap-0.5 text-[9px] text-gray-600">
                                            <p>🚀 Salida: <span className="font-bold text-gray-800">{alert.origin}</span></p>
                                            <p>🏁 Destino: <span className="font-bold text-gray-800">{alert.destination}</span></p>
                                        </div>
                                    </div>

                                    {/* 📍 Coordenadas Exactas */}
                                    <div className="pt-1.5 border-t border-black/10 flex items-center justify-center gap-1 text-[10px] font-bold text-slate-600">
                                        <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>LAT: {alert.lat.toFixed(5)}</span>
                                        <span className="mx-1">•</span>
                                        <span>LNG: {alert.lng.toFixed(5)}</span>
                                    </div>
                                    
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            
        </div>
    );
}