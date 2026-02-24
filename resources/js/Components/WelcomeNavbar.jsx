import { Link } from '@inertiajs/react';

export default function WelcomeNavbar({ darkMode, toggleDarkMode, auth, isLoading }) {
    return (
        <nav className={`fixed top-0 w-full z-50 border-b transition-colors duration-500 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-100'} backdrop-blur-md`}>
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {!isLoading && (
                    <div className="flex items-center gap-3 animate-bus">
                        <div className="p-1 rounded-lg">
                            <svg fill={darkMode ? "#60a5fa" : "#190075"} height="45px" width="45px" viewBox="0 0 32 32">
                                <path d="M32,18.9l-0.8-6.2c-0.2-1.5-1.5-2.6-3-2.6H1c-0.6,0-1,0.4-1,1v13c0,0.6,0.4,1,1,1h3.2c0.4,1.2,1.5,2,2.8,2 c1,0,2-0.5,2.5-1.3C10,26.5,11,27,12,27c1.3,0,2.4-0.8,2.8-2h7.4c0.4,1.2,1.5,2,2.8,2s2.4-0.8,2.8-2H31c0.6,0,1-0.4,1-1v-5 C32,19,32,18.9,32,18.9z M28.2,12c0.5,0,0.9,0.4,1,0.9l0.6,5.1h-1c-1.6,0-3-0.6-4.1-1.7C24.5,16.1,24.3,16,24,16H2v-4H28.2z M7,25 c-0.6,0-1-0.4-1-1c0,0,0,0,0,0s0,0,0,0c0-0.6,0.4-1,1-1c0.6,0,1,0.4,1,1S7.6,25,7,25z M12,25c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1 S12.6,25,12,25z M25,25c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S25.6,25,25,25z"></path>
                            </svg>
                        </div>
                        <span className={`text-xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-blue-900'}`}>SmartTransport</span>
                    </div>
                )}

                <div className="flex items-center gap-6">
                    <button onClick={toggleDarkMode} className={`p-2 rounded-xl transition-all duration-300 ${darkMode ? 'bg-slate-800 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                    <div className="flex gap-4">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Panel</Link>
                        ) : (
                            <>
                                <Link href={route('login')} className={`text-sm font-semibold transition-colors ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Ingresar</Link>
                                <Link href={route('register')} className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition shadow-lg">Comenzar</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}