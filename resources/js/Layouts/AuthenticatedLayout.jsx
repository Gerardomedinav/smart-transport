import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Authenticated({ user, header, children, darkMode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const getLinkClass = (routeName) => {
        const active = route().current(routeName);
        const base = "flex items-center gap-3 px-4 py-3 rounded-xl font-black tracking-wide transition-all duration-200 w-full ";
        if (active) return base + "bg-blue-600 text-white shadow-lg border border-blue-500";
        return base + (darkMode 
            ? "text-slate-400 hover:bg-slate-800 hover:text-white" 
            : "text-slate-600 hover:bg-gray-200 hover:text-slate-900");
    };

    return (
        <div className={`flex h-screen overflow-hidden font-sans relative transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-white' : 'bg-gray-100 text-slate-900'}`}>
            
            {/* 🌑 OVERLAY MÓVIL (Z-index 9998) */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[9998] lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* 📋 SIDEBAR ADAPTATIVO (Z-index 9999: Al frente de todo) */}
            <aside className={`fixed inset-y-0 left-0 z-[9999] w-72 border-r transition-all duration-500 ease-in-out transform ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} lg:relative lg:translate-x-0 ${darkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-gray-200'}`}>
                <div className="flex flex-col h-full">
                    
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-white text-xl">✕</button>

                    <div className="p-10 flex flex-col items-center">
                        <Link href="/">
                            <ApplicationLogo className={`w-32 h-16 transition-colors ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        </Link>
                        <h2 className={`mt-4 text-xl font-black tracking-tighter uppercase ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                            Smart Transport
                        </h2>
                    </div>

                    <nav className="flex-1 px-6 space-y-2 mt-4">
                        <Link href={route('dashboard')} onClick={() => setIsSidebarOpen(false)} className={getLinkClass('dashboard')}>
                            <span className="text-lg">📍</span> <span>Mapa en Vivo</span>
                        </Link>
                        
                        <Link href={route('chat.index')} onClick={() => setIsSidebarOpen(false)} className={getLinkClass('chat.index')}>
                            <span className="text-lg">💬</span> <span>Mensajería</span>
                        </Link>

                        {user?.role === 'operario' && (
                            <>
                                <Link href={route('analytics')} onClick={() => setIsSidebarOpen(false)} className={getLinkClass('analytics')}>
                                    <span className="text-lg">📊</span> <span>Estadísticas</span>
                                </Link>
                                <Link href={route('usuarios.index')} onClick={() => setIsSidebarOpen(false)} className={getLinkClass('usuarios.*')}>
                                    <span className="text-lg">👥</span> <span>Gestión Personal</span>
                                </Link>
                            </>
                        )}
                        
                        <div className={`my-4 border-t ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}></div>

                        <Link href={route('profile.edit')} onClick={() => setIsSidebarOpen(false)} className={getLinkClass('profile.edit')}>
                            <span className="text-lg">👤</span> <span>Mi Perfil</span>
                        </Link>
                    </nav>

                    <div className={`p-6 border-t ${darkMode ? 'bg-slate-950/50 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className={`text-sm font-black truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{user?.name}</p>
                                <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest">{user?.role}</p> 
                            </div>
                        </div>
                        <Link method="post" href={route('logout')} as="button" className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white">
                            Finalizar Sesión
                        </Link>
                    </div>
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <header className={`h-20 flex items-center px-6 lg:px-10 border-b z-30 ${darkMode ? 'bg-slate-900/50 border-white/5 backdrop-blur-md' : 'bg-white border-gray-200'}`}>
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className={`lg:hidden p-2 rounded-lg mr-4 ${darkMode ? 'bg-slate-800 text-blue-400' : 'bg-gray-100 text-blue-600'}`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    <div className={`text-xs md:text-sm font-black uppercase tracking-[0.3em] truncate ${darkMode ? 'text-blue-400' : 'text-slate-600'}`}>
                        {header}
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}