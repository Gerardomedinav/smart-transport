// resources/js/Components/TrackingMap/AlertSidebar.jsx
import React from 'react';

export default function AlertSidebar({ 
    isFeedOpen, vehiclesList, filterVehicle, setFilterVehicle, 
    filterType, setFilterType, liveAlerts, isLoading, 
    page, fetchAlerts, hasMore 
}) {
    return (
        <div className={`transition-all duration-300 ease-in-out flex flex-col bg-slate-100 border-l border-slate-300 z-[600] ${isFeedOpen ? 'w-[340px] shadow-2xl' : 'w-0 opacity-0 overflow-hidden'}`}>
            <div className="w-[340px] h-full flex flex-col">
                
                {/* CABECERA Y FILTROS */}
                <div className="bg-slate-800 p-4 shadow-md shrink-0 border-b border-slate-700">
                    <h2 className="text-white font-black flex items-center gap-2 tracking-wide text-sm">
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        AUDITORÍA DE FLOTA
                    </h2>
                    
                    <div className="mt-3 space-y-2">
                        {/* Selector de Vehículo */}
                        <select 
                            value={filterVehicle} 
                            onChange={(e) => setFilterVehicle(e.target.value)}
                            className="w-full text-xs font-bold bg-slate-700 text-white border-slate-600 rounded-md p-1.5 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="ALL">🚛 Todos los vehículos</option>
                            {vehiclesList.map(v => (
                                <option key={v.license_plate} value={v.license_plate}>{v.license_plate} - {v.model}</option>
                            ))}
                        </select>

                        {/* Botonera de Categorías */}
                        <div className="flex justify-between gap-1">
                            <button onClick={() => setFilterType('ALL')} className={`flex-1 text-[9px] font-black uppercase py-1.5 rounded transition-colors shadow-sm ${filterType === 'ALL' ? 'bg-blue-500 text-white border border-blue-400' : 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600'}`}>Todas</button>
                            <button onClick={() => setFilterType('CRITICAL')} className={`flex-1 text-[9px] font-black uppercase py-1.5 rounded transition-colors shadow-sm ${filterType === 'CRITICAL' ? 'bg-red-500 text-white border border-red-400' : 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600'}`}>🚨 Críticas</button>
                            <button onClick={() => setFilterType('ROUTE')} className={`flex-1 text-[9px] font-black uppercase py-1.5 rounded transition-colors shadow-sm ${filterType === 'ROUTE' ? 'bg-green-500 text-white border border-green-400' : 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600'}`}>🏁 Rutas</button>
                            <button onClick={() => setFilterType('SPEED')} className={`flex-1 text-[9px] font-black uppercase py-1.5 rounded transition-colors shadow-sm ${filterType === 'SPEED' ? 'bg-amber-500 text-white border border-amber-400' : 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600'}`}>⚡ Vel.</button>
                        </div>
                    </div>
                </div>
                
                {/* LISTA DE ALERTAS */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {isLoading && page === 1 ? (
                        <p className="text-center text-blue-500 text-xs font-bold mt-10 animate-pulse">Aplicando filtros...</p>
                    ) : liveAlerts.length === 0 ? (
                        <p className="text-center text-slate-400 text-xs font-bold mt-10">No hay registros para este filtro.</p>
                    ) : (
                        liveAlerts.map((alert, index) => (
                            <div key={`${alert.id}-${index}`} className={`p-3 rounded-lg border-2 ${alert.bg} ${alert.cardStyle} transition-all hover:shadow-lg animate-fade-in-up flex flex-col gap-2 bg-white/90`}>
                                <div className="flex justify-between items-start">
                                    
                                    {/* 🛠️ AQUI SE ARREGLAN LOS TÍTULOS EN BLANCO */}
                                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border flex items-center gap-1 w-max ${alert.badgeStyle}`}>
                                        {alert.hasDangerIcon && (
                                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        )}
                                        {alert.typeLabel}
                                    </span>

                                    <div className="text-right mt-0.5">
                                        <span className="block text-[10px] font-black text-slate-600">{alert.date}</span>
                                        <span className="block text-[9px] font-bold text-slate-400">{alert.time} hs</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-800 font-black leading-relaxed tracking-tight">{alert.message}</p>

                                <div className="bg-white p-2 rounded border border-slate-100 mt-1 shadow-sm">
                                    <p className="text-[10px] font-black text-slate-700 flex items-center gap-1.5 mb-1.5">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-slate-400"><path d="M3 4C1.89543 4 1 4.89543 1 6V17H3.0625C3.38501 18.705 4.87321 20 6.66667 20C8.46012 20 9.94833 18.705 10.2708 17H13.7292C14.0517 18.705 15.5399 20 17.3333 20C19.1268 20 20.615 18.705 20.9375 17H23V12L19 4H3ZM3 6H16V12H3V6ZM17 6L20 12H17V6ZM6.66667 15C5.74619 15 5 15.7462 5 16.6667C5 17.5871 5.74619 18.3333 6.66667 18.3333C7.58714 18.3333 8.33333 17.5871 8.33333 16.6667C8.33333 15.7462 7.58714 15 6.66667 15ZM17.3333 15C16.4128 15 15.6667 15.7462 15.6667 16.6667C15.6667 17.5871 16.4128 18.3333 17.3333 18.3333C18.2538 18.3333 19 17.5871 19 16.6667C19 15.7462 18.2538 15 17.3333 15Z"/></svg>
                                        {alert.plate} <span className="font-bold text-slate-400">({alert.model})</span>
                                    </p>
                                </div>

                                {alert.address && (
                                    <p className="text-[10.5px] font-black text-slate-700 mb-1 px-2 py-1 bg-white rounded border border-slate-100 flex items-center gap-1.5 shadow-sm">
                                        📍 {alert.address}
                                    </p>
                                )}
                            </div>
                        ))
                    )}

                    {hasMore && (
                        <button 
                            onClick={() => fetchAlerts(page + 1)}
                            disabled={isLoading}
                            className="w-full mt-4 py-2 bg-slate-200 text-slate-600 font-bold text-xs rounded border border-slate-300 hover:bg-slate-300 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Cargando datos...' : '⬇️ Cargar más historial'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}