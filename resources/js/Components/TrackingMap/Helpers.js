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

// 🧠 FORMATEO DE ALERTA: Puros datos, cero CSS.
export const formatAlertForUI = (newAlert) => {
    if (!newAlert) return null;
    
    const typeStr = newAlert.type || 'INFO'; 
    const typeLabel = typeStr.replace(/_/g, ' '); 
    
    // Asignamos una categoría lógica
    let category = 'INFO';
    if (['AVERIA', 'PANICO', 'AUXILIO'].includes(typeStr)) category = 'CRITICAL';
    else if (['SIN_COMBUSTIBLE', 'GPS_APAGADO'].includes(typeStr)) category = 'WARNING';
    else if (typeStr === 'EXCESO_VELOCIDAD') category = 'SPEED';
    else if (['LLEGADA_DESTINO', 'SALIDA'].includes(typeStr)) category = 'SUCCESS';

    const dateObj = newAlert.created_at ? new Date(newAlert.created_at) : new Date();
    
    // ⏱️ Cálculo de Retraso en Tiempo Real
    let delayText = null;
    if (newAlert.trip && newAlert.trip.delay_minutes > 0) {
        const h = Math.floor(newAlert.trip.delay_minutes / 60);
        const m = newAlert.trip.delay_minutes % 60;
        delayText = h > 0 ? `${h}h ${m}m` : `${m} min`;
    }

    return {
        id: newAlert.id || Math.random(), 
        typeLabel: typeLabel, 
        category: category, 
        message: newAlert.message || 'Alerta registrada sin mensaje.',
        date: dateObj.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        time: dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        plate: newAlert.vehicle ? newAlert.vehicle.license_plate : 'Sin Patente',
        model: newAlert.vehicle ? newAlert.vehicle.model : 'Vehículo Desconocido', 
        origin: newAlert.trip ? newAlert.trip.origin : 'No especificado', 
        destination: newAlert.trip ? newAlert.trip.destination : 'No especificado',
        address: newAlert.address || null, 
        lat: parseFloat(newAlert.latitude || 0), 
        lng: parseFloat(newAlert.longitude || 0),
        delay: delayText
    };
};