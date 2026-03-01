import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-slate-900 overflow-hidden font-sans">
            {/* SIDEBAR LATERAL */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 border-r border-white/10 transition-transform duration-300 transform 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo y Nombre */}
                    <div className="p-6 flex flex-col items-center border-b border-white/5">
                        <Link href="/">
                            <ApplicationLogo className="w-32 h-16 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.3)]" />
                        </Link>
                        <span className="mt-2 text-xl font-black text-white tracking-tighter">Smart Transport</span>
                    </div>

                    {/* Navegación del Menú */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        <NavLink href={route('dashboard')} active={route().current('dashboard')} className="w-full flex items-center p-3 text-gray-300 hover:bg-blue-600/20 hover:text-white rounded-xl transition-all group">
                            <span className="font-bold">Panel de Control</span>
                        </NavLink>
                        
                        {/* Aquí irán las futuras secciones de Smart Transport */}
                        <div className="pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-widest px-3">
                            Gestión de Flota
                        </div>
                        <button className="w-full flex items-center p-3 text-gray-400 hover:bg-slate-700 rounded-xl transition-all">
                            Vehículos en Vivo
                        </button>
                        <button className="w-full flex items-center p-3 text-gray-400 hover:bg-slate-700 rounded-xl transition-all">
                            Historial de Rutas
                        </button>
                    </nav>

                    {/* Perfil del Usuario en la base */}
                    <div className="p-4 border-t border-white/5 bg-slate-900/50">
                        <div className="flex items-center gap-3 px-2 py-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-slate-900">
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                        </div>
                        <Link 
                            method="post" 
                            href={route('logout')} 
                            as="button" 
                            className="w-full mt-2 py-2 text-xs font-bold text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                            Cerrar Sesión
                        </Link>
                    </div>
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header Superior (Breadcrumbs o Título) */}
                {header && (
                    <header className="bg-slate-800/50 border-b border-white/10 backdrop-blur-md h-16 flex items-center px-8 shadow-sm relative z-40">
                        <div className="text-xl font-bold text-white uppercase tracking-wider">{header}</div>
                    </header>
                )}

                {/* Área de Trabajo (Donde irá el Mapa) */}
                <main className="flex-1 overflow-y-auto relative p-0">
                    <div className="h-full w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}