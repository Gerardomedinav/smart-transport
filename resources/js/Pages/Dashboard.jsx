import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TrackingMap from '@/Components/TrackingMap';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    const [darkMode, setDarkMode] = useState(true);

    return (
        <AuthenticatedLayout user={auth.user} header="Monitoreo" darkMode={darkMode}>
            <Head title="Terminal" />

            {/* Contenedor principal sin scroll, ocupando justo el espacio debajo del navbar */}
            <div className={`p-2 lg:p-4 h-[calc(100vh-64px)] flex flex-col transition-all duration-500 overflow-hidden ${darkMode ? 'bg-slate-950' : 'bg-gray-100'}`}>
                
                {/* Cabecera ultra compacta */}
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-baseline gap-3">
                        <h1 className={`text-lg lg:text-xl font-black tracking-tighter uppercase ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            Terminal Global
                        </h1>
                        <p className={`text-[10px] font-bold tracking-widest uppercase hidden sm:block ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            Smart Transport - Formosa
                        </p>
                    </div>
                    
                    {/* Botón Modo Oscuro reducido */}
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-black text-[9px] tracking-widest transition-all border shadow-sm active:scale-95
                        ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-gray-200 text-slate-900 hover:bg-gray-50'}`}
                    >
                        <span>{darkMode ? '☀️ CLARO' : '🌙 OSCURO'}</span>
                    </button>
                </div>

                {/* 🚀 EL MAPA SE EXPANDE AL 100% DEL ESPACIO RESTANTE CON BORDES FINOS */}
                <div className={`flex-1 w-full rounded-xl overflow-hidden shadow-lg border-2 transition-all duration-500
                    ${darkMode ? 'border-white/10 bg-slate-900' : 'border-gray-300 bg-white'}`}>
                    
                    <TrackingMap /> 

                </div>
            </div>
        </AuthenticatedLayout>
    );
}