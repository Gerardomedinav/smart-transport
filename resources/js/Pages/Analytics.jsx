import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

export default function Analytics({ auth }) {
    const [darkMode, setDarkMode] = useState(true);
    const [timeFilter, setTimeFilter] = useState('HOY');
    const [locationFilter, setLocationFilter] = useState('ALL');
    
    const [isLoading, setIsLoading] = useState(true);
    const [dbData, setDbData] = useState({
        // 🚀 Nos aseguramos de inicializar totalTrips en 0
        kpis: { totalTrips: 0, completedTrips: 0, totalCargo: 0, delayRate: 0, speedAlerts: 0 },
        incidentData: [],
        cargoData: [],
        vehicleData: [] 
    });

    useEffect(() => {
        setIsLoading(true);
        axios.get('/api/analytics', { params: { time: timeFilter, location: locationFilter } })
        .then(response => {
            const data = response.data;
            setDbData({
                kpis: data.kpis,
                incidentData: data.incidentData.length > 0 ? data.incidentData : [{ name: 'Operación Perfecta', value: 100, color: '#10B981' }],
                cargoData: data.cargoData,
                vehicleData: data.vehicleData
            });
            setIsLoading(false);
        }).catch(err => { console.error(err); setIsLoading(false); });
    }, [timeFilter, locationFilter]);

    // 🎨 Configuración de estilo global para el Tooltip (Fondo claro, texto oscuro siempre)
    const tooltipStyle = {
        backgroundColor: '#ffffff', 
        borderColor: '#e2e8f0',     
        color: '#0f172a',           
        borderRadius: '8px',
        fontWeight: 'bold',         
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
    };

    // Estilo para el texto dentro del tooltip (Para gráficos que usan itemStyle)
    const itemStyle = {
        color: '#0f172a',
        fontWeight: 'bold'
    };

    // 💡 Lógica para cambiar el título de la tarjeta según el filtro
    const getTripsCardTitle = () => {
        if (timeFilter === 'HOY') return 'Viajes de Hoy';
        if (timeFilter === 'MES') return 'Viajes del Mes';
        if (timeFilter === 'ANUAL') return 'Viajes del Año';
        return 'Total de Viajes';
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Estadísticas de Flota" darkMode={darkMode}>
            <Head title="Métricas - Terminal Global" />

            <div className={`min-h-[calc(100vh-64px)] p-4 lg:p-8 transition-colors duration-500 ${darkMode ? 'bg-slate-900' : 'bg-gray-100'}`}>
                
                {/* 🎛️ BARRA DE FILTROS SUPERIOR */}
                <div className={`p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                    <div className="flex gap-2">
                        <button onClick={() => setTimeFilter('HOY')} className={`px-4 py-1.5 text-xs font-black uppercase rounded-lg border transition-all ${timeFilter === 'HOY' ? 'bg-blue-600 text-white border-blue-600' : (darkMode ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600' : 'bg-gray-100 text-gray-600')}`}>Hoy</button>
                        <button onClick={() => setTimeFilter('MES')} className={`px-4 py-1.5 text-xs font-black uppercase rounded-lg border transition-all ${timeFilter === 'MES' ? 'bg-blue-600 text-white border-blue-600' : (darkMode ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600' : 'bg-gray-100 text-gray-600')}`}>Mes</button>
                        <button onClick={() => setTimeFilter('ANUAL')} className={`px-4 py-1.5 text-xs font-black uppercase rounded-lg border transition-all ${timeFilter === 'ANUAL' ? 'bg-blue-600 text-white border-blue-600' : (darkMode ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600' : 'bg-gray-100 text-gray-600')}`}>Año</button>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto items-center">
                        {isLoading && <span className="text-xs font-bold text-blue-500 animate-pulse">Actualizando...</span>}
                        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className={`text-xs font-bold rounded-lg px-4 py-2 border w-full md:w-48 ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-slate-700 border-gray-300'}`}>
                            <option value="ALL">📍 Toda la Provincia</option>
                            <option value="FORMOSA">Formosa Capital</option>
                            <option value="CLORINDA">Clorinda</option>
                            <option value="PIRANE">Pirané</option>
                            <option value="LOMITAS">Las Lomitas</option>
                        </select>
                        <button onClick={() => setDarkMode(!darkMode)} className={`px-4 py-1.5 rounded-lg font-black text-[10px] tracking-widest transition-all border ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-slate-900'}`}>
                            {darkMode ? '☀️ CLARO' : '🌙 OSCURO'}
                        </button>
                    </div>
                </div>

                {/* 📈 TARJETAS KPI (Ahora son 5) */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-6">
                    {/* 🚀 Usamos la función para el título dinámico y la variable totalTrips */}
                    <MetricCard title={getTripsCardTitle()} value={dbData.kpis.totalTrips} subtitle="En curso y finalizados" icon="📅" darkMode={darkMode} color="text-purple-500" />
                    
                    <MetricCard title="Finalizados" value={dbData.kpis.completedTrips} subtitle="Viajes con éxito" icon="🚚" darkMode={darkMode} color="text-green-500" />
                    <MetricCard title="Mercadería" value={`${dbData.kpis.totalCargo} Ton`} subtitle="Volumen acumulado" icon="📦" darkMode={darkMode} color="text-blue-500" />
                    <MetricCard title="Tasa Retrasos" value={`${dbData.kpis.delayRate}%`} subtitle="Averías / Eventos" icon="⏳" darkMode={darkMode} color="text-orange-500" />
                    <MetricCard title="Infracciones" value={dbData.kpis.speedAlerts} subtitle="Excesos velocidad" icon="⚡" darkMode={darkMode} color="text-red-500" />
                </div>

                {/* 📉 ZONA DE GRÁFICOS GENERALES (Fila 1) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    
                    {/* Gráfico de Barras: Volumen de Carga */}
                    <div className={`col-span-1 lg:col-span-2 p-6 rounded-xl shadow-sm border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                        <h3 className={`text-sm font-black uppercase tracking-wide mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Volumen de Carga por Día (Toneladas)</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer>
                                <BarChart data={dbData.cargoData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} vertical={false} />
                                    <XAxis dataKey="name" stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} />
                                    <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        cursor={{ fill: darkMode ? '#1e293b' : '#f1f5f9' }} 
                                        contentStyle={tooltipStyle} 
                                        itemStyle={itemStyle} 
                                    />
                                    <Bar dataKey="toneladas" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Gráfico de Dona: Incidentes */}
                    <div className={`col-span-1 p-6 rounded-xl shadow-sm border flex flex-col ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                        <h3 className={`text-sm font-black uppercase tracking-wide mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Desglose de Eventos</h3>
                        <div className="flex-1 min-h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={dbData.incidentData} innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                        {dbData.incidentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={tooltipStyle} 
                                        itemStyle={itemStyle} 
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                            {dbData.incidentData.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-xs font-bold">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                                        <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>{item.name}</span>
                                    </div>
                                    <span className={darkMode ? 'text-white' : 'text-slate-900'}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 🚚 ZONA DE ANÁLISIS DE FLOTA (Fila 2: Los dos gráficos de vehículos juntos) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Gráfico A: Carga Transportada por Vehículo */}
                    <div className={`p-6 rounded-xl shadow-sm border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                        <h3 className={`text-sm font-black uppercase tracking-wide mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Carga Total Movilizada por Camión</h3>
                        <div className="h-64 w-full">
                            {dbData.vehicleData.length > 0 ? (
                                <ResponsiveContainer>
                                    <BarChart data={dbData.vehicleData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} vertical={false} />
                                        <XAxis dataKey="patente" stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} />
                                        <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            cursor={{ fill: darkMode ? '#1e293b' : '#f1f5f9' }} 
                                            contentStyle={tooltipStyle} 
                                            itemStyle={itemStyle} 
                                        />
                                        <Bar dataKey="carga" name="Toneladas" fill="#10B981" radius={[4, 4, 0, 0]} barSize={35} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-500 font-bold text-sm">Sin datos registrados.</div>
                            )}
                        </div>
                    </div>

                    {/* 🚨 Gráfico B: Gráfico de Retrasos por Vehículo */}
                    <div className={`p-6 rounded-xl shadow-sm border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                        <h3 className={`text-sm font-black uppercase tracking-wide mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Tiempo de Retraso Acumulado por Camión</h3>
                        <div className="h-64 w-full">
                            {dbData.vehicleData.length > 0 ? (
                                <ResponsiveContainer>
                                    <BarChart data={dbData.vehicleData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} vertical={false} />
                                        <XAxis dataKey="patente" stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} />
                                        <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            cursor={{ fill: darkMode ? '#1e293b' : '#f1f5f9' }} 
                                            contentStyle={tooltipStyle} 
                                            itemStyle={itemStyle} 
                                        />
                                        <Bar dataKey="retrasos_minutos" name="Minutos de Retraso" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={35} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-500 font-bold text-sm">Sin datos registrados.</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function MetricCard({ title, value, subtitle, icon, darkMode, color }) {
    return (
        <div className={`p-4 lg:p-6 rounded-xl shadow-sm border flex items-center gap-3 lg:gap-4 transition-all hover:-translate-y-1 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
            <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-xl lg:text-2xl bg-opacity-20 shrink-0 ${color.replace('text-', 'bg-')}`}>
                {icon}
            </div>
            <div className="overflow-hidden">
                <h4 className={`text-[9px] lg:text-[10px] font-black uppercase tracking-widest truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{title}</h4>
                <p className={`text-xl lg:text-2xl font-black mt-0.5 lg:mt-1 truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{value}</p>
                <p className={`text-[9px] lg:text-[10px] font-bold mt-0.5 lg:mt-1 truncate ${color}`}>{subtitle}</p>
            </div>
        </div>
    );
}