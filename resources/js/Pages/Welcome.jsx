import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome({ auth }) {
    const [darkMode, setDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Estado para el Loader

    useEffect(() => {
        // Manejo de Modo Nocturno
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Simulación de carga de componentes y recursos
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500); // 2.5 segundos para apreciar la animación

        return () => clearTimeout(timer);
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    return (
        <>
            <Head title="Smart Transport - Control de Flotas" />
            
            <style>
                {`
                    @keyframes bus-entry {
                        0% { transform: translateX(-150vw); opacity: 0; }
                        60% { transform: translateX(20px); opacity: 1; }
                        100% { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes pulse-soft {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.8; transform: scale(1.05); }
                    }
                    .animate-bus { animation: bus-entry 1.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                    .animate-pulse-logo { animation: pulse-soft 2s infinite ease-in-out; }
                `}
            </style>

            {/* Pantalla de Carga (Loader) con Círculo Giratorio */}
            {isLoading && (
                <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-colors duration-500 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
                    <div className="relative flex items-center justify-center mb-8">
                        {/* Círculo Giratorio de Carga */}
                        <div className={`absolute w-32 h-32 border-4 border-t-blue-600 border-r-transparent border-b-blue-600 border-l-transparent rounded-full animate-spin`}></div>
                        
                        {/* Logo Central Pulsante */}
                        <div className="animate-pulse-logo relative z-10">
                            <svg fill={darkMode ? "#60a5fa" : "#190075"} height="80px" width="80px" viewBox="0 0 32 32">
                                <path d="M32,18.9l-0.8-6.2c-0.2-1.5-1.5-2.6-3-2.6H1c-0.6,0-1,0.4-1,1v13c0,0.6,0.4,1,1,1h3.2c0.4,1.2,1.5,2,2.8,2 c1,0,2-0.5,2.5-1.3C10,26.5,11,27,12,27c1.3,0,2.4-0.8,2.8-2h7.4c0.4,1.2,1.5,2,2.8,2s2.4-0.8,2.8-2H31c0.6,0,1-0.4,1-1v-5 C32,19,32,18.9,32,18.9z M28.2,12c0.5,0,0.9,0.4,1,0.9l0.6,5.1h-1c-1.6,0-3-0.6-4.1-1.7C24.5,16.1,24.3,16,24,16H2v-4H28.2z M7,25 c-0.6,0-1-0.4-1-1c0,0,0,0,0,0s0,0,0,0c0-0.6,0.4-1,1-1c0.6,0,1,0.4,1,1S7.6,25,7,25z M12,25c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1 S12.6,25,12,25z M25,25c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S25.6,25,25,25z"></path>
                            </svg>
                        </div>
                    </div>
                    <p className={`text-sm font-bold tracking-widest uppercase animate-pulse ${darkMode ? 'text-blue-400' : 'text-blue-900'}`}>
                        Sincronizando Flota Smart...
                    </p>
                </div>
            )}

            <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} font-sans ${isLoading ? 'overflow-hidden' : ''}`}>
                
                {/* Navbar Moderna */}
                <nav className={`fixed top-0 w-full z-50 border-b transition-colors duration-500 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-100'} backdrop-blur-md`}>
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        
                        {/* Logo con Animación de Entrada de Colectivo (Lateral) */}
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
                                {darkMode ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707MA4 4 0 1112 8a4 4 0 018 0z" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                )}
                            </button>
                            <div className="flex gap-4">
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Panel</Link>
                                ) : (
                                    <>
                                        <Link href={route('login')} className={`text-sm font-semibold ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Ingresar</Link>
                                        <Link href={route('register')} className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition">Comenzar</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section con Video de Fondo */}
                <header className="relative min-h-[90vh] flex items-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <video autoPlay muted loop playsInline className={`w-full h-full object-cover transition-opacity duration-1000 ${darkMode ? 'opacity-30 grayscale' : 'opacity-50'}`}>
                            <source src="/images/formosa1.webm" type="video/webm" />
                        </video>
                        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent' : 'bg-gradient-to-r from-white via-white/60 to-transparent'}`}></div>
                    </div>
                    <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
                        <div className="text-left">
                            <span className={`inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider uppercase rounded-full ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                Logística 4.0 & Monitoreo
                            </span>
                            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-8">
                                Gestión de transporte <span className="text-blue-600">inteligente y dinámico.</span>
                            </h1>
                            <p className={`text-lg mb-10 max-w-lg leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Plataforma profesional de seguimiento satelital diseñada para visualizar su flota en tiempo real con tecnología de alta precisión.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href={route('register')} className={`px-8 py-4 rounded-xl font-bold transition shadow-lg ${darkMode ? 'bg-white text-slate-900 hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                                    Explorar Soluciones
                                </Link>
                                <button className={`px-8 py-4 border-2 rounded-xl font-bold transition ${darkMode ? 'border-slate-700 text-gray-300 hover:bg-slate-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                                    Ver Demo en Vivo
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className={`absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-50 ${darkMode ? 'bg-blue-900/40' : 'bg-blue-100'}`}></div>
                            <img src="/images/imagen1.jpg" alt="Gestión de Flotas" className={`relative rounded-3xl shadow-2xl border-8 transition-colors duration-500 ${darkMode ? 'border-slate-800' : 'border-white'} object-cover h-[500px] w-full`} />
                        </div>
                    </div>
                </header>

                {/* Sección de Beneficios */}
                <section className={`py-24 transition-colors duration-500 ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                    <div className="max-w-7xl mx-auto px-6 text-left">
                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                { title: "Rastreo Satelital", desc: "Localización precisa mediante integración directa con GPS y WebSockets.", color: "bg-blue-600", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
                                { title: "Análisis de Datos", desc: "Estructura optimizada en PostgreSQL para auditoría técnica impecable.", color: "bg-green-500", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2" },
                                { title: "Alta Disponibilidad", desc: "Arquitectura backend que garantiza el flujo constante de información.", color: "bg-purple-500", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }
                            ].map((item, idx) => (
                                <div key={idx} className={`p-8 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100'}`}>
                                    <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-6 text-white`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                        </svg>
                                    </div>
                                    <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer Profesional */}
                <footer className={`py-12 border-t transition-colors duration-500 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-left">
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-500">© 2026 Smart Transport</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-500">Diseñado por</span>
                            <a href="https://www.linkedin.com/in/gerardomedinav/" target="_blank" className="font-bold text-blue-600 hover:text-blue-800 transition-all">Gerardo Medina</a>
                        </div>
                        <div className="text-xs font-semibold tracking-widest uppercase text-gray-400">
                            Técnico Analista en Diseño de Software
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}