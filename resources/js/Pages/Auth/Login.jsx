import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo';
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
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 font-sans">
            {/* Fondo con Overlay Dinámico */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/images/imagen1.jpg" 
                    className="w-full h-full object-cover opacity-30 blur-sm"
                    alt="Terminal Formosa Background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-blue-900/70 to-slate-900/95"></div>
            </div>

            <Head title="Iniciar Sesión - Smart Transport" />

            <div className="relative z-10 w-full max-w-md px-6">
                {/* Tarjeta Glassmorphism Reforzada */}
                <div className="bg-white/25 backdrop-blur-3xl border border-white/30 rounded-3xl shadow-2xl p-10">
                    
                    {/* Header: Logo Animado y Nombre con Capas Corregidas */}
                    <div className="flex flex-col items-center mb-8">
                        <Link href="/" className="relative z-0">
                            {/* Logo con el vehículo frontal y carretera */}
                            <ApplicationLogo className="w-64 h-32 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                        </Link>
                        
                        {/* Bloque de texto con z-index para estar SIEMPRE al frente */}
                        <div className="relative z-10 -mt-6 text-center">
                            <h2 className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                Smart Transport
                            </h2>
                            <p className="text-blue-200 text-xs font-bold uppercase tracking-[0.2em] mt-1 opacity-90">
                                Logística y Monitoreo en Vivo
                            </p>
                        </div>
                    </div>

                    {status && <div className="mb-4 font-bold text-sm text-green-300">{status}</div>}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="email" value="Correo Electrónico" className="text-white font-black mb-1" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full bg-slate-950/70 border-white/40 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400 rounded-xl py-3 shadow-inner"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="usuario@smart.com"
                            />
                            <InputError message={errors.email} className="mt-2 text-red-300 font-bold" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Contraseña" className="text-white font-black mb-1" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full bg-slate-950/70 border-white/40 text-white focus:border-blue-400 focus:ring-blue-400 rounded-xl py-3 shadow-inner"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2 text-red-300 font-bold" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer group">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-white/40 bg-slate-950/70 text-blue-500 focus:ring-blue-400"
                                />
                                <span className="ms-2 text-sm font-black text-white group-hover:text-blue-200 transition-colors">Recordarme</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-blue-300 hover:text-white font-black transition-colors underline underline-offset-4"
                                >
                                    ¿Olvidaste tu clave?
                                </Link>
                            )}
                        </div>

                        <div className="pt-2">
                            <PrimaryButton 
                                className="w-full justify-center py-4 bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-lg rounded-xl transition-all transform hover:scale-[1.03] active:scale-[0.98] shadow-2xl shadow-blue-500/40" 
                                disabled={processing}
                            >
                                ENTRAR AL PANEL
                            </PrimaryButton>
                        </div>
                    </form>

                    <div className="mt-10 pt-6 border-t border-white/20 text-center">
                        <p className="text-white text-sm font-bold">
                            ¿Aún no eres parte?{' '}
                            <Link href={route('register')} className="text-blue-300 font-black hover:text-white transition-colors decoration-2 underline">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}