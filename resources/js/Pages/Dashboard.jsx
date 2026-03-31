import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TrackingMap from '@/Components/TrackingMap';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function Dashboard({ auth }) {
    const [darkMode, setDarkMode] = useState(true);
    const [criticalAlerts, setCriticalAlerts] = useState([]); 
    const audioRef = useRef(new Audio('/sounds/alert.mp3'));

    // 🚀 PERSISTENCIA: Cargar alertas críticas al entrar o volver
    const loadActiveEmergencies = () => {
        axios.get('/api/alerts', { params: { type: 'CRITICAL' } })
            .then(res => {
                // Laravel Paginate devuelve los datos en res.data.data
                const alertsFromDb = res.data.data || [];
                
                const active = alertsFromDb
                    .filter(a => ['SOS', 'AVERIA', 'SIN_COMBUSTIBLE'].includes(a.type))
                    .slice(0, 2)
                    .map(a => ({
                        id: a.id,
                        type: a.type,
                        category: a.category || 'CRITICAL',
                        message: a.message,
                        address: a.address,
                        latitude: a.latitude, 
                        longitude: a.longitude,
                        driver_id: a.trip?.user_id || a.driver_id,
                        driver_name: a.trip?.driver?.name || a.driver_name || 'Personal',
                        vehicle_plate: a.vehicle?.license_plate || a.vehicle_plate,
                        vehicle_model: a.vehicle?.model || a.vehicle_model,
                        timestamp: new Date(a.created_at).toLocaleTimeString(),
                    }));
                setCriticalAlerts(active);
            })
            .catch(err => console.error("Error al cargar alertas persistentes:", err));
    };

    useEffect(() => {
        loadActiveEmergencies();

        const emergencyChannel = window.Echo.private('notificaciones.emergencia')
            .listen('.alert.created', (e) => {
                if (e.alert.type === 'SOS' || e.alert.type === 'AVERIA' || e.alert.category === 'CRITICAL') {
                    
                    const newAlert = {
                        id: e.alert.id || Date.now(),
                        type: e.alert.type,
                        category: e.alert.category,
                        message: e.alert.message,
                        address: e.alert.address,    
                        latitude: e.alert.latitude,  
                        longitude: e.alert.longitude, 
                        driver_id: e.alert.driver_id || e.alert.trip?.user_id,
                        driver_name: e.alert.driver_name || e.alert.trip?.driver?.name || 'Chofer',
                        vehicle_plate: e.alert.vehicle_plate || e.alert.vehicle?.license_plate,
                        vehicle_model: e.alert.vehicle_model || e.alert.vehicle?.model,
                        timestamp: new Date().toLocaleTimeString(),
                    };

                    setCriticalAlerts(prev => [newAlert, ...prev].slice(0, 2)); 
                    audioRef.current.play().catch(() => {});
                }
            });

        return () => window.Echo.leave('notificaciones.emergencia');
    }, []);

    return (
        <AuthenticatedLayout user={auth.user} header="Monitoreo" darkMode={darkMode}>
            <Head title="Terminal Global" />

            <div className={`p-2 lg:p-4 h-[calc(100vh-64px)] flex flex-col overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-gray-100'}`}>
                <div className="flex justify-between items-center mb-2 px-2">
                    <h1 className={`text-lg font-black uppercase ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        Sistema de Seguimiento
                    </h1>
                    <button 
                        onClick={() => setDarkMode(!darkMode)} 
                        className={`text-[10px] font-bold border px-2 py-1 rounded ${darkMode ? 'text-white border-slate-700' : 'text-slate-900 border-gray-300'}`}
                    >
                        {darkMode ? 'MODO CLARO' : 'MODO OSCURO'}
                    </button>
                </div>

                <div className={`flex-1 w-full rounded-xl overflow-hidden relative border-2 ${darkMode ? 'border-slate-700' : 'border-gray-300'}`}>
                    <TrackingMap 
                        darkMode={darkMode} 
                        authUser={auth.user} 
                        externalAlerts={criticalAlerts}
                        setExternalAlerts={setCriticalAlerts}
                    /> 
                </div>
            </div>
        </AuthenticatedLayout>
    );
}