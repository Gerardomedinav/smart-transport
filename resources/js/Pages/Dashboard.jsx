import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TrackingMap from '@/Components/TrackingMap';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    const [darkMode, setDarkMode] = useState(true);

    return (
        <AuthenticatedLayout user={auth.user} header="Monitoreo de Flota" darkMode={darkMode}>
            <Head title="Panel de Control" />

            <div className={`p-4 lg:p-8 min-h-full transition-all duration-500 ${darkMode ? 'bg-slate-950' : 'bg-gray-100'}`}>
                
                {/* Header Superior y Botón de Modo */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className={`text-3xl font-black tracking-tighter uppercase ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            Terminal de Control
                        </h1>
                        <p className={`text-xs font-bold tracking-widest uppercase ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            Smart Transport - Formosa
                        </p>
                    </div>
                    
                    {/* BOTÓN MODO (Unificado, sin amarillo estridente) */}
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className={`group flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all border shadow-lg active:scale-95
                        ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-gray-200 text-slate-900 hover:bg-gray-50'}`}
                    >
                        <span>{darkMode ? '☀️ MODO CLARO' : '🌙 MODO OSCURO'}</span>
                    </button>
                </div>

                {/* Grid Operativo */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:min-h-[700px]">
                    
                    {/* MAPA (Borde reactivo al modo) */}
                    <div className={`lg:col-span-3 h-[450px] lg:h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 transition-all duration-500
                        ${darkMode ? 'border-white/5 bg-slate-900' : 'border-white bg-white'}`}>
                        <TrackingMap />
                    </div>

                    {/* ESTADÍSTICAS (Colores suavizados) */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        
                        {/* Señal Reverb */}
                        <div className={`p-8 rounded-[2rem] border transition-all duration-500 shadow-xl ${darkMode ? 'bg-blue-600/10 border-blue-500/20 text-white' : 'bg-white border-blue-100 text-slate-900'}`}>
                            <span className={`font-black text-[10px] uppercase tracking-widest italic ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                Signal
                            </span>
                            <div className="flex items-center mt-3 gap-3 text-left justify-start">
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                <p className="text-2xl font-black italic uppercase tracking-tighter">En Línea</p>
                            </div>
                        </div>

                        {/* Unidades */}
                        <div className={`p-8 rounded-[2rem] border transition-all duration-500 shadow-xl ${darkMode ? 'bg-slate-900 border-white/5 text-white' : 'bg-white border-gray-200 text-slate-900'}`}>
                            <span className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Activos</span>
                            <p className={`text-6xl font-black italic mt-2 text-left ${darkMode ? 'text-blue-500' : 'text-blue-600'}`}>01</p>
                        </div>

                        {/* Botón Reporte */}
                        <button className={`mt-auto p-6 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl border
                            ${darkMode ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500' : 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800'}`}>
                            Descargar Reporte
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}