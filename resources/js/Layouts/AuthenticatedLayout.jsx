import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Authenticated({ user, header, children, darkMode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={`flex h-screen overflow-hidden font-sans relative transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-white' : 'bg-gray-100 text-slate-900'}`}>
            
            {/* SIDEBAR ADAPTATIVO */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-72 border-r transition-all duration-500 ease-in-out transform 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 
                ${darkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-gray-200'}`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-10 flex flex-col items-center">
                        <Link href="/">
                            <ApplicationLogo className={`w-32 h-16 transition-colors ${darkMode ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'text-blue-600'}`} />
                        </Link>
                        <h2 className={`mt-4 text-xl font-black tracking-tighter uppercase transition-colors ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                            Smart Transport
                        </h2>
                    </div>

                    {/* 🚀 NAVEGACIÓN COMO BOTONES VERTICALES SEGÚN ROL */}
                    <nav className="flex-1 px-6 space-y-3 mt-4 flex flex-col">
                        
                        {/* MAPA EN VIVO: Visible para ambos */}
                        <Link 
                            href={route('dashboard')} 
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-black tracking-wide transition-all duration-200 w-full
                                ${route().current('dashboard') 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-500' 
                                    : (darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent' : 'text-slate-600 hover:bg-gray-200 hover:text-slate-900 border border-transparent')
                                }`}
                        >
                            <span className="text-lg drop-shadow-sm">📍</span>
                            <span>{user?.role === 'conductor' ? 'Mi Vehículo' : 'Mapa en Vivo'}</span>
                        </Link>
                        
                        {/* ESTADÍSTICAS: Solo para Operarios */}
                        {user?.role === 'operario' && (
                            <Link 
                                href={route('analytics')} 
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-black tracking-wide transition-all duration-200 w-full
                                    ${route().current('analytics') 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-500' 
                                        : (darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent' : 'text-slate-600 hover:bg-gray-200 hover:text-slate-900 border border-transparent')
                                    }`}
                            >
                                <span className="text-lg drop-shadow-sm">📊</span>
                                <span>Estadísticas</span>
                            </Link>
                        )}
                        
                        {/* GESTIÓN DE PERSONAL: Preparado para el futuro (Solo Operarios) */}
                        {user?.role === 'operario' && (
                            <Link 
                                href="#" // Reemplazar con route('personal.index') cuando se cree
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-black tracking-wide transition-all duration-200 w-full
                                    ${darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent' : 'text-slate-600 hover:bg-gray-200 hover:text-slate-900 border border-transparent'}`}
                            >
                                <span className="text-lg drop-shadow-sm">👥</span>
                                <span>Gestión Personal</span>
                            </Link>
                        )}
                        
                        {/* Separador visual opcional */}
                        <div className={`my-2 mx-2 border-t ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}></div>

                        {/* MI PERFIL: Visible para ambos */}
                        <Link 
                            href={route('profile.edit')} 
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-black tracking-wide transition-all duration-200 w-full
                                ${route().current('profile.edit') 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-500' 
                                    : (darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent' : 'text-slate-600 hover:bg-gray-200 hover:text-slate-900 border border-transparent')
                                }`}
                        >
                            <span className="text-lg drop-shadow-sm">👤</span>
                            <span>Mi Perfil</span>
                        </Link>

                    </nav>

                    {/* Footer Perfil */}
                    <div className={`p-6 border-t transition-colors ${darkMode ? 'bg-slate-950/50 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 overflow-hidden text-left">
                                <p className={`text-sm font-black truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{user?.name}</p>
                                {/* 🚀 MOSTRAMOS EL ROL DEL USUARIO */}
                                <p className="text-[9px] text-blue-500 font-black truncate uppercase tracking-widest">{user?.role}</p> 
                            </div>
                        </div>
                        <Link 
                            method="post" href={route('logout')} as="button" 
                            className={`w-full py-4 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest border
                            ${darkMode ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-white border-red-200 text-red-600 hover:bg-red-600 hover:text-white shadow-sm'}`}
                        >
                            Finalizar Sesión
                        </Link>
                    </div>
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {header && (
                    <header className={`h-20 flex items-center px-10 border-b transition-colors z-30 ${darkMode ? 'bg-slate-900/50 border-white/5 backdrop-blur-md' : 'bg-white border-gray-200'}`}>
                        <div className={`text-sm font-black uppercase tracking-[0.4em] ${darkMode ? 'text-blue-400' : 'text-slate-600'}`}>{header}</div>
                    </header>
                )}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}