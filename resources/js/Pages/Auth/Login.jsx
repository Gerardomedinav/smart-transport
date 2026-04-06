import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo';
import WelcomeNavbar from '@/Components/WelcomeNavbar';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="relative min-h-screen flex flex-col font-sans selection:bg-blue-500">
            <Head title="Acceso al Sistema - Smart Transport" />

            {/* 🧭 NAVBAR (Translúcido igual que en Welcome) */}
            <div className="fixed top-0 left-0 w-full z-[100] bg-slate-950/40 backdrop-blur-md border-b border-white/5">
                <WelcomeNavbar auth={{ user: null }} />
            </div>

            {/* 🎥 VIDEO DE FONDO CON OVERLAY */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover opacity-50 scale-110 blur-[2px]"
                >
                    <source src="/build/assets/video/truck.mp4" type="video/mp4" />
                </video>
                {/* Capa de degradado para profundidad */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/70 to-slate-950"></div>
            </div>

            {/* 🧊 FORMULARIO TIPO VIDRIO (Glassmorphism) */}
            <div className="flex-1 flex items-center justify-center relative z-10 px-6 pt-24 pb-12">
                <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-10">
                    
                    {/* Header Interno */}
                    <div className="flex flex-col items-center mb-8">
                        <ApplicationLogo className="w-32 h-16 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] mb-4" />
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter drop-shadow-md">
                            Smart<span className="text-blue-500">Transport</span>
                        </h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Terminal de Control</p>
                    </div>

                    {status && <div className="mb-4 font-bold text-sm text-green-400 text-center">{status}</div>}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="email" value="Correo Institucional" className="text-white font-black text-[11px] uppercase tracking-widest ml-1 mb-2 opacity-70" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full bg-slate-950/50 border-white/10 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-2xl py-4 shadow-inner text-sm"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="ejemplo@smart-transport.com"
                            />
                            <InputError message={errors.email} className="mt-2 text-red-400 font-bold text-xs" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Clave de Acceso" className="text-white font-black text-[11px] uppercase tracking-widest ml-1 mb-2 opacity-70" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full bg-slate-950/50 border-white/10 text-white focus:border-blue-500 focus:ring-blue-500/20 rounded-2xl py-4 shadow-inner text-sm"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                            <InputError message={errors.password} className="mt-2 text-red-400 font-bold text-xs" />
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center cursor-pointer group">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded-lg border-white/20 bg-slate-950/50 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ms-3 text-[11px] font-black uppercase text-slate-400 group-hover:text-blue-400 transition-colors tracking-widest">Persistir</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-[11px] text-blue-400 hover:text-white font-black transition-colors uppercase tracking-widest"
                                >
                                    ¿Olvidó la clave?
                                </Link>
                            )}
                        </div>

                        <div className="pt-4">
                            <PrimaryButton 
                                className="w-full justify-center py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-2xl transition-all shadow-[0_15px_30px_rgba(37,99,235,0.3)] border-2 border-blue-400/20 uppercase tracking-[0.2em]" 
                                disabled={processing}
                            >
                                Iniciar Operación
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>

            {/* 🏁 FOOTER CON PERFIL PROFESIONAL */}
            <footer className="relative z-10 bg-slate-950/90 border-t border-white/5 py-8 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-12 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 tracking-widest uppercase text-[10px] font-black text-center md:text-left drop-shadow-sm">
                        © 2026 Smart Transport | Formosa, Argentina
                    </p>
                    <a 
                        href="https://www.linkedin.com/in/gerardomedinav/" 
                        target="_blank" 
                        className="text-slate-300 hover:text-blue-400 transition-colors text-[10px] font-black uppercase tracking-[0.15em] border-b border-transparent hover:border-blue-400 pb-0.5"
                    >
                        Gerardo Medina - Técnico Analista y Programador
                    </a>
                </div>
            </footer>
        </div>
    );
}