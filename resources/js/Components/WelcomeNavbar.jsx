import { Link } from '@inertiajs/react';

export default function WelcomeNavbar({ auth }) {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/40 backdrop-blur-md transition-all duration-500">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                
                {/* LOGO */}
                <div className="flex items-center gap-3">
                    <div className="p-1">
                        <svg fill="#60a5fa" height="40px" width="40px" viewBox="0 0 32 32" className="drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
                            <path d="M32,18.9l-0.8-6.2c-0.2-1.5-1.5-2.6-3-2.6H1c-0.6,0-1,0.4-1,1v13c0,0.6,0.4,1,1,1h3.2c0.4,1.2,1.5,2,2.8,2 c1,0,2-0.5,2.5-1.3C10,26.5,11,27,12,27c1.3,0,2.4-0.8,2.8-2h7.4c0.4,1.2,1.5,2,2.8,2s2.4-0.8,2.8-2H31c0.6,0,1-0.4,1-1v-5 C32,19,32,18.9,32,18.9z M28.2,12c0.5,0,0.9,0.4,1,0.9l0.6,5.1h-1c-1.6,0-3-0.6-4.1-1.7C24.5,16.1,24.3,16,24,16H2v-4H28.2z M7,25 c-0.6,0-1-0.4-1-1c0,0,0,0,0,0s0,0,0,0c0-0.6,0.4-1,1-1c0.6,0,1,0.4,1,1S7.6,25,7,25z M12,25c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1 S12.6,25,12,25z M25,25c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S25.6,25,25,25z"></path>
                        </svg>
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white uppercase drop-shadow-md">
                        Smart<span className="text-blue-500">Transport</span>
                    </span>
                </div>

                {/* BOTÓN DE ACCESO */}
                <div className="flex items-center">
                    {auth.user ? (
                        <Link 
                            href={route('dashboard')} 
                            className="text-[11px] font-black uppercase tracking-widest text-blue-400 hover:text-white border border-blue-500/30 px-6 py-2.5 rounded-full transition-all bg-blue-500/10 backdrop-blur-sm"
                        >
                            Ir al Panel
                        </Link>
                    ) : (
                        <Link 
                            href={route('login')} 
                            className="text-[11px] font-black uppercase tracking-widest text-white hover:bg-blue-600 border border-white/20 px-8 py-2.5 rounded-full transition-all bg-white/5 backdrop-blur-sm shadow-xl"
                        >
                            Ingresar al Sistema
                        </Link>
                    )}
                </div>

            </div>
        </nav>
    );
}