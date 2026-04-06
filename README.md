# 🚚 Smart Transport - Centro de Control Logístico

**Smart Transport** es una plataforma integral de gestión y monitoreo de flotas en tiempo real. Diseñada para transformar datos de telemetría en decisiones estratégicas, la plataforma optimiza la rentabilidad, mejora la seguridad vial y centraliza la comunicación operativa.

Desarrollado en **Formosa, Argentina** por **Gerardo Medina Villalba**, combinando ingeniería de software (UTN/UNAF) con analítica de datos avanzada.

---

## 📸 Módulos Visuales del Sistema

### 1. Experiencia de Bienvenida (Welcome)
Interfaz inmersiva con animaciones 3D y scroll dinámico que presenta la potencia tecnológica de la flota.

### 2. Acceso Translúcido (Login)
Portal de inicio de sesión con estética *Glassmorphism* sobre fondo de video.

### 3. Centro de Monitoreo (Mapa Real-Time)
Rastreo satelital con identificación de conductores, velocidad en vivo y alertas críticas.

### 4. Inteligencia de Negocios (Dashboard BI)
Panel con métricas comparativas, tendencias, heatmaps y análisis avanzado.

### 5. Control de Activos (Gestión de Personal)
Gestión de conductores, vehículos y roles.

---

## 🛠️ Stack Tecnológico

- Laravel 11
- React + Inertia + Tailwind
- PostgreSQL
- Docker
- WebSockets (Reverb)

---
# 🚚 Smart Transport - Guía Completa de Instalación

## 🚀 Instalación paso a paso (Docker)

### 1. Clonar repositorio
```bash
git clone https://github.com/Gerardomedinav/smart-transport.git
cd smart-transport
```

### 2. Configurar entorno
```bash
cp .env.example .env
```

### 3. Levantar contenedores
```bash
docker compose up -d --build
```

---

## ⚙️ Configuración Backend (Laravel)

### Instalar dependencias PHP
```bash
docker compose exec laravel.test composer install
```

### Generar APP KEY
```bash
docker compose exec laravel.test php artisan key:generate
```

### Ejecutar migraciones
```bash
docker compose exec laravel.test php artisan migrate
```

---

## 🎨 Configuración Frontend

### Instalar dependencias
```bash
docker compose exec laravel.test npm install
```

### Compilar assets
```bash
docker compose exec laravel.test npm run build
```

Modo desarrollo:
```bash
docker compose exec laravel.test npm run dev
```

---

## 📦 Datos Iniciales

### Cargar flota
```bash
docker compose exec laravel.test php artisan fleet:load
```

### Crear usuario admin
```bash
docker compose exec laravel.test php artisan system:create-admin
```

---

## 🛰️ Tiempo Real

### Simulación GPS
```bash
docker compose exec laravel.test php artisan fleet:gps
```

### WebSockets
```bash
docker compose exec laravel.test php artisan reverb:start --host=0.0.0.0 --port=8081 --debug
```

---

## 🔧 Mantenimiento

### Limpiar cache
```bash
docker compose exec laravel.test php artisan optimize:clear
```

### Permisos (Linux)
```bash
docker compose exec laravel.test chmod -R 775 storage bootstrap/cache
```

### Ver logs
```bash
docker compose logs -f
```

---

## 🌐 Acceso

- App: http://localhost
- WebSockets: ws://localhost:8081

---

## 👤 Autor

Gerardo Medina Villalba  
Formosa, Argentina - 2026
