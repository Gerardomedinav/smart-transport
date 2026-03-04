// resources/js/Components/TrackingMap/Helpers.js

export const BRAND_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export const getVehicleColor = (licensePlate) => {
    let hash = 0;
    for (let i = 0; i < licensePlate.length; i++) { hash = licensePlate.charCodeAt(i) + ((hash << 5) - hash); }
    return BRAND_COLORS[Math.abs(hash) % BRAND_COLORS.length];
};

export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    if (!lat2 || !lon2) return 0; 
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180); 
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export const calculateETA = (distanceKm, speed) => {
    if (distanceKm < 1) return "Llegó al destino"; 
    if (speed <= 0) return "N/D (Detenido)"; 
    const totalHours = distanceKm / speed; 
    const hours = Math.floor(totalHours); 
    const minutes = Math.round((totalHours - hours) * 60);
    if (hours === 0) return `${minutes} min`; 
    return `${hours}h ${minutes}m`;
};

// 🧠 FORMATEO DE ALERTA LIMPIO (Retorna variables para React, no HTML)
export const formatAlertForUI = (newAlert) => {
    if (!newAlert) return null;
    let bgColor = 'bg-blue-50'; let badgeStyle = 'bg-white border-blue-200 text-blue-600'; let cardStyle = 'border-blue-200';
    
    const typeStr = newAlert.type || 'DESCONOCIDO'; 
    const typeLabel = typeStr.replace('_', ' '); // 👈 Este es el texto que ahora SÍ se mostrará
    let hasDangerIcon = false;

    if (['AVERIA', 'PANICO', 'AUXILIO'].includes(typeStr)) { 
        bgColor = 'bg-red-50'; cardStyle = 'border-red-500 shadow-md shadow-red-500/20'; badgeStyle = 'bg-red-600 text-white border-red-700 animate-pulse'; hasDangerIcon = true;
    } 
    else if (['SIN_COMBUSTIBLE', 'GPS_APAGADO'].includes(typeStr)) { 
        bgColor = 'bg-orange-50'; cardStyle = 'border-orange-500 shadow-md shadow-orange-500/20'; badgeStyle = 'bg-orange-600 text-white border-orange-700 animate-pulse'; hasDangerIcon = true;
    } 
    else if (typeStr === 'EXCESO_VELOCIDAD') { 
        bgColor = 'bg-amber-50'; cardStyle = 'border-amber-300'; badgeStyle = 'bg-amber-100 text-amber-700 border-amber-300'; 
    } 
    else if (['LLEGADA_DESTINO', 'SALIDA'].includes(typeStr)) { 
        bgColor = 'bg-green-50'; cardStyle = 'border-green-200'; badgeStyle = 'bg-white text-green-600 border-green-200'; 
    } 

    const dateObj = newAlert.created_at ? new Date(newAlert.created_at) : new Date();
    return {
        id: newAlert.id || Math.random(), 
        typeLabel: typeLabel,          // 👈 Pasamos el texto limpio
        hasDangerIcon: hasDangerIcon,  // 👈 Pasamos el estado del icono
        typeRaw: typeStr, 
        message: newAlert.message || 'Sin mensaje',
        date: dateObj.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        time: dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        badgeStyle, cardStyle, bg: bgColor, plate: newAlert.vehicle ? newAlert.vehicle.license_plate : 'Sin Patente',
        model: newAlert.vehicle ? newAlert.vehicle.model : 'Desconocido', origin: newAlert.trip ? newAlert.trip.origin : 'N/D', destination: newAlert.trip ? newAlert.trip.destination : 'N/D',
        address: newAlert.address || null, lat: parseFloat(newAlert.latitude || 0), lng: parseFloat(newAlert.longitude || 0)
    };
};