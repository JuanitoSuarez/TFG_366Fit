import React, { useState, useEffect } from 'react';
import logoOficial from './assets/logo366fit.png'; 

// Añadimos 'rol' a las props para saber si mostrar el panel admin
function Dashboard({ usuario, rol, onLogout }) {
  const [vistaActual, setVistaActual] = useState('inicio');
  const [clases, setClases] = useState([]);
  const [misReservas, setMisReservas] = useState([]);
  const [planUsuario, setPlanUsuario] = useState('Cargando...'); 
  const [estaCargando, setEstaCargando] = useState(false);

  // Estados para el formulario de Administrador
  const [nuevaClase, setNuevaClase] = useState({ nombre: '', monitor: '', fechaHora: '', aforoMaximo: 20 });

  const emailLimpio = usuario.trim().toLowerCase();

  // --- FUNCIONES DE CARGA ---
  const cargarClases = () => {
    fetch('https://localhost:7044/api/Clases')
      .then(res => res.json())
      .then(data => setClases(data))
      .catch(err => console.error("Error al traer las clases:", err));
  };

  const cargarMisReservas = () => {
    fetch(`https://localhost:7044/api/Reservas/mis-reservas?email=${encodeURIComponent(emailLimpio)}`)
      .then(res => res.json())
      .then(data => setMisReservas(data))
      .catch(err => console.error("Error al traer mis reservas:", err));
  };

  const cargarPlanReal = () => {
    fetch(`https://localhost:7044/api/Suscripciones/plan?email=${encodeURIComponent(emailLimpio)}`)
      .then(res => res.json())
      .then(data => setPlanUsuario(data.plan))
      .catch(err => console.error("Error al cargar plan:", err));
  };

  useEffect(() => {
    cargarClases();
    cargarPlanReal();
  }, []);

  useEffect(() => {
    if (vistaActual === 'reservas') cargarMisReservas();
    if (vistaActual === 'suscripcion') cargarPlanReal();
  }, [vistaActual]);


  // --- ACCIONES ADMIN ---
  const crearClase = async (e) => {
    e.preventDefault();
    setEstaCargando(true);
    try {
      const res = await fetch('https://localhost:7044/api/Clases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaClase)
      });
      if (res.ok) {
        alert("✅ Clase creada y publicada correctamente.");
        setNuevaClase({ nombre: '', monitor: '', fechaHora: '', aforoMaximo: 20 });
        setVistaActual('clases');
        cargarClases();
      }
    } catch (err) { alert("❌ Error al crear la clase."); }
    setEstaCargando(false);
  };

  const eliminarClase = async (id) => {
  if (!window.confirm("¿Estás seguro de borrar esta clase? Se eliminarán también las reservas de los alumnos.")) return;
  
  try {
    const res = await fetch(`https://localhost:7044/api/Clases/${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert("🗑️ Clase eliminada.");
      cargarClases(); // Refrescamos la lista
    }
  } catch (err) {
    alert("❌ No se pudo eliminar la clase.");
  }
};


  // --- ACCIONES USUARIO ---
  const reservarPlaza = async (claseId) => {
    setEstaCargando(true);
    try {
      const res = await fetch('https://localhost:7044/api/Reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claseId, usuarioEmail: usuario })
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ " + data.mensaje);
        cargarClases();
      } else {
        alert("⚠️ " + data.mensaje);
      }
    } catch (err) { alert("❌ Error al conectar con el servidor."); }
    setEstaCargando(false);
  };

  const cancelarReserva = async (reservaId) => {
    if (!window.confirm("¿Estás seguro de que quieres cancelar esta clase? Perderás tu plaza.")) return;
    setEstaCargando(true);
    try {
      const res = await fetch(`https://localhost:7044/api/Reservas/${reservaId}`, { method: 'DELETE' });
      if (res.ok) {
        alert("✅ Reserva cancelada con éxito.");
        cargarMisReservas();
        cargarClases();
      }
    } catch (err) { alert("❌ Error al intentar cancelar."); }
    setEstaCargando(false);
  };

  const mejorarPlan = async (nuevoPlan) => {
    setEstaCargando(true);
    try {
      const res = await fetch('https://localhost:7044/api/Suscripciones/actualizar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLimpio, nuevoPlan: nuevoPlan })
      });
      const data = await res.json();
      if (res.ok) {
        alert("🎉 " + data.mensaje);
        setPlanUsuario(nuevoPlan);
      }
    } catch (err) { alert("❌ Error al actualizar la suscripción."); }
    setEstaCargando(false);
  };


  // --- ESTILOS REUTILIZABLES ---
  const getBtnStyle = (nombreVista) => ({
    padding: '15px 20px', 
    background: vistaActual === nombreVista ? 'rgba(255,255,255,0.2)' : 'transparent', 
    color: 'white', border: 'none', textAlign: 'left', fontSize: '1.1rem', cursor: 'pointer',
    borderBottom: '1px solid rgba(255,255,255,0.1)', width: '100%', fontFamily: 'inherit',
    fontWeight: vistaActual === nombreVista ? 'bold' : 'normal', transition: 'background 0.3s'
  });

  const renderizarVista = () => {
    if (vistaActual === 'inicio') return (
      <div>
        <h1 style={{ color: '#333', fontSize: '2.5rem', margin: '0 0 10px 0' }}>¡Hora de tu próximo reto, {usuario}!</h1>
        <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '40px' }}>Este es tu panel de control para hoy.</p>
        <div style={{ padding: '30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '5px solid #004aad', maxWidth: '500px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#004aad' }}>Resumen de Actividad</h3>
          <p style={{ color: '#555' }}>Consulta tus clases o gestiona tu suscripción en el menú lateral.</p>
        </div>
      </div>
    );

    if (vistaActual === 'clases') return (
      <div>
        <h2 style={{ color: '#004aad', borderBottom: '2px solid #004aad', paddingBottom: '10px', display: 'inline-block' }}>Horario de Clases Disponibles</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {clases.map(c => {
            const fecha = new Date(c.fechaHora).toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
            return (
              <div key={c.id} style={{ padding: '25px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '5px solid #004aad' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '1.4rem' }}>{c.nombre}</h3>
                <p><strong>Monitor:</strong> {c.monitor}</p>
                <p style={{ textTransform: 'capitalize' }}><strong>Cuándo:</strong> {fecha}</p>
                <p><strong>Plazas:</strong> {c.aforoMaximo - c.plazasOcupadas} libres</p>
                <button 
                  onClick={() => reservarPlaza(c.id)} 
                  disabled={estaCargando}
                  style={{ marginTop: '15px', width: '100%', padding: '10px', backgroundColor: estaCargando ? '#ccc' : '#004aad', color: 'white', border: 'none', borderRadius: '6px', cursor: estaCargando ? 'default' : 'pointer', fontWeight: 'bold' }}
                >
                  {estaCargando ? 'Procesando...' : 'Reservar Plaza'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );

    if (vistaActual === 'reservas') return (
      <div>
        <h2 style={{ color: '#004aad', borderBottom: '2px solid #004aad', paddingBottom: '10px', display: 'inline-block' }}>Mis Clases Programadas</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {misReservas.length === 0 ? <p style={{ color: '#888' }}>Aún no te has apuntado a ninguna clase.</p> : misReservas.map(r => (
            <div key={r.reservaId} style={{ padding: '25px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '5px solid #28a745' }}>
              <h3 style={{ margin: '0', color: '#333' }}>{r.claseNombre}</h3>
              <p><strong>Monitor:</strong> {r.monitor}</p>
              <p><strong>Fecha:</strong> {new Date(r.fechaHora).toLocaleString()}</p>
              <p style={{ color: '#28a745', fontWeight: 'bold', margin: '10px 0' }}>✓ Reserva Confirmada</p>
              <button 
                onClick={() => cancelarReserva(r.reservaId)} 
                disabled={estaCargando}
                style={{ marginTop: '10px', width: '100%', padding: '10px', backgroundColor: estaCargando ? '#ccc' : '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: estaCargando ? 'default' : 'pointer', fontWeight: 'bold' }}
              >
                {estaCargando ? 'Cancelando...' : 'Cancelar Reserva'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );

    if (vistaActual === 'suscripcion') {
      const planes = [
        { nombre: '366Fit Basic', precio: '19.99€', color: '#6c757d', features: ['Acceso a sala de máquinas', 'Vestuarios', 'App móvil básica'] },
        { nombre: '366Fit Plus', precio: '29.99€', color: '#004aad', features: ['Todo lo de Basic', 'Clases dirigidas ilimitadas', '1 Sesión con monitor/mes'] },
        { nombre: '366Fit Premium', precio: '44.99€', color: '#f39c12', features: ['Todo lo de Plus', 'Acceso Spa & Sauna', 'Nutrición personalizada', 'Toallas incluidas'] }
      ];
      return (
        <div>
          <h2 style={{ color: '#004aad', borderBottom: '2px solid #004aad', paddingBottom: '10px', display: 'inline-block' }}>Gestión de Suscripción</h2>
          <div style={{ marginTop: '20px', padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ddd' }}>
            <div>
              <p style={{ margin: 0, color: '#888', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>Estado de tu cuenta</p>
              <h3 style={{ margin: '5px 0', fontSize: '1.8rem', color: '#333' }}>{planUsuario}</h3>
              <p style={{ margin: 0, color: '#28a745', fontWeight: 'bold' }}>● Socio Activo - Próximo cobro: 01/06/2026</p>
            </div>
            <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold' }}>Plan Actual</span>
          </div>
          <h3 style={{ marginTop: '40px', color: '#333' }}>Mejora o cambia tu plan</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {planes.map(p => (
              <div key={p.nombre} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '25px', border: planUsuario === p.nombre ? `3px solid ${p.color}` : '1px solid #eee', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', textAlign: 'center', position: 'relative' }}>
                {planUsuario === p.nombre && <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: p.color, color: 'white', padding: '2px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold' }}>TU PLAN</span>}
                <h4 style={{ color: p.color }}>{p.nombre}</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '15px 0' }}>{p.precio}<span style={{ fontSize: '1rem', color: '#888' }}>/mes</span></p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0', textAlign: 'left', minHeight: '120px' }}>
                  {p.features.map(f => <li key={f} style={{ marginBottom: '8px', color: '#555', fontSize: '0.9rem' }}>✓ {f}</li>)}
                </ul>
                <button 
                  onClick={() => mejorarPlan(p.nombre)} 
                  disabled={estaCargando || planUsuario === p.nombre} 
                  style={{ width: '100%', padding: '12px', backgroundColor: (estaCargando || planUsuario === p.nombre) ? '#ccc' : p.color, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: (estaCargando || planUsuario === p.nombre) ? 'default' : 'pointer' }}
                >
                  {estaCargando ? 'Procesando...' : (planUsuario === p.nombre ? 'Seleccionado' : 'Elegir Plan')}
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

  // --- NUEVA VISTA: PANEL ADMIN ---
    if (vistaActual === 'admin') return (
      <div>
        <h2 style={{ color: '#f39c12', borderBottom: '2px solid #f39c12', paddingBottom: '10px', display: 'inline-block' }}>Panel de Gestión Administrativa</h2>
        
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginTop: '20px' }}>
          
          {/* Formulario de Creación */}
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', flex: '1', minWidth: '350px', maxWidth: '500px' }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Publicar Nueva Clase</h3>
            <form onSubmit={crearClase} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Nombre de la Clase</label>
                <input type="text" placeholder="Ej: Pilates, CrossFit..." value={nuevaClase.nombre} onChange={e => setNuevaClase({...nuevaClase, nombre: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Monitor / Instructor</label>
                <input type="text" placeholder="Nombre del profesional" value={nuevaClase.monitor} onChange={e => setNuevaClase({...nuevaClase, monitor: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Fecha y Hora</label>
                <input type="datetime-local" value={nuevaClase.fechaHora} onChange={e => setNuevaClase({...nuevaClase, fechaHora: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Aforo Máximo</label>
                <input type="number" value={nuevaClase.aforoMaximo} onChange={e => setNuevaClase({...nuevaClase, aforoMaximo: parseInt(e.target.value)})} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>
              <button type="submit" disabled={estaCargando} style={{ marginTop: '10px', padding: '15px', backgroundColor: estaCargando ? '#ccc' : '#f39c12', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                {estaCargando ? 'Publicando...' : 'Crear Clase Ahora'}
              </button>
            </form>
          </div>

          {/* Listado de Gestión para Borrar */}
          <div style={{ flex: '1', minWidth: '350px' }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Gestión de Horario Actual</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              {clases.length === 0 ? (
                <p style={{ color: '#888' }}>No hay clases programadas para eliminar.</p>
              ) : (
                clases.map(c => (
                  <div key={c.id} style={{ 
                    padding: '20px', 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderLeft: '5px solid #f39c12' 
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{c.nombre}</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                        {new Date(c.fechaHora).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })} | {c.monitor}
                      </p>
                    </div>
                    <button 
                      onClick={() => eliminarClase(c.id)}
                      style={{ 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        padding: '10px 15px', 
                        borderRadius: '6px', 
                        cursor: 'pointer', 
                        fontWeight: 'bold',
                        fontSize: '0.8rem'
                      }}
                    >
                      ELIMINAR
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      <div style={{ width: '260px', backgroundColor: '#004aad', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '2px solid rgba(255,255,255,0.2)' }}>
          <img src={logoOficial} alt="Logo" style={{ width: '100%', maxWidth: '180px' }} />
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, marginTop: '10px' }}>
          <button onClick={() => setVistaActual('inicio')} style={getBtnStyle('inicio')}>Inicio</button>
          <button onClick={() => setVistaActual('clases')} style={getBtnStyle('clases')}>Clases</button>
          <button onClick={() => setVistaActual('reservas')} style={getBtnStyle('reservas')}>Mis Reservas</button>
          <button onClick={() => setVistaActual('suscripcion')} style={getBtnStyle('suscripcion')}>Suscripción</button>
          
          {/* BOTÓN DINÁMICO: Solo si el rol es admin */}
          {rol && rol.toLowerCase().trim() === 'admin' && (
            <button 
              onClick={() => setVistaActual('admin')} 
              style={{ ...getBtnStyle('admin'), color: '#f39c12', borderLeft: '5px solid #f39c12', marginTop: '20px', fontWeight: 'bold' }}
            >
              PANEL ADMIN
            </button>
          )}
        </nav>
        <button onClick={onLogout} style={{ padding: '20px', backgroundColor: '#002a5c', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar Sesión</button>
      </div>
      <div style={{ flex: 1, backgroundColor: '#f4f7f6', padding: '50px', overflowY: 'auto' }}>
        {renderizarVista()}
      </div>
    </div>
  );
}

export default Dashboard;