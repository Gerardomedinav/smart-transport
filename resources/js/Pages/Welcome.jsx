import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import WelcomeLoader from '@/Components/WelcomeLoader';
import WelcomeNavbar from '@/Components/WelcomeNavbar';

export default function Welcome({ auth }) {
    const [darkMode, setDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Sincronización del tema visual
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Control del estado de carga inicial
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    return (
        <>
            <Head title="Smart Transport - Control de Flotas" />
            
            {/* Definición global de animaciones core */}
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

            {/* Componente 1: Pantalla de carga independiente */}
            {isLoading && <WelcomeLoader darkMode={darkMode} />}

            <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} font-sans ${isLoading ? 'overflow-hidden' : ''}`}>
                
                {/* Componente 2: Barra de navegación refactorizada */}
                <WelcomeNavbar 
                    darkMode={darkMode} 
                    toggleDarkMode={toggleDarkMode} 
                    auth={auth} 
                    isLoading={isLoading} 
                />

                {/* Hero Section principal */}
                <header className="relative min-h-[90vh] flex items-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <video 
                            autoPlay 
                            muted 
                            loop 
                            playsInline 
                            className={`w-full h-full object-cover transition-opacity duration-1000 ${darkMode ? 'opacity-30 grayscale' : 'opacity-50'}`}
                        >
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
                            <img 
                                src="/images/imagen1.jpg" 
                                alt="Gestión de Flotas" 
                                className={`relative rounded-3xl shadow-2xl border-8 transition-colors duration-500 ${darkMode ? 'border-slate-800' : 'border-white'} object-cover h-[500px] w-full`} 
                            />
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