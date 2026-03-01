import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const [darkMode, setDarkMode] = useState(true);

    return (
        <AuthenticatedLayout
            user={auth.user}
            darkMode={darkMode}
            header="Configuración de Cuenta"
        >
            <Head title="Configuración de Perfil" />

            {/* Inyección de estilos para arreglar los Partials sin editarlos uno por uno */}
            <style>{`
                ${darkMode ? `
                    .profile-section h2 { color: white !important; font-weight: 900; }
                    .profile-section p { color: #94a3b8 !important; }
                    .profile-section label { color: #cbd5e1 !important; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; }
                    .profile-section input { background-color: #0f172a !important; color: white !important; border-color: #334155 !important; border-radius: 1rem !important; }
                ` : ''}
            `}</style>

            <div className={`py-12 transition-colors duration-700 min-h-full ${darkMode ? 'bg-slate-950' : 'bg-gray-100'}`}>
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    
                    {/* Selector de Modo Unificado */}
                    <div className="flex justify-end px-4 sm:px-0">
                        <button 
                            onClick={() => setDarkMode(!darkMode)}
                            className={`group flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all border shadow-lg active:scale-95
                            ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-gray-200 text-slate-900'}`}
                        >
                            {darkMode ? '☀️ VISTA CLARA' : '🌙 VISTA OSCURA'}
                        </button>
                    </div>

                    {/* SECCIÓN: INFORMACIÓN PERSONAL */}
                    <div className={`profile-section p-8 shadow-2xl sm:rounded-[2.5rem] border transition-all duration-500 ${
                        darkMode ? 'bg-slate-900 border-white/5 shadow-blue-900/10' : 'bg-white border-gray-100 shadow-slate-200'
                    }`}>
                        <div className="max-w-xl text-left">
                            <h2 className="text-lg font-black uppercase tracking-tighter mb-1">Información del Perfil</h2>
                            <p className="text-sm mb-6">Actualiza la información de tu cuenta y dirección de correo electrónico.</p>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>
                    </div>

                    {/* SECCIÓN: SEGURIDAD */}
                    <div className={`profile-section p-8 shadow-2xl sm:rounded-[2.5rem] border transition-all duration-500 ${
                        darkMode ? 'bg-slate-900 border-white/5 shadow-blue-900/10' : 'bg-white border-gray-100 shadow-slate-200'
                    }`}>
                        <div className="max-w-xl text-left">
                            <h2 className="text-lg font-black uppercase tracking-tighter mb-1">Actualizar Contraseña</h2>
                            <p className="text-sm mb-6">Asegúrate de que tu cuenta esté usando una contraseña larga y aleatoria para mantenerla segura.</p>
                            <UpdatePasswordForm />
                        </div>
                    </div>

                    {/* SECCIÓN: ZONA DE PELIGRO */}
                    <div className={`profile-section p-8 shadow-2xl sm:rounded-[2.5rem] border transition-all duration-500 ${
                        darkMode ? 'bg-slate-900 border-red-500/10 shadow-red-900/5' : 'bg-white border-red-50 shadow-red-100'
                    }`}>
                        <div className="max-w-xl text-left">
                            <h2 className="text-lg font-black uppercase tracking-tighter mb-1 text-red-500">Eliminar Cuenta</h2>
                            <p className="text-sm mb-6">Una vez que se elimine tu cuenta, todos sus recursos y datos se borrarán permanentemente.</p>
                            <DeleteUserForm />
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}