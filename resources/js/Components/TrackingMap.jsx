import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// 📦 Importamos nuestros submódulos
import { getVehicleColor, calculateDistanceKm, calculateETA, formatAlertForUI } from './TrackingMap/Helpers';
import AlertSidebar from './TrackingMap/AlertSidebar';

// 🚚 CREADOR DE MARCADORES (Se mantiene aquí porque usa L.divIcon de Leaflet)
const createCustomMarker = (vehicle, tripStatus, isStopped) => {
    const color = getVehicleColor(vehicle.license_plate);
    const svgCamion = `<svg viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7"><path d="M3 4C1.89543 4 1 4.89543 1 6V17H3.0625C3.38501 18.705 4.87321 20 6.66667 20C8.46012 20 9.94833 18.705 10.2708 17H13.7292C14.0517 18.705 15.5399 20 17.3333 20C19.1268 20 20.615 18.705 20.9375 17H23V12L19 4H3ZM3 6H16V12H3V6ZM17 6L20 12H17V6ZM6.66667 15C5.74619 15 5 15.7462 5 16.6667C5 17.5871 5.74619 18.3333 6.66667 18.3333C7.58714 18.3333 8.33333 17.5871 8.33333 16.6667C8.33333 15.7462 7.58714 15 6.66667 15ZM17.3333 15C16.4128 15 15.6667 15.7462 15.6667 16.6667C15.6667 17.5871 16.4128 18.3333 17.3333 18.3333C18.2538 18.3333 19 17.5871 19 16.6667C19 15.7462 18.2538 15 17.3333 15Z"/></svg>`;
    const svgHerramienta = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.31.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.675-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd" /></svg>`;
    const svgSurtidor = `<svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M19.5 8C18.12 8 17 9.12 17 10.5V14H16V6C16 4.9 15.1 4 14 4H6C4.9 4 4 4.9 4 6V20H16V16H17V10.5C17 9.67 17.67 9 18.5 9C19.33 9 20 9.67 20 10.5V20H22V10.5C22 9.12 20.88 8 19.5 8ZM14 14H6V6H14V14Z"/></svg>`;

    let activeIcon = svgCamion; let pulseHtml = ''; let bgClass = 'bg-white text-gray-800'; 
    if (tripStatus === 'SIN_COMBUSTIBLE') { activeIcon = svgSurtidor; pulseHtml = `<div class="absolute inset-0 rounded-full border-4 border-orange-500 animate-ping opacity-75"></div>`; bgClass = 'bg-orange-100 text-orange-600'; } 
    else if (tripStatus === 'AVERIA') { activeIcon = svgHerramienta; pulseHtml = `<div class="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-75"></div>`; bgClass = 'bg-red-100 text-red-600'; } 
    else if (tripStatus === 'COMPLETADO' || isStopped) { bgClass = 'bg-gray-200 text-gray-500 grayscale opacity-80'; }

    return L.divIcon({ className: 'bg-transparent border-none', html: `<div class="relative flex flex-col items-center justify-center w-12 h-12 hover:scale-110 transition-transform cursor-pointer">${pulseHtml}<div class="relative z-10 flex items-center justify-center w-10 h-10 rounded-full shadow-lg border-[3px] ${bgClass}" style="border-color: ${color};">${activeIcon}</div><span class="absolute -bottom-4 px-2 py-[2px] rounded text-[10px] font-black text-white shadow-md whitespace-nowrap z-20" style="background-color: ${color};">${vehicle.license_plate}</span></div>`, iconSize: [48, 48], iconAnchor: [24, 48], popupAnchor: [0, -48] });
};

function MapResizeController({ isMaximized, isFeedOpen }) {
    const map = useMap();
    useEffect(() => { const timer = setTimeout(() => { map.invalidateSize(); }, 350); return () => clearTimeout(timer); }, [isMaximized, isFeedOpen, map]);
    return null;
}

