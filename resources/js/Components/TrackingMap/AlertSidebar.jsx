import React from 'react';

// 🎨 Motor dinámico de colores de alto contraste (A prueba de fallos de Tailwind)
const getAlertStyles = (category, darkMode) => {
    switch (category) {
        case 'CRITICAL':
            return {
                card: darkMode ? 'bg-[#450a0a] border-red-500' : 'bg-[#fef2f2] border-red-400',
                badge: 'bg-red-600 text-white shadow-md',
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
                innerBox: darkMode ? 'bg-black/40 border-amber-900/50 text-slate-300' : 'bg-white border-amber-200 text-slate-800',
                icon: false
            };
        case 'SUCCESS':
            return {
                card: darkMode ? 'bg-[#022c22] border-emerald-500/50' : 'bg-[#ecfdf5] border-emerald-400',
                badge: 'bg-emerald-500 text-white shadow-md',
                text: darkMode ? 'text-emerald-100' : 'text-emerald-950',
                innerBox: darkMode ? 'bg-black/40 border-emerald-900/50 text-slate-300' : 'bg-white border-emerald-200 text-slate-800',
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

export default function AlertSidebar({ 
    isFeedOpen, vehiclesList, filterVehicle, setFilterVehicle, 
    filterType, setFilterType, liveAlerts, isLoading, 
    page, fetchAlerts, hasMore, darkMode 
}) {
    return (
        <div className={`transition-all duration-300 ease-in-out flex flex-col border-l z-[600] 
            ${darkMode ? 'bg-[#0f172a] border-slate-700' : 'bg-[#f8fafc] border-slate-300'}
            ${isFeedOpen ? 'w-[360px] shadow-2xl' : 'w-0 opacity-0 overflow-hidden'}`}>
            
            <div className="w-[360px] h-full flex flex-col">
                
                {/* CABECERA Y FILTROS */}
                <div className={`p-4 shadow-md shrink-0 border-b z-10 ${darkMode ? 'bg-[#020617] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h2 className={`font-black flex items-center gap-2 tracking-wide text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        AUDITORÍA DE FLOTA
                    </h2>
                    
                    <div className="mt-3 space-y-2.5">
                        <select 
                            value={filterVehicle} 
                            onChange={(e) => setFilterVehicle(e.target.value)}
                            className={`w-full text-xs font-bold rounded-md p-1.5 focus:ring-blue-500 cursor-pointer border ${darkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-100 text-slate-800 border-slate-300'}`}
                        >
                            <option value="ALL">🚛 Todos los vehículos</option>
                            {vehiclesList.map(v => (
                                <option key={v.license_plate} value={v.license_plate}>{v.license_plate} - {v.model}</option>
                            ))}
                        </select>

                        <div className="flex justify-between gap-1.5">
                            <button onClick={() => setFilterType('ALL')} className={`flex-1 text-[9px] font-black uppercase py-1.5 rounded transition-all ${filterType === 'ALL' ? 'bg-blue-600 text-white shadow-md' : (darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300')}`}>Todas</button>
                            <button onClick={() => setFilterType('CRITICAL')} className={`flex-1 text-[9px] font-black uppercase py-1.5 rounded transition-all ${filterType === 'CRITICAL' ? 'bg-red-600 text-white shadow-md' : (darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300')}`}>🚨 Críticas</button>
                            <button onClick={() => setFilterType('ROUTE')} className={`flex-1 text-[9px] font-black uppercase py-1.5 rounded transition-all ${filterType === 'ROUTE' ? 'bg-green-600 text-white shadow-md' : (darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300')}`}>🏁 Rutas</button>
                            <button onClick={() => setFilterType('SPEED')} className={`flex-1 text-[9px] font-black uppercase py-1.5 rounded transition-all ${filterType === 'SPEED' ? 'bg-amber-500 text-amber-950 shadow-md' : (darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300')}`}>⚡ Vel.</button>
                        </div>
                    </div>
                </div>
                
                {/* LISTA DE ALERTAS */}
                {/* 🛡️ Forzamos el color de fondo usando código HEX para evitar que Tailwind lo sobrescriba */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: darkMode ? '#0f172a' : '#f8fafc' }}>
                    
                    {isLoading && page === 1 ? (
                        <p className="text-center text-blue-500 text-xs font-bold mt-10 animate-pulse">Consultando historial...</p>
                    ) : liveAlerts.length === 0 ? (
                        <p className="text-center text-slate-500 text-xs font-bold mt-10">No hay registros para este filtro.</p>
                    ) : (
                        liveAlerts.map((alert, index) => {
                            const styles = getAlertStyles(alert.category, darkMode);
                            
                            return (
                                <div key={`${alert.id}-${index}`} className={`p-4 rounded-xl border-2 transition-all hover:-translate-y-0.5 shadow-md ${styles.card}`}>
                                    
                                    {/* 🏷️ Cabecera (Badge y Fecha) */}
                                    <div className="flex justify-between items-start mb-3 border-b border-black/5 pb-2">
                                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-md border border-transparent flex items-center gap-1.5 ${styles.badge}`}>
                                            {styles.icon && (
                                                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            )}
                                            {alert.typeLabel}
                                        </span>

                                        <div className="text-right">
                                            <span className={`block text-[10px] font-black ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{alert.date}</span>
                                            <span className={`block text-[9px] font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{alert.time}</span>
                                        </div>
                                    </div>

                                    {/* 📝 Mensaje Principal */}
                                    <p className={`text-sm font-black leading-snug tracking-tight mb-3 ${styles.text}`}>{alert.message}</p>

                                    {/* 🚚 Detalles del Vehículo y Viaje */}
                                    <div className={`p-3 rounded-lg border shadow-sm mb-3 ${styles.innerBox}`}>
                                        <p className={`text-xs font-black flex items-center gap-1.5 mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 4C1.89543 4 1 4.89543 1 6V17H3.0625C3.38501 18.705 4.87321 20 6.66667 20C8.46012 20 9.94833 18.705 10.2708 17H13.7292C14.0517 18.705 15.5399 20 17.3333 20C19.1268 20 20.615 18.705 20.9375 17H23V12L19 4H3ZM3 6H16V12H3V6ZM17 6L20 12H17V6ZM6.66667 15C5.74619 15 5 15.7462 5 16.6667C5 17.5871 5.74619 18.3333 6.66667 18.3333C7.58714 18.3333 8.33333 17.5871 8.33333 16.6667C8.33333 15.7462 7.58714 15 6.66667 15ZM17.3333 15C16.4128 15 15.6667 15.7462 15.6667 16.6667C15.6667 17.5871 16.4128 18.3333 17.3333 18.3333C18.2538 18.3333 19 17.5871 19 16.6667C19 15.7462 18.2538 15 17.3333 15Z"/></svg>
                                            {alert.plate} <span className="font-bold opacity-70 ml-0.5">({alert.model})</span>
                                        </p>
                                        
                                        <div className="flex flex-col gap-1 text-[11px]">
                                            <p>🚀 Salida: <span className="font-bold">{alert.origin}</span></p>
                                            <p>🏁 Destino: <span className="font-bold">{alert.destination}</span></p>
                                        </div>
                                    </div>

                                    {/* 📍 Ubicación Exacta y Coordenadas */}
                                    {alert.address && (
                                        <p className={`text-[10px] font-bold mb-2 px-2.5 py-2 rounded flex items-start gap-1.5 leading-tight ${darkMode ? 'bg-black/50 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                                            <span className="text-red-500 shrink-0">📍</span> {alert.address}
                                        </p>
                                    )}

                                    {/* 📉 Footer: Lat/Lng y Retrasos */}
                                    <div className={`pt-2 flex items-center justify-between text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        <div>
                                            LAT: {alert.lat.toFixed(4)} <span className="mx-1 opacity-50">|</span> LNG: {alert.lng.toFixed(4)}
                                        </div>
                                        
                                        {/* ⏳ ALERTA DE RETRASO */}
                                        {alert.delay && (
                                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${darkMode ? 'text-orange-400 bg-orange-500/20 border-orange-500/30' : 'text-orange-700 bg-orange-100 border-orange-300'}`}>
                                                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                +{alert.delay}
                                            </span>
                                        )}
                                    </div>

                                </div>
                            );
                        })
                    )}

                    {hasMore && (
                        <button 
                            onClick={() => fetchAlerts(page + 1)}
                            disabled={isLoading}
                            className={`w-full mt-4 py-2.5 font-black text-xs uppercase tracking-widest rounded-lg border transition-all disabled:opacity-50 
                            ${darkMode ? 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white' : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50 shadow-sm'}`}
                        >
                            {isLoading ? 'Cargando...' : '↓ Cargar más historial'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}