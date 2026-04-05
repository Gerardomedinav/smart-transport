import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LabelList } from 'recharts';
import axios from 'axios';

export default function Analytics({ auth }) {
    const [darkMode, setDarkMode] = useState(true);
    const [timeFilter, setTimeFilter] = useState('HOY');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({ 
        kpis: { trips: {}, cargo: {}, speed: {}, efficiency: {}, maintenance: 0 }, 
        incidentData: [], cargoData: [], vehicleData: [], heatMapData: [] 
    });

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        axios.get('/api/analytics-metrics', { params: { time: timeFilter } })
            .then(res => {
                setData(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.response?.data?.error || "Error de conexión con el servidor");
                setIsLoading(false);
            });
    }, [timeFilter]);

    if (error) return (
        <AuthenticatedLayout user={auth.user} header="Error" darkMode={darkMode}>
            <div className="p-8 text-center">
                <div className="bg-red-500/10 border border-red-500 p-6 rounded-2xl inline-block">
                    <h2 className="text-red-500 font-black uppercase mb-2">Error Crítico de Datos</h2>
                    <p className="text-white text-xs opacity-60 mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="bg-red-500 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase">Reintentar</button>
                </div>
            </div>
        </AuthenticatedLayout>
    );

    const chartText = darkMode ? '#94a3b8' : '#475569';
    const labelColor = darkMode ? '#ffffff' : '#000000';

    return (
        <AuthenticatedLayout user={auth.user} header="Monitor de Eficiencia Logística" darkMode={darkMode}>
            <Head title="BI Formosa" />

            <div className={`p-4 lg:p-8 min-h-screen transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-white' : 'bg-gray-100 text-slate-900'}`}>
                
                {isLoading && <div className="fixed top-0 left-0 w-full h-1 bg-blue-600 animate-pulse z-50"></div>}

                {/* FILTROS TIEMPO */}
                <div className={`p-4 rounded-2xl shadow-sm mb-6 flex justify-between items-center ${darkMode ? 'bg-slate-900 border border-white/5' : 'bg-white border-gray-200'}`}>
                    <div className="flex gap-2 bg-black/20 p-1 rounded-xl">
                        {['HOY', 'SEMANA', 'MES', 'ANUAL'].map(f => (
                            <button key={f} onClick={() => setTimeFilter(f)} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${timeFilter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>{f}</button>
                        ))}
                    </div>
                    <button onClick={() => setDarkMode(!darkMode)} className="text-[10px] font-black uppercase border border-blue-500/30 px-4 py-2 rounded-xl text-blue-500">{darkMode ? '☀️' : '🌙'}</button>
                </div>

                {/* KPIS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <KPI color="purple" icon="📈" label="Viajes" data={data.kpis.trips} darkMode={darkMode} />
                    <KPI color="blue" icon="📦" label="Tonelaje" data={data.kpis.cargo} darkMode={darkMode} />
                    <KPI color="green" icon="📊" label="Ton por Km" data={data.kpis.efficiency} darkMode={darkMode} sub="Eficiencia Real" />
                    <KPI color="red" icon="⚡" label="Multas" data={data.kpis.speed} darkMode={darkMode} />
                    <KPI color="orange" icon="🛠️" label="Mantenimiento" data={{val: data.kpis.maintenance}} darkMode={darkMode} />
                </div>

                {/* GRÁFICO PRINCIPAL */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className={`lg:col-span-2 p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-white/5' : 'bg-white shadow-sm'}`}>
                        <h3 className="text-xs font-black uppercase opacity-40 mb-8 tracking-widest italic">Carga por Período (Toneladas)</h3>
                        <div className="h-80">
                            <ResponsiveContainer>
                                <BarChart data={data.cargoData} margin={{ top: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#ffffff05' : '#e2e8f0'} />
                                    <XAxis dataKey="name" stroke={chartText} fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px'}} />
                                    <Bar dataKey="toneladas" fill="#3B82F6" radius={[6, 6, 0, 0]}>
                                        <LabelList dataKey="toneladas" position="top" fill={labelColor} fontSize={10} fontWeight="bold" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-white/5' : 'bg-white shadow-sm'}`}>
                        <h3 className="text-xs font-black uppercase opacity-40 mb-8 tracking-widest text-center italic">Infracciones por Ruta</h3>
                        <div className="h-72">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={data.heatMapData} innerRadius={60} outerRadius={85} dataKey="value" stroke="none" label={({name, value}) => `${value}`}>
                                        {data.heatMapData.map((e, i) => <Cell key={i} fill={['#EF4444', '#F59E0B', '#3B82F6'][i % 3]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* SEGUNDA FILA */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className={`p-8 rounded-3xl border ${darkMode ? 'bg-slate-900 border-white/5' : 'bg-white shadow-sm'}`}>
                        <h3 className="text-xs font-black uppercase opacity-40 mb-6 tracking-widest italic">Carga por Patente</h3>
                        <div className="h-72">
                            <ResponsiveContainer>
                                <BarChart data={data.vehicleData} margin={{ top: 20 }}>
                                    <XAxis dataKey="patente" stroke={chartText} fontSize={10} />
                                    <YAxis hide />
                                    <Tooltip />
                                    <Bar dataKey="carga" fill="#10B981" radius={[5, 5, 0, 0]}>
                                        <LabelList dataKey="carga" position="top" fill={labelColor} fontSize={10} fontWeight="bold" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className={`p-8 rounded-3xl border ${darkMode ? 'bg-slate-900 border-white/5' : 'bg-white shadow-sm'}`}>
                        <h3 className="text-xs font-black uppercase opacity-40 mb-6 tracking-widest italic">Incidentes Logísticos</h3>
                        <div className="h-72">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={data.incidentData} innerRadius={60} outerRadius={85} dataKey="value" stroke="none" label={({name, value}) => `${value}`}>
                                        {data.incidentData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function KPI({ color, icon, label, data, darkMode, sub }) {
    const colors = { purple: 'text-purple-500 bg-purple-500/10', blue: 'text-blue-500 bg-blue-500/10', green: 'text-green-500 bg-green-500/10', red: 'text-red-500 bg-red-500/10', orange: 'text-orange-500 bg-orange-500/10' };
    return (
        <div className={`p-6 rounded-3xl border flex flex-col gap-2 transition-transform hover:scale-[1.02] ${darkMode ? 'bg-slate-900 border-white/5 shadow-2xl' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colors[color]}`}>{icon}</div>
                {data.trend !== undefined && data.trend !== 0 && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${data.trend > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {data.trend > 0 ? '▲' : '▼'} {Math.abs(data.trend)}%
                    </span>
                )}
            </div>
            <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">{label}</p>
            <p className="text-2xl font-black">{data.val || 0}</p>
            {sub && <p className="text-[8px] font-bold opacity-30 uppercase">{sub}</p>}
        </div>
    );
}