export default function TrackingMap() {
    const [fleet, setFleet] = useState({});
    const [isFeedOpen, setIsFeedOpen] = useState(true);
    const [isMaximized, setIsMaximized] = useState(false);
    
    // 🎛️ ESTADOS PARA LA INTERACTIVIDAD
    const [liveAlerts, setLiveAlerts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false); 
    const [filterType, setFilterType] = useState('ALL');
    const [filterVehicle, setFilterVehicle] = useState('ALL');
    const [isLoading, setIsLoading] = useState(false);

    const filterTypeRef = useRef(filterType);
    const filterVehicleRef = useRef(filterVehicle);
    const abortControllerRef = useRef(null);

    const mapCenter = [-25.7324, -58.6086];

    useEffect(() => {
        filterTypeRef.current = filterType;
        filterVehicleRef.current = filterVehicle;
    }, [filterType, filterVehicle]);

    const fetchAlerts = useCallback((pageNumber = 1, isReset = false) => {
        setIsLoading(true);
        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();

        axios.get('/api/alerts', {
            params: { page: pageNumber, type: filterType, vehicle: filterVehicle },
            signal: abortControllerRef.current.signal 
        }).then(response => {
            const dataArray = Array.isArray(response.data.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
            
            // 🧠 Usamos la función importada de Helpers.js
            const fetchedAlerts = dataArray.map(alert => formatAlertForUI(alert)).filter(Boolean);
            
            if (isReset) setLiveAlerts(fetchedAlerts); 
            else setLiveAlerts(prev => [...prev, ...fetchedAlerts]); 
            
            if (response.data.current_page !== undefined && response.data.last_page !== undefined) {
                setHasMore(response.data.current_page < response.data.last_page);
                setPage(response.data.current_page);
            } else setHasMore(false);
            
            setIsLoading(false);
        }).catch(err => { 
            if (!axios.isCancel(err)) { console.error("Error API:", err); setIsLoading(false); }
        });
    }, [filterType, filterVehicle]); 

    useEffect(() => { fetchAlerts(1, true); }, [fetchAlerts]);

    // Extraemos la lista de vehículos para el desplegable del Sidebar
    const vehiclesList = Object.values(fleet).map(v => ({ license_plate: v.license_plate, model: v.model }));

    useEffect(() => {
        const channel = window.Echo.channel('fleet-monitoring');
        
        channel.listen('.location.updated', (e) => {
            const loc = e.location; 
            if (loc && loc.trip && loc.trip.vehicle) {
                setFleet(prev => ({
                    ...prev,
                    [loc.trip.vehicle.id]: {
                        ...loc.trip.vehicle, lat: parseFloat(loc.latitude), lng: parseFloat(loc.longitude),
                        speed: loc.speed, fuel: parseFloat(loc.fuel_level), is_stopped: loc.is_stopped,
                        trip_status: loc.trip.status, origin: loc.trip.origin || 'Desconocido', destination: loc.trip.destination || 'Sin destino',
                        destLat: parseFloat(loc.trip.destination_lat), destLng: parseFloat(loc.trip.destination_lng),
                        is_loaded: loc.trip.is_loaded, cargo_weight: parseFloat(loc.trip.cargo_weight)
                    }
                }));
            }
        });

        channel.listen('.alert.created', (e) => {
            const alertData = e.alert || e; 
            const currentType = filterTypeRef.current;
            const currentVeh = filterVehicleRef.current;

            let passesVehicle = currentVeh === 'ALL' || (alertData.vehicle && alertData.vehicle.license_plate === currentVeh);
            let passesType = true;
            if (currentType === 'CRITICAL') passesType = ['AVERIA', 'SIN_COMBUSTIBLE', 'PANICO', 'AUXILIO', 'GPS_APAGADO'].includes(alertData.type);
            else if (currentType === 'SPEED') passesType = alertData.type === 'EXCESO_VELOCIDAD';
            else if (currentType === 'ROUTE') passesType = ['SALIDA', 'LLEGADA_DESTINO'].includes(alertData.type);

            if (passesVehicle && passesType) {
                // 🧠 Usamos la función importada de Helpers.js
                const alertUI = formatAlertForUI(alertData);
                if (alertUI) setLiveAlerts(prev => [alertUI, ...prev]);
            }
        });
        return () => window.Echo.leave('fleet-monitoring');
    }, []);

    const wrapperClasses = isMaximized ? "fixed inset-0 z-[9999] w-screen h-screen bg-slate-200 flex" : "h-full w-full bg-slate-200 relative overflow-hidden flex";

    return (
        <div className={wrapperClasses}>
            
            {/* 🗺️ ZONA DEL MAPA */}
            <div className="flex-1 relative h-full w-full flex flex-col">
                <div className="absolute top-4 right-4 z-[500] flex gap-3">
                    <button onClick={() => setIsMaximized(!isMaximized)} className="bg-slate-800 text-white px-4 py-2.5 rounded-lg font-black tracking-widest text-[10px] uppercase shadow-xl hover:bg-slate-700 transition-all active:scale-95 border border-slate-600 flex items-center gap-2">
                        {isMaximized ? '🗗 Minimizar Mapa' : '🖵 Pantalla Completa'}
                    </button>
                    <button onClick={() => setIsFeedOpen(!isFeedOpen)} className={`text-white px-4 py-2.5 rounded-lg font-black tracking-widest text-[10px] uppercase shadow-xl transition-all active:scale-95 border flex items-center gap-2 ${isFeedOpen ? 'bg-blue-600 border-blue-500 hover:bg-blue-500' : 'bg-green-600 border-green-500 hover:bg-green-500'}`}>
                        {isFeedOpen ? '▶ Ocultar Alertas' : '◀ Ver Alertas'}
                    </button>
                </div>

                {Object.keys(fleet).length === 0 && (
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[400] bg-black/80 text-white px-6 py-2 rounded-full font-bold text-sm shadow-xl animate-pulse">
                        📡 Esperando señal de GPS...
                    </div>
                )}

                <MapContainer center={mapCenter} zoom={8} style={{ height: '100%', width: '100%' }} className="z-0 flex-1 border-r border-slate-300">
                    <MapResizeController isMaximized={isMaximized} isFeedOpen={isFeedOpen} />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {Object.values(fleet).map((v) => {
                        const distance = calculateDistanceKm(v.lat, v.lng, v.destLat, v.destLng);
                        const vehicleColor = getVehicleColor(v.license_plate);
                        let statusBadgeText = '✅ EN RUTA'; let statusBadgeStyle = 'bg-green-100 text-green-800 border border-green-300';
                        if (v.trip_status === 'SIN_COMBUSTIBLE') { statusBadgeText = '⛽ DETENIDO SIN COMBUSTIBLE'; statusBadgeStyle = 'bg-orange-100 text-orange-800 border border-orange-400 animate-pulse'; } 
                        else if (v.trip_status === 'AVERIA') { statusBadgeText = '🚨 DETENIDO POR AVERÍA'; statusBadgeStyle = 'bg-red-100 text-red-800 border border-red-400 animate-pulse'; } 
                        else if (v.trip_status === 'COMPLETADO') { statusBadgeText = '🏁 LLEGÓ A DESTINO'; statusBadgeStyle = 'bg-blue-100 text-blue-800 border border-blue-300'; } 
                        else if (v.is_stopped) { statusBadgeText = '🛑 DETENIDO'; statusBadgeStyle = 'bg-gray-200 text-gray-800 border border-gray-400'; }

                        return (
                            <Marker key={v.id} position={[v.lat, v.lng]} icon={createCustomMarker(v, v.trip_status, v.is_stopped)}>
                                <Popup>
                                    <div className="text-left font-sans min-w-[240px]">
                                        <h3 className="font-black uppercase tracking-tighter text-white text-sm p-2 rounded-t-md text-center" style={{ backgroundColor: vehicleColor }}>{v.model} - {v.license_plate}</h3>
                                        <div className="space-y-1.5 mt-3 px-2">
                                            <p className="text-xs font-bold text-gray-700 flex justify-between"><span>🚀 Salida:</span> <span style={{ color: vehicleColor }}>{v.origin}</span></p>
                                            <p className="text-xs font-bold text-gray-700 flex justify-between"><span>🏁 Destino:</span> <span style={{ color: vehicleColor }}>{v.destination}</span></p>
                                            <p className="text-xs font-bold text-gray-700 flex justify-between"><span>⏳ ETA:</span> <span className="text-green-600 font-black">{calculateETA(distance, v.speed)}</span></p>
                                            <p className="text-xs font-bold text-gray-700 flex justify-between"><span>⚡ Vel:</span> <span className={v.speed > 80 ? 'text-red-600 font-black' : 'text-gray-900'}>{v.speed} km/h</span></p>
                                            <p className="text-xs font-bold text-gray-700 flex justify-between"><span>⛽ Nafta:</span> <span className={v.fuel <= 15 ? 'text-red-600 font-black' : 'text-gray-900'}>{v.fuel.toFixed(1)}%</span></p>
                                        </div>
                                        <p className={`text-[10px] mt-4 mx-2 p-2 rounded font-black uppercase text-center tracking-wide shadow-sm ${statusBadgeStyle}`}>{statusBadgeText}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>

            {/* 📋 SIDEBAR LATERAL SEPARADO */}
            <AlertSidebar 
                isFeedOpen={isFeedOpen}
                vehiclesList={vehiclesList} 
                filterVehicle={filterVehicle}
                setFilterVehicle={setFilterVehicle}
                filterType={filterType}
                setFilterType={setFilterType}
                liveAlerts={liveAlerts}
                isLoading={isLoading}
                page={page}
                fetchAlerts={fetchAlerts}
                hasMore={hasMore}
            />
            
        </div>
    );
}