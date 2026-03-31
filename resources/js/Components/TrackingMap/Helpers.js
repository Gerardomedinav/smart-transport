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

// 🧠 FORMATEO DE ALERTA: ASEGURAMOS CAPTURA DE DATOS PARA POPUPS
export const formatAlertForUI = (newAlert) => {
    if (!newAlert) return null;
    
    const typeStr = newAlert.type || 'INFO'; 
    const typeLabel = typeStr.replace(/_/g, ' '); 
    
    let category = 'INFO';
    if (['AVERIA', 'PANICO', 'AUXILIO', 'SOS'].includes(typeStr)) category = 'CRITICAL';
    else if (['SIN_COMBUSTIBLE', 'GPS_APAGADO', 'LOW_FUEL'].includes(typeStr)) category = 'WARNING';
    else if (typeStr === 'EXCESO_VELOCIDAD' || typeStr === 'OVERSPEED') category = 'SPEED';
    else if (['LLEGADA_DESTINO', 'SALIDA'].includes(typeStr)) category = 'SUCCESS';

    const dateObj = newAlert.created_at ? new Date(newAlert.created_at) : new Date();

    return {
        id: newAlert.id || Math.random(), 
        typeLabel: typeLabel, 
        category: category, 
        message: newAlert.message || newAlert.content || 'Alerta registrada.',
        date: dateObj.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        time: dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        plate: newAlert.vehicle?.license_plate || newAlert.vehicle_plate || newAlert.plate || 'S/P',
        model: newAlert.vehicle?.model || newAlert.vehicle_model || newAlert.model || 'Camión', 
        origin: newAlert.trip?.origin || newAlert.origin || 'Base', 
        destination: newAlert.trip?.destination || newAlert.destination || 'Destino',
        // 🚨 NORMALIZACIÓN PARA EVITAR NaN Y "LOCALIZANDO"
        address: newAlert.address || "Ruta Nacional, Formosa", 
        lat: parseFloat(newAlert.latitude || newAlert.lat || 0), 
        lng: parseFloat(newAlert.longitude || newAlert.lng || 0),
        driver_name: newAlert.driver_name || newAlert.trip?.driver?.name || 'Chofer'
    };
};