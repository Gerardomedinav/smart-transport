import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from '@inertiajs/react';

// 🚀 GRIDSTACK
import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';

// Helpers y Componentes
import { getVehicleColor, formatAlertForUI } from './TrackingMap/Helpers';
import AlertSidebar from './TrackingMap/AlertSidebar';

const createCustomMarker = (vehicle, tripStatus, isStopped) => {
    const color = getVehicleColor(vehicle.license_plate);
    const svgCamion = `<svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M3 4C1.89543 4 1 4.89543 1 6V17H3.0625C3.38501 18.705 4.87321 20 6.66667 20C8.46012 20 9.94833 18.705 10.2708 17H13.7292C14.0517 18.705 15.5399 20 17.3333 20C19.1268 20 20.615 18.705 20.9375 17H23V12L19 4H3ZM3 6H16V12H3V6ZM17 6L20 12H17V6ZM6.66667 15C5.74619 15 5 15.7462 5 16.6667C5 17.5871 5.74619 18.3333 6.66667 18.3333C7.58714 18.3333 8.33333 17.5871 8.33333 16.6667C8.33333 15.7462 7.58714 15 6.66667 15ZM17.3333 15C16.4128 15 15.6667 15.7462 15.6667 16.6667C15.6667 17.5871 16.4128 18.3333 17.3333 18.3333C18.2538 18.3333 19 17.5871 19 16.6667C19 15.7462 18.2538 15 17.3333 15Z"/></svg>`;
    const svgAlert = `<svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z"/></svg>`;

    let activeIcon = svgCamion; 
    let pulseHtml = ''; 
    let bgClass = 'bg-white text-gray-800'; 

    if (tripStatus === 'SIN_COMBUSTIBLE' || tripStatus === 'LOW_FUEL') { 
        bgClass = 'bg-orange-100 text-orange-600'; 
    } else if (tripStatus === 'AVERIA' || tripStatus === 'SOS') { 
        activeIcon = svgAlert; 
        pulseHtml = `<div class="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-75"></div>`; 
        bgClass = 'bg-red-100 text-red-600'; 
    } else if (tripStatus === 'COMPLETADO' || isStopped) { 
        bgClass = 'bg-gray-200 text-gray-500 grayscale opacity-80'; 
    }

    return L.divIcon({ 
        className: 'bg-transparent border-none', 
        html: `<div class="relative flex flex-col items-center justify-center w-12 h-12 hover:scale-110 transition-transform cursor-pointer">
                ${pulseHtml}
                <div class="relative z-10 flex items-center justify-center w-10 h-10 rounded-full shadow-lg border-[3px] ${bgClass}" style="border-color: ${color};">
                    ${activeIcon}
                </div>
                <span class="absolute -bottom-4 px-2 py-[2px] rounded text-[10px] font-black text-white shadow-md whitespace-nowrap z-20" style="background-color: ${color};">
                    ${vehicle.license_plate}
                </span>
               </div>`, 
        iconSize: [48, 48], iconAnchor: [24, 48], popupAnchor: [0, -48] 
    });
};

function MapResizeController({ isMaximized, isFeedOpen }) {
    const map = useMap();
    useEffect(() => { const timer = setTimeout(() => { map.invalidateSize(); }, 350); return () => clearTimeout(timer); }, [isMaximized, isFeedOpen, map]);
    return null;
}

