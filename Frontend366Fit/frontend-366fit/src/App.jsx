import React, { useState } from 'react';
import AuthView from './AuthView';
import Dashboard from './Dashboard'; 
import logoOficial from './assets/logo366fit.png';

function App() {
  // Estados para controlar la sesión
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [rolUsuario, setRolUsuario] = useState(null);

  // Esta función es la que recibe los datos desde AuthView tras el login exitoso
  const manejarLogin = (email, rol) => {
    setUsuarioLogueado(email);
    // Si por algún motivo el rol llega nulo, le asignamos 'cliente' por defecto
    setRolUsuario(rol || 'cliente');
  };

  // Limpiamos todo al cerrar sesión
  const manejarLogout = () => {
    setUsuarioLogueado(null);
    setRolUsuario(null);
  };

  // VISTA 1: Si el usuario está dentro, cargamos el Dashboard con sus permisos
  if (usuarioLogueado) {
    return (
      <Dashboard 
        usuario={usuarioLogueado} 
        rol={rolUsuario} 
        onLogout={manejarLogout} 
      />
    );
  }

  // VISTA 2: Si no hay login, mostramos la pantalla de acceso
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* Lado izquierdo: Logo */}
      <div style={{ flex: 1, backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px' }}>
        <img src={logoOficial} alt="Logo 366Fit" style={{ width: '100%', maxWidth: '500px', height: 'auto' }} />
      </div>

      {/* Lado derecho: Formulario de Auth */}
      <div style={{ flex: 1, backgroundColor: '#004aad', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* AuthView ahora envía email y rol a nuestra función manejarLogin */}
        <AuthView onLoginExitoso={(email, rol) => manejarLogin(email, rol)} />
      </div>

    </div>
  );
}

export default App;