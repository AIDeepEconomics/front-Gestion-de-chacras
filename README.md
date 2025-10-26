# Portal de Trazabilidad de Arroz - Sistema de Gestión

## Descripción
Sistema de gestión y trazabilidad de arroz para productores rurales y personal de molinos. Permite:
- Gestión de establecimientos y chacras
- Registro de eventos agrícolas
- Relaciones con molinos
- Seguimiento de cosechas

## Características Principales
- **Dos tipos de usuarios**: Productores y personal de molino
- **Gestión completa de chacras**: Áreas, régimen, propiedad
- **Eventos agrícolas**: Siembra, fertilización, cosecha, etc.
- **Interfaz profesional**: Dashboard moderno y responsive

## Tecnologías
### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui (basado en Radix UI)

### Backend
- Node.js + Express
- PostgreSQL (Neon)
- Drizzle ORM

## Instalación
1. Clonar repositorio
2. Instalar dependencias:
```bash
npm install
```
3. Configurar variables de entorno (crear .env basado en .env.example)

## Uso
### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm run start
```

## Mock Users
El sistema incluye usuarios de prueba:
- **Productor**: Juan Carlos Rodríguez
- **Molino**: María González (Molino Los Pinos)

Se puede cambiar entre usuarios desde el menú de perfil.

## Estructura del Proyecto
```
client/    # Frontend
server/    # Backend
shared/    # Código compartido
```

## Licencia
MIT