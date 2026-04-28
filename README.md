# 366Fit - Sistema Integral de Gestión de Centros Deportivos

Este proyecto constituye el Trabajo de Fin de Grado (TFG) de la aplicación 366Fit. Se trata de una solución Full-Stack diseñada para la automatización de reservas, gestión de usuarios y administración de clases en centros deportivos.

## Arquitectura del Proyecto

El sistema sigue un modelo cliente-servidor con una arquitectura en capas (N-Tier):

- **Backend (Api366Fit):** API REST desarrollada con .NET 10 que gestiona la lógica de negocio y la persistencia de datos.
- **Frontend (Frontend366Fit):** Single Page Application (SPA) desarrollada con React y Vite.

## Tecnologías Principales

### Servidor (Backend)
- .NET 10: Framework principal para el desarrollo de la API.
- Entity Framework Core: ORM para la gestión de la base de datos MySQL.
- BCrypt.Net: Algoritmo utilizado para la encriptación segura de contraseñas.

### Cliente (Frontend)
- React 18: Biblioteca para la construcción de la interfaz basada en componentes reutilizables.
- Vite: Herramienta de construcción y entorno de desarrollo.
- React Router: Gestión de la navegación interna de la aplicación.

## Funcionalidades Implementadas

### Gestión de Usuarios
- Registro con selección obligatoria de suscripción (Plan Básico, Plan Plus o Plan Premium).
- Autenticación segura y panel de control para edición de perfil.

### Sistema de Reservas
- Visualización de calendario de clases con filtros por tipo de actividad.
- Control de aforos automatizado que impide reservas si el cupo está completo.
- Cancelación de plazas con liberación inmediata de cupo en tiempo real.

### Panel de Administración
- Herramientas CRUD para la gestión de la oferta horaria (Crear, Editar, Eliminar clases).
- Gestión de monitores y asignación de tareas en el calendario.

---
Autor: Juan Daniel Suárez Cabal
Proyecto Final de Grado - 2026
