# Proyecto Newman 2 - Plataforma de Comercio en Línea

## 📋 Descripción General

**Proyecto Newman 2** es una plataforma web moderna diseñada para facilitar el comercio en línea entre compradores y vendedores. El objetivo principal de la aplicación es proporcionar un entorno seguro, rápido y confiable para realizar transacciones.

La aplicación se centra en tres pilares fundamentales:
1. **Transacciones Seguras**: Protección de pagos y verificación de usuarios.
2. **Publicación Rápida**: Herramientas optimizadas para que los vendedores publiquen productos en segundos.
3. **Comunidad de Confianza**: Un ecosistema de usuarios verificados.

### ✨ Funcionalidades Recientes
- **Búsqueda y Filtrado**: Sistema de búsqueda por texto y filtrado por vendedor en el catálogo.
- **Carrito de Compras**: Gestión de estado de carrito y simulación de pago con validación de stock.
- **API RESTful**: Endpoints robustos (`/api/products`) para operaciones CRUD y actualizaciones masivas (BulkWrite).
- **Sistema de Auditoría**: Integración con **Sentinel** para registro de eventos (búsquedas, transacciones).
- **UI Interactiva**: Componentes modernos para Términos y Condiciones (Dialogs, Accordions).

## 🚀 Tecnologías y Librerías

Este proyecto se apoya en un ecosistema robusto de **software de código abierto**, garantizando flexibilidad, seguridad y soporte comunitario:

### Core
- **React**: Biblioteca principal para la construcción de interfaces.
- **Next.js**: Framework de React para producción (App Router).
- **TypeScript**: Superset de JavaScript para tipado estático.

### Backend y Datos
- **MongoDB**: Base de datos NoSQL orientada a documentos para un manejo flexible de datos.

### Estilos y UI
- **Tailwind CSS**: Framework de utilidades CSS.
- **Shadcn/ui**: Colección de componentes accesibles y personalizables (basados en **Radix UI**).
- **Radix UI**: Primitivas de componentes sin estilo para máxima accesibilidad (Dialogs, Accordions).
- **Lucide React**: Conjunto de iconos vectoriales ligeros (`ShoppingBag`, `ShieldCheck`, etc.).

## 📂 Estructura del Proyecto

A continuación se muestra la estructura general del proyecto (basada en la arquitectura estándar de Next.js):

```text
ProyectoNewman2/
├── app/                    # Rutas y páginas de la aplicación (App Router)
│   ├── api/                # Endpoints de API (Backend Next.js)
│   ├── products/           # Módulo de productos (Catálogo, Búsqueda, Carrito)
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página de inicio
├── shared/                 # Componentes compartidos (Footer, Header)
├── components/             # Componentes reutilizables
│   └── ui/                 # Componentes base de UI (Cards, Buttons, etc.)
├── public/                 # Archivos estáticos (imágenes, fuentes)
├── lib/                    # Utilidades y funciones auxiliares
└── ...
```

## 📍 Rutas del Proyecto

Las rutas principales de la aplicación son:

- `/`: **Inicio (Landing Page)** - Muestra la propuesta de valor y secciones principales (incluyendo la sección de características).
- `/products`: **Catálogo de Productos** - Listado dinámico de productos disponibles con gestión de stock y carrito de compras.
- `/api/products`: **API Endpoint** - Soporta obtención de productos (con filtros), creación y actualización de stock (simulación de pago).
- *(Rutas sugeridas/pendientes de confirmar según el desarrollo)*:
  - `/login`: Autenticación de usuarios.
  - `/dashboard`: Panel de control para vendedores.

## 🛠️ Instalación y Uso

Para ejecutar el proyecto localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

3. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   Visita http://localhost:3000 para ver la aplicación.