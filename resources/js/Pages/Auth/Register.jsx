import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 font-sans">
            {/* Fondo Dinámico Unificado */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/images/imagen1.jpg" 
                    className="w-full h-full object-cover opacity-30 blur-sm"
                    alt="Terminal Formosa Background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-blue-900/70 to-slate-900/95"></div>
            </div>

            <Head title="Registrarse - Smart Transport" />

            <div className="relative z-10 w-full max-w-md px-6 py-12">
                {/* Tarjeta Glassmorphism */}
                <div className="bg-white/25 backdrop-blur-3xl border border-white/30 rounded-3xl shadow-2xl p-10">
                    
                    {/* Header con Logo y Perspectiva Frontal */}
                    <div className="flex flex-col items-center mb-8">
                        <Link href="/" className="relative z-0">
                            <ApplicationLogo className="w-64 h-32 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                        </Link>
                        
                        <div className="relative z-10 -mt-6 text-center">
                            <h2 className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                Smart Transport
                            </h2>
                            <p className="text-blue-200 text-xs font-bold uppercase tracking-[0.2em] mt-1 opacity-90">
                                Únete a la Gestión Inteligente
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Nombre */}
                        <div>
                            <InputLabel htmlFor="name" value="Nombre Completo" className="text-white font-black mb-1" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full bg-slate-950/70 border-white/40 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400 rounded-xl py-3 shadow-inner"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2 text-red-300 font-bold" />
                        </div>

                        {/* Email */}
                        <div>
                            <InputLabel htmlFor="email" value="Correo Electrónico" className="text-white font-black mb-1" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full bg-slate-950/70 border-white/40 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400 rounded-xl py-3 shadow-inner"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2 text-red-300 font-bold" />
                        </div>

                        {/* Password */}
                        <div>
                            <InputLabel htmlFor="password" value="Contraseña" className="text-white font-black mb-1" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full bg-slate-950/70 border-white/40 text-white focus:border-blue-400 focus:ring-blue-400 rounded-xl py-3 shadow-inner"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2 text-red-300 font-bold" />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" className="text-white font-black mb-1" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full bg-slate-950/70 border-white/40 text-white focus:border-blue-400 focus:ring-blue-400 rounded-xl py-3 shadow-inner"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2 text-red-300 font-bold" />
                        </div>

                        <div className="pt-4 flex flex-col gap-4">
                            <PrimaryButton 
                                className="w-full justify-center py-4 bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-lg rounded-xl transition-all transform hover:scale-[1.03] active:scale-[0.98] shadow-2xl shadow-blue-500/40" 
                                disabled={processing}
                            >
                                CREAR CUENTA
                            </PrimaryButton>

                            <Link
                                href={route('login')}
                                className="text-center text-sm text-white font-bold hover:text-blue-300 transition-colors underline underline-offset-4 opacity-80"
                            >
                                ¿Ya tienes una cuenta? Inicia sesión
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}