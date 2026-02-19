# 🚛 Smart Transport - Smart City Platform
Desarrollado por [Gerardo Medina](https://www.linkedin.com/in/gerardomedinav/) **Técnico Analista en Diseño de Software**
**Smart Transport** es un sistema de monitoreo y gestión de transporte urbano desarrollado bajo estándares de grado empresarial. El proyecto se enfoca en la trazabilidad inmutable de activos, optimización de logística y preparación para integración con Smart Contracts.

## 🛠️ Stack Tecnológico
* **Backend:** Laravel 12 (PHP 8.4)
* **Base de Datos:** PostgreSQL
* **Infraestructura:** Docker (Laravel Sail)
* **Arquitectura de Datos:** * **UUIDs:** Identificadores únicos universales para mayor seguridad y escalabilidad.
    * **Soft Deletes:** Borrado lógico para auditoría y persistencia de historial técnico.
    * **Precisión GPS:** Uso de tipos `decimal` de alta fidelidad para coordenadas latitud/longitud.

## 🚀 Características del Diseño
1.  **Jerarquía de Entidades:** Estructura vinculada de Vehículos -> Viajes -> Localizaciones.
2.  **API First:** Endpoints optimizados mediante *Eager Loading* para reducir la latencia en la carga de mapas.
3.  **Dockerizado:** Entorno reproducible que garantiza el funcionamiento en cualquier servidor compatible con contenedores.

## ⚙️ Instalación (Entorno de Desarrollo)

Para clonar y ejecutar este proyecto localmente, asegúrate de tener Docker instalado:

```bash
# Clonar el repositorio
git clone [https://github.com/Gerardomedinav/smart-transport.git](https://github.com/Gerardomedinav/smart-transport.git)

# Entrar al directorio
cd smart-transport

# Instalar dependencias
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php84-composer:latest \
    composer install --ignore-platform-reqs

# Levantar contenedores
./vendor/bin/sail up -d

# Ejecutar migraciones
./vendor/bin/sail artisan migrate

