import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import WelcomeLoader from '@/Components/WelcomeLoader';
import WelcomeNavbar from '@/Components/WelcomeNavbar';

export default function Welcome({ auth }) {
    const [isLoading, setIsLoading] = useState(true);
    const canvasRef = useRef(null);
    const imagesRef = useRef([]);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const loadScripts = async () => {
            const scripts = [
                "https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js",
                "https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js",
                "https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"
            ];

            for (const src of scripts) {
                if (!document.querySelector(`script[src="${src}"]`)) {
                    await new Promise((resolve) => {
                        const script = document.createElement("script");
                        script.src = src;
                        script.async = true;
                        script.onload = resolve;
                        document.body.appendChild(script);
                    });
                }
            }
            initExperience();
        };

        const initExperience = () => {
            const gsap = window.gsap;
            const ScrollTrigger = window.ScrollTrigger;
            const Lenis = window.Lenis;
            gsap.registerPlugin(ScrollTrigger);

            const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
            function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
            requestAnimationFrame(raf);

            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const totalFrames = 180;
            const scrollObj = { frame: 0 };

            const render = (index) => {
                const img = imagesRef.current[Math.floor(index)];
                if (!img) return;
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height) * 0.9;
                const sw = img.width * scale;
                const sh = img.height * scale;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, (canvas.width - sw) / 2, (canvas.height - sh) / 2, sw, sh);
            };

            for (let i = 1; i <= totalFrames; i++) {
                const img = new Image();
                img.src = `/assets/frames/frame_${i.toString().padStart(4, '0')}.webp`;
                img.onload = () => { if (i === 1) render(0); };
                imagesRef.current.push(img);
            }

            gsap.to(scrollObj, {
                frame: totalFrames - 1,
                ease: "none",
                scrollTrigger: {
                    trigger: "#scroll-container",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.5,
                    onUpdate: () => render(scrollObj.frame)
                }
            });

            gsap.to("#hero-fixed-content", {
                opacity: 0,
                scale: 0.8,
                y: -100,
                scrollTrigger: {
                    trigger: "#scroll-container",
                    start: "top top",
                    end: "10% top",
                    scrub: true,
                }
            });

            gsap.utils.toArray(".scroll-section").forEach((section) => {
                gsap.from(section.querySelector(".section-inner"), {
                    opacity: 0,
                    x: -50,
                    duration: 1.2,
                    scrollTrigger: {
                        trigger: section,
                        start: "top 70%",
                        toggleActions: "play reverse play reverse"
                    }
                });
            });
        };

        loadScripts();
    }, [isLoading]);

    return (
        <>
            <Head title="Smart Transport | Soluciones Logísticas de Vanguardia" />
            
            {isLoading && <WelcomeLoader />}

            <div className="bg-[#020617] text-white selection:bg-blue-500 overflow-x-hidden">
                
                {/* 🧭 NAVBAR TRANSLÚCIDO (Estilo Vidrio) */}
                <div className="fixed top-0 left-0 w-full z-[100] bg-slate-950/40 backdrop-blur-md border-b border-white/5">
                    <WelcomeNavbar auth={auth} />
                </div>

                {/* Camión de fondo */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <canvas ref={canvasRef} id="truck-canvas" className="opacity-60" />
                </div>

                {/* 🟢 WHATSAPP SOPORTE */}
                <a 
                    href="https://wa.me/5493704857048" 
                    target="_blank" 
                    className="fixed bottom-8 right-8 z-[300] flex items-center gap-3 bg-green-500 hover:bg-green-600 p-4 rounded-3xl shadow-[0_15px_40px_rgba(34,197,94,0.6)] transition-all active:scale-95 border-2 border-white/20"
                >
                    <div className="absolute inset-0 bg-green-500 rounded-3xl animate-ping opacity-25"></div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                       
                    </span>
                    <svg className="w-8 h-8 fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.222-4.032c1.503.893 3.129 1.364 4.791 1.365 5.013 0 9.088-4.075 9.091-9.088.002-2.428-.943-4.711-2.662-6.43s-4.002-2.664-6.43-2.664c-5.013 0-9.086 4.075-9.089 9.088-.001 1.735.499 3.426 1.446 4.888l-1.048 3.827 3.922-1.029z"/>
                    </svg>
                </a>

                {/* Hero inicial */}
                <div id="hero-fixed-content" className="fixed inset-0 z-10 flex items-center px-12 pointer-events-none">
                    <div className="max-w-7xl">
                        <span className="text-blue-500 font-black tracking-[0.6em] uppercase text-sm mb-4 block drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">Formosa · Argentina</span>
                        <h1 className="text-[10rem] font-black leading-[0.8] tracking-tighter mb-6 drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)]">
                            SMART<br/><span className="text-blue-600 drop-shadow-[0_0_30px_rgba(37,99,235,0.5)]">TRUCK</span>
                        </h1>
                        <p className="text-xl text-slate-200 font-bold tracking-wide max-w-lg drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
                            Ingeniería aplicada a la gestión de flotas.
                        </p>
                    </div>
                </div>

                <main id="scroll-container" className="relative z-20 min-h-[1000vh] bg-transparent">
                    <div className="h-[120vh]"></div>

                    {/* SECCIONES DE FUNCIONALIDADES */}
                    <section className="scroll-section h-screen flex items-center px-24 relative">
                        <div className="section-inner max-w-2xl bg-slate-950/60 p-10 rounded-3xl border-2 border-white/10 backdrop-blur-2xl shadow-2xl">
                            <span className="text-blue-500 font-black tracking-widest block mb-4 uppercase drop-shadow-md">01 / Rastreo Satelital</span>
                            <h2 className="text-7xl font-black mb-6 drop-shadow-lg text-white">Mapa en Vivo</h2>
                            <p className="text-slate-100 text-lg leading-relaxed drop-shadow-md font-medium">
                                Visualización en tiempo real de cada unidad con telemetría integrada.
                                <span className="block mt-4 text-blue-400 font-black italic">Geocercas activas y alertas de desvío de ruta.</span>
                            </p>
                        </div>
                    </section>

                    <section className="scroll-section h-screen flex items-center justify-end px-24">
                        <div className="section-inner max-w-2xl bg-slate-950/60 p-10 rounded-3xl border-2 border-white/10 backdrop-blur-2xl shadow-2xl">
                            <span className="text-blue-500 font-black tracking-widest block mb-4 uppercase drop-shadow-md">02 / Business Intelligence</span>
                            <h2 className="text-7xl font-black mb-6 drop-shadow-lg text-white">Analytics Pro</h2>
                            <p className="text-slate-100 text-lg leading-relaxed drop-shadow-md font-medium">
                                Transforme datos masivos en decisiones de alta rentabilidad.
                                <span className="block mt-4 text-blue-400 font-black italic">Análisis comparativo de eficiencia y mapas de calor.</span>
                            </p>
                        </div>
                    </section>

                    {/* 👤 SECCIÓN: ¿QUIÉNES SOMOS? (GERARDO MEDINA) */}
                    <section className="scroll-section h-screen flex items-center px-24">
                        <div className="section-inner max-w-3xl bg-slate-950/60 p-10 rounded-3xl border-2 border-blue-500/20 backdrop-blur-2xl shadow-2xl">
                            <span className="text-blue-500 font-black tracking-widest block mb-4 uppercase drop-shadow-md">03 / El Desarrollador</span>
                            <h2 className="text-6xl font-black mb-6 drop-shadow-xl text-white">Ingeniería Local</h2>
                            <p className="text-slate-100 text-xl leading-relaxed drop-shadow-md font-medium mb-4">
                                Smart Transport es un ecosistema diseñado y desarrollado por <span className="text-blue-400 font-black">Gerardo Medina Villalba</span>.
                            </p>
                            <p className="text-slate-300 text-lg leading-relaxed drop-shadow-md">
                                Técnico Universitario en Programación (UTN) y Analista de Sistemas (UNAF), Gerardo combina su experiencia como Backend Developer con analítica de datos para ofrecer soluciones robustas que potencian la logística en Formosa.
                            </p>
                        </div>
                    </section>

                    {/* 🚀 CTA FINAL: MÁS COMPACTO Y PEGADO AL FOOTER */}
                    <div className="h-[50vh] flex flex-col items-center justify-center relative px-6">
                        <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-sm"></div>
                        <div className="z-10 text-center flex flex-col items-center">
                            <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,1)] uppercase">Potencie su Flota Hoy</h2>
                            
                            <Link href={route('login')} className="w-fit group relative bg-blue-600 px-12 py-6 rounded-full text-2xl font-black hover:bg-blue-500 transition-all shadow-[0_25px_60px_rgba(37,99,235,0.6)] flex items-center gap-6 border-2 border-blue-400/50">
                                <span className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] uppercase">Iniciar Operación</span>
                                <span className="group-hover:translate-x-3 transition-transform drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">→</span>
                            </Link>
                        </div>
                    </div>
                </main>

                {/* FOOTER CON LINKEDIN */}
                <footer className="relative z-30 bg-slate-950 border-t border-white/5 py-10 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-12 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <p className="text-slate-500 tracking-widest uppercase text-[10px] font-black drop-shadow-sm mb-1">
                                © 2026 Smart Transport | Formosa, Argentina
                            </p>
                            <a 
                                href="https://www.linkedin.com/in/gerardomedinav/" 
                                target="_blank" 
                                className="text-slate-300 hover:text-blue-400 transition-colors text-[11px] font-bold uppercase tracking-wider"
                            >
                                Gerardo Medina - Técnico Analista y Programador
                            </a>
                        </div>
                        <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                            Software de Precisión Logística
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}