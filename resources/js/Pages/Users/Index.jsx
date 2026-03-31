import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, users, vehicles }) {
    const [darkMode, setDarkMode] = useState(true);
    
    // 🎛️ Estados para controlar el Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' o 'edit'
    const [selectedUser, setSelectedUser] = useState(null);

    // 🚀 Formulario de Inertia.js
    const { data, setData, post, put, delete: destroy, reset, errors, clearErrors, processing } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'conductor',
        vehicle_id: ''
    });

    const openModal = (mode, user = null) => {
        clearErrors();
        setModalMode(mode);
        if (mode === 'edit' && user) {
            setSelectedUser(user);
            setData({
                name: user.name,
                email: user.email,
                password: '', 
                role: user.role,
                vehicle_id: user.vehicle_id || ''
            });
        } else {
            reset();
            setSelectedUser(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === 'create') {
            post(route('usuarios.store'), { onSuccess: () => closeModal() });
        } else {
            put(route('usuarios.update', selectedUser.id), { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (user) => {
        if (confirm(`¿Estás seguro de que deseas eliminar al empleado ${user.name}?`)) {
            destroy(route('usuarios.destroy', user.id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Gestión de Personal" darkMode={darkMode}>
            <Head title="Usuarios - Terminal Global" />

            <div className={`min-h-[calc(100vh-64px)] p-4 lg:p-8 transition-colors duration-500 relative ${darkMode ? 'bg-slate-900' : 'bg-gray-100'}`}>
                
                {/* 🎛️ CABECERA */}
                <div className={`p-6 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <div>
                        <h2 className={`text-lg font-black uppercase tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            Directorio de Empleados
                        </h2>
                        <p className={`text-xs font-bold mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Asigna conductores a vehículos y gestiona accesos.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => setDarkMode(!darkMode)} className={`px-4 py-2 rounded-lg font-black text-[10px] tracking-widest transition-all border ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-gray-300 text-slate-900 hover:bg-gray-50'}`}>
                            {darkMode ? '☀️ CLARO' : '🌙 OSCURO'}
                        </button>
                        <button 
                            onClick={() => openModal('create')}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/30 transition-all border border-blue-500 active:scale-95"
                        >
                            + Nuevo Usuario
                        </button>
                    </div>
                </div>

                {/* 📋 TABLA */}
                <div className={`rounded-xl shadow-sm border overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`text-[10px] uppercase tracking-widest border-b ${darkMode ? 'bg-slate-950 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-500 border-gray-200'}`}>
                                    <th className="p-4 font-black">Nombre y Correo</th>
                                    <th className="p-4 font-black text-center">Rol</th>
                                    <th className="p-4 font-black text-center">Vehículo</th>
                                    <th className="p-4 font-black text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-bold">
                                {users.map((u) => (
                                    <tr key={u.id} className={`border-b transition-colors ${darkMode ? 'border-slate-700/50 hover:bg-slate-800/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                                        <td className="p-4">
                                            <p className={darkMode ? 'text-white' : 'text-slate-900'}>{u.name}</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{u.email}</p>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                                                u.role === 'operario' 
                                                ? (darkMode ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200')
                                                : (darkMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200')
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {u.vehicle ? (
                                                <span className={`px-2 py-1 rounded text-[10px] font-black border ${darkMode ? 'bg-slate-900 text-blue-400 border-slate-700' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                                    {u.vehicle.license_plate}
                                                </span>
                                            ) : (
                                                <span className="text-slate-500 text-[10px] italic font-medium">Sin asignar</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                {/* ✏️ BOTÓN EDITAR */}
                                                <button 
                                                    onClick={() => openModal('edit', u)}
                                                    className={`p-2 rounded-lg transition-all ${darkMode ? 'text-blue-400 hover:bg-blue-500/10' : 'text-blue-600 hover:bg-blue-50'}`}
                                                    title="Editar usuario"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                                    </svg>
                                                </button>

                                                {/* 🗑️ BOTÓN BORRAR */}
                                                {auth.user.id !== u.id && (
                                                    <button 
                                                        onClick={() => handleDelete(u)}
                                                        className={`p-2 rounded-lg transition-all ${darkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
                                                        title="Eliminar usuario"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75V4H5a2 2 0 00-2 2v.25C3 6.664 3.016 7.083 3.048 7.5h13.904c.032-.417.048-.836.048-1.25V6a2 2 0 00-2-2h-1v-.25A2.75 2.75 0 0011.25 1h-2.5zM5 11h10v5.25a2.75 2.75 0 01-2.75 2.75h-4.5A2.75 2.75 0 015 16.25V11z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 🛡️ MODAL FORMULARIO */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
                        <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border animate-in fade-in zoom-in duration-200 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
                            <div className={`px-6 py-4 border-b ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                                <h3 className={`text-lg font-black uppercase tracking-wide ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                                    {modalMode === 'create' ? 'Agregar Empleado' : 'Editar Empleado'}
                                </h3>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Nombre Completo</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={`w-full rounded-lg text-sm font-bold border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-300 text-slate-900'}`} required />
                                    {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Correo Electrónico</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={`w-full rounded-lg text-sm font-bold border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-300 text-slate-900'}`} required />
                                    {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        Contraseña {modalMode === 'edit' && <span className="text-blue-500">(dejar vacío para mantener)</span>}
                                    </label>
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className={`w-full rounded-lg text-sm font-bold border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-300 text-slate-900'}`} required={modalMode === 'create'} />
                                </div>

                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Rol de Usuario</label>
                                    <select value={data.role} onChange={e => setData('role', e.target.value)} className={`w-full rounded-lg text-sm font-bold border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-slate-900'}`}>
                                        <option value="conductor">🚚 Conductor de Flota</option>
                                        <option value="operario">🛡️ Operador Logístico</option>
                                    </select>
                                </div>

                                {data.role === 'conductor' && (
                                    <div className="animate-in slide-in-from-top-2 duration-300">
                                        <label className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Vehículo Asignado</label>
                                        <select value={data.vehicle_id} onChange={e => setData('vehicle_id', e.target.value)} className={`w-full rounded-lg text-sm font-bold border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-slate-900'}`}>
                                            <option value="">-- Sin vehículo asignado --</option>
                                            {vehicles.map(v => (
                                                <option key={v.id} value={v.id}>{v.license_plate} - {v.model}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={closeModal} className={`flex-1 py-2.5 rounded-lg font-black text-[10px] uppercase border transition-all ${darkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white' : 'border-gray-200 text-slate-600 hover:bg-gray-100'}`}>Cancelar</button>
                                    <button type="submit" disabled={processing} className="flex-1 py-2.5 rounded-lg font-black text-[10px] uppercase bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all">
                                        {processing ? 'Procesando...' : (modalMode === 'create' ? 'Crear Usuario' : 'Actualizar')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}