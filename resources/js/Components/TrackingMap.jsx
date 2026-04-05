import React, { useEffect, useState, useRef, memo } from 'react';
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

const createCustomMarker = (vehicle, tripStatus) => {
    const color = getVehicleColor(vehicle.license_plate);
    const svgAlert = `<svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z"/></svg>`;
    const svgCamion = `<svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M3 4C1.89543 4 1 4.89543 1 6V17H3.0625C3.38501 18.705 4.87321 20 6.66667 20C8.46012 20 9.94833 18.705 10.2708 17H13.7292C14.0517 18.705 15.5399 20 17.3333 20C19.1268 20 20.615 18.705 20.9375 17H23V12L19 4H3ZM3 6H16V12H3V6ZM17 6L20 12H17V6ZM6.66667 15C5.74619 15 5 15.7462 5 16.6667C5 17.5871 5.74619 18.3333 6.66667 18.3333C7.58714 18.3333 8.33333 17.5871 8.33333 16.6667C8.33333 15.7462 7.58714 15 6.66667 15ZM17.3333 15C16.4128 15 15.6667 15.7462 15.6667 16.6667C15.6667 17.5871 16.4128 18.3333 17.3333 18.3333C18.2538 18.3333 19 17.5871 19 16.6667C19 15.7462 18.2538 15 17.3333 15Z"/></svg>`;

    let activeIcon = svgCamion; 
    let pulseHtml = ''; 
    let bgClass = 'bg-white text-gray-800'; 

    const status = tripStatus?.toUpperCase() || '';
    if (status === 'SIN_COMBUSTIBLE' || status === 'LOW_FUEL' || status === 'AVERIA' || status === 'SOS') { 
        bgClass = status.includes('FUEL') ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600';
        activeIcon = svgAlert;
        pulseHtml = `<div class="absolute inset-0 rounded-full border-4 ${status.includes('FUEL') ? 'border-orange-500' : 'border-red-500'} animate-ping opacity-75"></div>`;
    }

    return L.divIcon({ 
        className: 'bg-transparent border-none', 
        html: `<div class="relative flex flex-col items-center justify-center w-12 h-12">
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
    useEffect(() => { 
        const t = setTimeout(() => map.invalidateSize(), 350); 
        return () => clearTimeout(t); 
    }, [isMaximized, isFeedOpen]);
    return null;
}

const AlertsLayer = memo(({ externalAlerts, gridRef, setExternalAlerts }) => {
    useEffect(() => {
        if (!gridRef.current) return;
        let grid = gridRef.current.gridstack;
        if (!grid) {
            grid = GridStack.init({ float: true, cellHeight: 'auto', margin: 5, column: 12, staticGrid: false }, gridRef.current);
        }
        const items = gridRef.current.querySelectorAll('.grid-stack-item');
        items.forEach(el => { if (!el.gridstackNode) grid.makeWidget(el); });
    }, [externalAlerts]);

    return (
        <div className="absolute top-20 left-0 w-full z-[1000] pointer-events-none px-4">
            <div ref={gridRef} className="grid-stack">
                {externalAlerts.map((alert) => {
                    const ui = formatAlertForUI(alert);
                    const autoMsg = encodeURIComponent(`Central recibió alerta de ${ui.typeLabel}`);
                    return (
                        <div key={ui.id} gs-id={ui.id} className="grid-stack-item pointer-events-auto" gs-w="4" gs-h="2" gs-auto-position="true">
                            <div className="grid-stack-item-content">
                                <div className="bg-slate-900/95 border-l-4 border-red-600 p-3 rounded-r-xl shadow-2xl backdrop-blur-md h-full cursor-move overflow-hidden">
                                    <div className="flex justify-between items-start gap-2 h-full">
                                        <div className="flex gap-2 overflow-hidden">
                                            <span className="text-xl animate-pulse shrink-0">🚨</span>
                                            <div className="overflow-hidden">
                                                <h4 className="font-black text-red-500 text-[8px] uppercase truncate">Emergencia</h4>
                                                <p className="text-white font-black text-[10px] sm:text-xs uppercase truncate">{ui.typeLabel}</p>
                                                <p className="text-blue-400 text-[9px] italic truncate">📍 {ui.address}</p>
                                                <div className="grid grid-cols-2 gap-x-2 text-[8px] text-slate-300 border-t border-white/10 mt-1 pt-1">
                                                    <p className="truncate"><b>CH:</b> {ui.driver_name}</p>
                                                    <p className="truncate"><b>PL:</b> {ui.plate}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 shrink-0">
                                            <Link href={`/chat?contact_id=${alert.driver_id}&auto_msg=${autoMsg}`} className="bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded uppercase">Chat</Link>
                                            <button onClick={() => setExternalAlerts(prev => prev.filter(a => a.id !== alert.id))} className="text-slate-500 text-[8px] font-black uppercase">Cerrar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

export default function TrackingMap({ darkMode = false, authUser, externalAlerts = [], setExternalAlerts }) {
    const [fleet, setFleet] = useState({});
    const [liveAlerts, setLiveAlerts] = useState([]); 
    const [isFeedOpen, setIsFeedOpen] = useState(true);
    const [isMaximized, setIsMaximized] = useState(false);
    const gridRef = useRef(null);

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
                        speed: loc.speed, 
                        fuel: parseFloat(loc.fuel_level),
                        trip_status: loc.trip.status,
                        address: e.address,
                        route: e.address?.split(',')[0] || 'Vía local',
                        origin: loc.trip.origin || 'Base',
                        destination: loc.trip.destination || 'Destino',
                        // 🚀 AQUÍ SE ASIGNA EL NOMBRE REAL DEL CHOFER DEL SOCKET
                        driver_name: loc.trip.driver?.name || 'Chofer no asignado'
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
            <div className="flex-1 relative h-full w-full flex flex-col overflow-hidden">
                
                <AlertsLayer externalAlerts={externalAlerts} gridRef={gridRef} setExternalAlerts={setExternalAlerts} />

                <div className="absolute top-4 right-4 z-[500] flex gap-2">
                    <button onClick={() => setIsMaximized(!isMaximized)} className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase shadow-xl border ${darkMode ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-slate-900'}`}>
                        {isMaximized ? '🗗 Contraer' : '🗖 Expandir'}
                    </button>
                    <button onClick={() => setIsFeedOpen(!isFeedOpen)} className="text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase shadow-xl border bg-blue-600">
                        Auditoría
                    </button>
                </div>

                <MapContainer center={[-25.7324, -58.6086]} zoom={8} style={{ height: '100%', width: '100%' }} className="z-0">
                    <MapResizeController isMaximized={isMaximized} isFeedOpen={isFeedOpen} />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {Object.values(fleet).map((v) => {
                        const isCritical = ['SOS', 'AVERIA', 'SIN_COMBUSTIBLE'].includes(v.trip_status?.toUpperCase());
                        return (
                            <Marker key={v.id} position={[v.lat, v.lng]} icon={createCustomMarker(v, v.trip_status)}>
                                <Popup>
                                    <div className="min-w-[180px] text-xs font-bold font-sans text-slate-900">
                                        <div className="flex items-center gap-2 border-b pb-1 mb-1">
                                            <span className="text-lg">🚐</span>
                                            <div className="leading-none">
                                                <p className="font-black uppercase text-blue-600">{v.license_plate}</p>
                                                <p className="text-[9px] opacity-60 uppercase">{v.model}</p>
                                            </div>
                                        </div>
                                        
                                        {/* 👤 NOMBRE DEL CHOFER REAL */}
                                        <p className="mb-1 uppercase text-slate-700 font-black italic">👤 Chofer: <span className="text-blue-700 not-italic">{v.driver_name}</span></p>

                                        <div className="bg-slate-100 p-1.5 rounded-md mb-2 border-l-4 border-blue-500">
                                            <p className="text-[10px] uppercase text-slate-500">Recorrido:</p>
                                            <p className="text-[11px] font-black truncate">🏠 {v.origin} → 🏁 {v.destination}</p>
                                            <p className="text-[10px] font-bold text-blue-700 mt-1 italic">🛣️ {v.route}</p>
                                        </div>
                                        
                                        {isCritical && (
                                            <div className="bg-red-50 p-1.5 rounded-md mb-2 border-l-4 border-red-500 animate-pulse">
                                                <p className="text-[9px] text-red-600 font-black uppercase">Emergencia en:</p>
                                                <p className="text-[10px] italic leading-tight">{v.address}</p>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center text-[9px] opacity-60 border-t pt-1">
                                            <span>COORD: {v.lat.toFixed(4)}, {v.lng.toFixed(4)}</span>
                                            <span className={v.speed > 80 ? 'text-red-600 font-black' : ''}>{v.speed} KM/H</span>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>

            <div className="relative flex h-full">
                <button 
                    onClick={() => setIsFeedOpen(!isFeedOpen)}
                    className={`absolute left-[-24px] top-1/2 -translate-y-1/2 z-[1001] w-6 h-24 flex items-center justify-center rounded-l-xl border shadow-2xl transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-blue-400' : 'bg-white border-gray-200 text-blue-600'}`}
                >
                    <span className={`transform transition-transform ${isFeedOpen ? 'rotate-0' : 'rotate-180'} font-black text-xs`}>▶</span>
                </button>
                <AlertSidebar isFeedOpen={isFeedOpen} liveAlerts={liveAlerts} darkMode={darkMode} vehiclesList={Object.values(fleet)} />
            </div>
        </div>
    );
}