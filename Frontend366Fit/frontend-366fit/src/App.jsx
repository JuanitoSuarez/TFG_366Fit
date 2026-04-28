import React, { useState } from 'react';
import AuthView from './AuthView';
import Dashboard from './Dashboard'; 
import logoOficial from './assets/logo366fit.png';

function App() {
  // Estados para controlar la sesión
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [rolUsuario, setRolUsuario] = useState(null);
  const [planUsuario, setPlanUsuario] = useState(null); // Nuevo estado para el Plan

  // Recibimos email, rol y el nuevo campo PLAN desde AuthView
  const manejarLogin = (email, rol, plan) => {
    setUsuarioLogueado(email);
    setRolUsuario(rol || 'cliente');
    setPlanUsuario(plan || 'Básico'); // Guardamos el plan (Básico por defecto si falla algo)
  };

  // Limpiamos todo al cerrar sesión
  const manejarLogout = () => {
    setUsuarioLogueado(null);
    setRolUsuario(null);
    setPlanUsuario(null);
  };

  // VISTA 1: Usuario autenticado
  if (usuarioLogueado) {
    return (
      <Dashboard 
        usuario={usuarioLogueado} 
        rol={rolUsuario} 
        plan={planUsuario} // Pasamos el plan al Dashboard por si lo necesitas mostrar
        onLogout={manejarLogout} 
      />
    );
  }

  // VISTA 2: Pantalla de acceso (Login/Registro)
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* Lado izquierdo: Identidad Visual (Pág. 13 de la memoria) */}
      <div style={{ flex: 1, backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px' }}>
        <img src={logoOficial} alt="Logo 366Fit" style={{ width: '100%', maxWidth: '500px', height: 'auto' }} />
      </div>

      {/* Lado derecho: Formulario de Auth (Azul corporativo #29B6F6) */}
      <div style={{ flex: 1, backgroundColor: '#29B6F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Ahora AuthView envía tres parámetros: email, rol y plan */}
        <AuthView onLoginExitoso={(email, rol, plan) => manejarLogin(email, rol, plan)} />
      </div>

    </div>
  );
}

export default App;