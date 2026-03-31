import React from 'react';

const getAlertStyles = (category, darkMode) => {
    switch (category) {
        case 'CRITICAL':
            return {
                card: darkMode ? 'bg-[#450a0a] border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-[#fef2f2] border-red-400',
                badge: 'bg-red-600 text-white shadow-md animate-pulse',
                text: darkMode ? 'text-red-100' : 'text-red-950',
                innerBox: darkMode ? 'bg-black/40 border-red-900/50 text-slate-300' : 'bg-white border-red-200 text-slate-800',
                icon: true
            };
        case 'WARNING':
            return {
                card: darkMode ? 'bg-[#431407] border-orange-500' : 'bg-[#fff7ed] border-orange-400',
                badge: 'bg-orange-500 text-white shadow-md',
                text: darkMode ? 'text-orange-100' : 'text-orange-950',
                innerBox: darkMode ? 'bg-black/40 border-orange-900/50 text-slate-300' : 'bg-white border-orange-200 text-slate-800',
                icon: true
            };
        case 'SPEED':
            return {
                card: darkMode ? 'bg-[#422006] border-amber-500/50' : 'bg-[#fffbeb] border-amber-400',
                badge: 'bg-amber-400 text-amber-950 font-black shadow-md',
                text: darkMode ? 'text-amber-100' : 'text-amber-950',
                innerBox: darkMode ? 'bg-black/40 border-amber-900/50 text-slate-300' : 'bg-white border-red-200 text-slate-800',
                icon: false
            };
        default:
            return {
                card: darkMode ? 'bg-[#0f172a] border-blue-500/50' : 'bg-[#f0f9ff] border-blue-300',
                badge: 'bg-blue-600 text-white',
                text: darkMode ? 'text-blue-100' : 'text-blue-950',
                innerBox: darkMode ? 'bg-black/40 border-blue-900/50 text-slate-300' : 'bg-white border-blue-200 text-slate-800',
                icon: false
            };
    }
};

export default function AlertSidebar({ isFeedOpen, vehiclesList = [], filterVehicle, setFilterVehicle, filterType, setFilterType, liveAlerts = [], isLoading, page, fetchAlerts, hasMore, darkMode }) {
    return (
        <div className={`transition-all duration-300 flex flex-col border-l z-[600] ${darkMode ? 'bg-[#0f172a] border-slate-700' : 'bg-[#f8fafc] border-slate-300'} ${isFeedOpen ? 'w-[360px] shadow-2xl' : 'w-0 opacity-0 overflow-hidden'}`}>
            <div className="w-[360px] h-full flex flex-col">
                <div className={`p-4 shadow-md shrink-0 border-b z-10 ${darkMode ? 'bg-[#020617] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h2 className="font-black flex items-center gap-2 text-xs uppercase tracking-wide text-white">AUDITORÍA EN TIEMPO REAL</h2>
                    <div className="mt-3 space-y-2.5">
                        <select value={filterVehicle} onChange={(e) => setFilterVehicle(e.target.value)} className="w-full text-[10px] font-black rounded-md p-2 bg-slate-800 border-none outline-none uppercase">
                            <option value="ALL">🚛 Todos los vehículos</option>
                            {vehiclesList.map(v => (<option key={v.license_plate} value={v.license_plate}>{v.license_plate} - {v.model}</option>))}
                        </select>
                        <div className="flex justify-between gap-1">
                            {['ALL', 'CRITICAL', 'ROUTE', 'SPEED'].map((type) => (
                                <button key={type} onClick={() => setFilterType(type)} className={`flex-1 text-[9px] font-black uppercase py-2 rounded-md transition-all ${filterType === type ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800/50 text-slate-400'}`}>
                                    {type === 'ALL' ? 'Todas' : type === 'CRITICAL' ? '🚨 Críticas' : type === 'ROUTE' ? '🏁 Rutas' : '⚡ Vel.'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar" style={{ backgroundColor: darkMode ? '#0f172a' : '#f8fafc' }}>
                    {(liveAlerts || []).map((alert, index) => {
                        const styles = getAlertStyles(alert.category || 'DEFAULT', darkMode);
                        return (
                            <div key={`${alert.id}-${index}`} className={`p-3 rounded-xl border-2 transition-all shadow-md ${styles.card}`}>
                                <div className="flex justify-between items-start mb-2 border-b border-black/5 pb-2">
                                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${styles.badge}`}>
                                        {styles.icon && <span>🚨</span>} {alert.typeLabel || alert.type?.replace('_', ' ')}
                                    </span>
                                    <span className="text-[9px] font-black opacity-50 uppercase">{alert.timestamp?.split(' ')[1] || 'AHORA'}</span>
                                </div>
                                <p className={`text-[12px] font-black leading-tight mb-3 ${styles.text}`}>{alert.message || alert.content}</p>

                                {/* 📍 UBICACIÓN REAL (DIRECCIÓN) */}
                                <div className={`p-2 rounded-lg mb-2 text-[10px] font-bold border flex items-start gap-2 ${styles.innerBox}`}>
                                    <span className="text-red-500 text-xs">📍</span>
                                    <span className="leading-tight italic">{alert.address || "Localizando..."}</span>
                                </div>

                                <div className={`p-2.5 rounded-lg border shadow-inner mb-2 ${styles.innerBox}`}>
                                    <p className="text-[10px] font-black uppercase">{alert.plate || alert.vehicle_plate} <span className="opacity-50">({alert.model || alert.vehicle_model})</span></p>
                                </div>
                                <div className="flex items-center justify-between text-[8px] font-black opacity-50 uppercase">
                                    {/* 📍 COORDENADAS SIDEBAR */}
                                    <span>COORD: {parseFloat(alert.lat || alert.latitude || 0).toFixed(4)}, {parseFloat(alert.lng || alert.longitude || 0).toFixed(4)}</span>
                                    {alert.driver_name && <span>👤 {alert.driver_name}</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}