export default function TrackingMap({ darkMode = false, authUser, externalAlerts = [], setExternalAlerts }) {
    const [fleet, setFleet] = useState({});
    const [liveAlerts, setLiveAlerts] = useState([]); 
    const [isFeedOpen, setIsFeedOpen] = useState(true);
    const [isMaximized, setIsMaximized] = useState(false);
    const mapCenter = [-25.7324, -58.6086];

    // 🧱 REFERENCIAS PARA GRIDSTACK
    const gridRef = useRef(null);
    const gridInstance = useRef(null);

    // 🚀 INICIALIZACIÓN ÚNICA
    useEffect(() => {
        if (!gridInstance.current && gridRef.current) {
            gridInstance.current = GridStack.init({
                float: true,
                cellHeight: 'auto',
                margin: 5,
                column: 12,
                disableOneColumnMode: true,
                acceptWidgets: true,
                dragIn: '.grid-stack-item',
                staticGrid: false
            }, gridRef.current);
        }
        return () => {
            if (gridInstance.current) {
                gridInstance.current.destroy(false);
                gridInstance.current = null;
            }
        };
    }, []);

    // 🚀 ACTUALIZACIÓN DE WIDGETS (SOLUCIÓN AL ERROR DE FUNCIÓN)
    useEffect(() => {
        if (gridInstance.current && externalAlerts.length > 0) {
            // Buscamos los elementos del DOM que React acaba de renderizar
            const items = gridRef.current.querySelectorAll('.grid-stack-item');
            items.forEach(el => {
                // Solo los convertimos en widget si GridStack aún no los controla
                if (!el.gridstackNode) {
                    gridInstance.current.makeWidget(el);
                }
            });
        }
    }, [externalAlerts]);

    useEffect(() => {
        const gpsChannel = window.Echo.private('flota.seguimiento');
        gpsChannel.listen('.location.updated', (e) => {
            const loc = e.location;
            if (loc?.trip?.vehicle) {
                if (authUser?.role === 'conductor' && authUser?.vehicle_id !== loc.trip.vehicle.id) return;
                setFleet(prev => ({
                    ...prev,
                    [loc.trip.vehicle.id]: {
                        ...loc.trip.vehicle,
                        lat: parseFloat(loc.latitude),
                        lng: parseFloat(loc.longitude),
                        speed: loc.speed, fuel: parseFloat(loc.fuel_level),
                        is_stopped: loc.is_stopped, trip_status: loc.trip.status,
                        address: e.address
                    }
                }));
            }
        });

        const alertsChannel = window.Echo.private('notificaciones.emergencia');
        alertsChannel.listen('.alert.created', (e) => {
            const formatted = formatAlertForUI(e.alert);
            setLiveAlerts(prev => [formatted, ...prev].slice(0, 50));
        });

        return () => { window.Echo.leave('flota.seguimiento'); window.Echo.leave('notificaciones.emergencia'); };
    }, [authUser]);

    const wrapperClasses = isMaximized 
        ? `fixed inset-0 z-[9999] w-screen h-screen flex ${darkMode ? 'bg-slate-900' : 'bg-gray-100'}` 
        : `h-full w-full relative overflow-hidden flex ${darkMode ? 'bg-slate-900' : 'bg-gray-100'}`;

    return (
        <div className={wrapperClasses}>
            <div className="flex-1 relative h-full w-full flex flex-col">
                
                {/* 🚨 EMERGENCIA SOBRE EL MAPA CON GRIDSTACK */}
                <div className="absolute top-20 left-0 w-full z-[1000] pointer-events-none">
                    <div ref={gridRef} className="grid-stack">
                        {externalAlerts.map((alert, index) => {
                            const ui = formatAlertForUI(alert);
                            const autoMsg = encodeURIComponent(`Central recibió tu alerta de ${ui.typeLabel} en ${ui.address}. ¿En qué podemos asistirte?`);

                            return (
                                <div 
                                    key={ui.id} 
                                    className="grid-stack-item pointer-events-auto"
                                    gs-x={index * 4} gs-y="0" gs-w="4" gs-h="2"
                                >
                                    <div className="grid-stack-item-content">
                                        <div className="bg-slate-900/95 border-l-4 border-red-600 p-4 rounded-r-xl shadow-2xl backdrop-blur-md h-full cursor-move">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex gap-3">
                                                    <span className="text-2xl animate-pulse">🚨</span>
                                                    <div>
                                                        <h4 className="font-black text-red-500 text-[9px] tracking-widest uppercase mb-1">Emergencia en Tiempo Real</h4>
                                                        <p className="text-white font-black text-xs uppercase">{ui.typeLabel}</p>
                                                        <p className="text-blue-400 text-[10px] font-bold mt-1 leading-tight italic">📍 {ui.address || alert.address}</p>
                                                        
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-300 border-t border-white/10 mt-2 pt-2">
                                                            <p><span className="text-slate-500 font-bold">CHOFER:</span> {ui.driver_name}</p>
                                                            <p><span className="text-slate-500 font-bold">HORA:</span> {ui.time || alert.timestamp}</p>
                                                            <p><span className="text-slate-500 font-bold">PLACA:</span> {ui.plate}</p>
                                                            <p><span className="text-slate-500 font-bold">COORD:</span> {ui.lat.toFixed(4)}, {ui.lng.toFixed(4)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Link href={`/chat?contact_id=${alert.driver_id}&auto_msg=${autoMsg}`} className="bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-black px-4 py-2 rounded shadow-lg uppercase transition-all text-center">Chat</Link>
                                                    <button onClick={() => setExternalAlerts(prev => prev.filter(a => a.id !== alert.id))} className="text-slate-500 hover:text-white text-[8px] font-black uppercase text-center">Cerrar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="absolute top-4 right-4 z-[500] flex gap-3">
                    <button onClick={() => setIsMaximized(!isMaximized)} className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase shadow-xl border bg-slate-800 text-white`}>🖵 Expandir</button>
                    <button onClick={() => setIsFeedOpen(!isFeedOpen)} className={`text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase shadow-xl border bg-blue-600`}>Feed</button>
                </div>

                <MapContainer center={mapCenter} zoom={8} style={{ height: '100%', width: '100%' }} className="z-0">
                    <MapResizeController isMaximized={isMaximized} isFeedOpen={isFeedOpen} />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {Object.values(fleet).map((v) => (
                        <Marker key={v.id} position={[v.lat, v.lng]} icon={createCustomMarker(v, v.trip_status)}>
                            <Popup>
                                <div className="min-w-[200px] text-xs font-bold p-1">
                                    <p className="font-black border-b mb-1 uppercase text-blue-600">🚐 {v.model} [{v.license_plate}]</p>
                                    <p className="mb-1 italic">📍 {v.address || 'Ubicando...'}</p>
                                    <p>⚡ Velocidad: {v.speed} km/h | ⛽ {v.fuel.toFixed(1)}%</p>
                                    <p className="text-[9px] opacity-50 mt-1 uppercase">COORD: {v.lat.toFixed(4)}, {v.lng.toFixed(4)}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            <AlertSidebar isFeedOpen={isFeedOpen} liveAlerts={liveAlerts} darkMode={darkMode} vehiclesList={Object.values(fleet)} />
        </div>
    );
}