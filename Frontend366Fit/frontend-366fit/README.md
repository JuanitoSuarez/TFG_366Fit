# 366Fit - Frontend (React SPA)

Este repositorio contiene el cliente web del sistema 366Fit, una plataforma integral diseñada para la gestión de clases y reservas de un gimnasio. El proyecto ha sido desarrollado como una Single Page Application (SPA) utilizando React y Vite, priorizando la reactividad y la experiencia de usuario.

## Caracteristicas Principales

- Dashboard Dinamico: Interfaz adaptativa que modifica sus funcionalidades segun el rol del usuario autenticado (Cliente o Administrador).
- Gestion de Clases: Visualizacion de horarios y disponibilidad en tiempo real mediante el consumo de servicios API.
- Sistema de Reservas: Modulo completo para la gestion de plazas, incluyendo validaciones de aforo y cancelaciones con feedback de estado.
- Panel Administrativo: Herramientas de gestion para administradores que permiten la creacion y eliminacion de sesiones de entrenamiento de forma dinamica.
- Interfaz Personalizada: Diseno estructurado mediante CSS puro para garantizar una navegacion fluida y eficiente.

## Tecnologias Utilizadas

- React 18: Biblioteca principal para la construccion de la interfaz de usuario.
- Vite: Entorno de desarrollo y herramienta de construccion de alto rendimiento.
- JavaScript (ES6+): Lenguaje de programacion para la logica de cliente.
- CSS3: Implementacion de estilos, Flexbox y Grid para el diseno visual.
- Fetch API: Protocolo para la comunicacion asincrona con el backend desarrollado en ASP.NET Core.

## Instalacion y Configuracion

1. Clonar el repositorio:
   git clone https://github.com/JuanitoSuarez/TFG_366Fit.git

2. Acceder al directorio del frontend:
   cd Frontend366Fit/frontend-366fit

3. Instalar las dependencias necesarias:
   npm install

4. Iniciar la aplicacion en modo desarrollo:
   npm run dev

## Especificaciones de Conexion

La aplicacion esta configurada para comunicarse con el servidor API en la direccion https://localhost:7044. Es requisito indispensable que el servicio de Backend este operativo para el correcto funcionamiento de los modulos de autenticacion, gestion de clases y procesamiento de reservas.

---
Autor: Juan Daniel Suárez Cabal - Proyecto Fin de Grado 2026
