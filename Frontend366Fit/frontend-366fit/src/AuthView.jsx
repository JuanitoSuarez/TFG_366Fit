import React, { useState } from 'react';
import axios from 'axios';

export default function AuthView({ onLoginExitoso }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [plan, setPlan] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Definición de planes
  const planesDisponibles = [
    { nombre: '366Fit Basic', color: '#b6e8ff' },
    { nombre: '366Fit Plus', color: '#94ddff' },
    { nombre: '366Fit Premium', color: '#b0ddff' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(''); 

    // Obliga a elegir plan en el registro
    if (!isLogin && !plan) {
      setMensaje("Error: Debes seleccionar un plan de suscripción.");
      return;
    }

    try {
      if (isLogin) {
        // Petición de Login
        const response = await axios.post('https://localhost:7044/api/auth/login', { email, password });
        setMensaje(response.data.mensaje);
        
        setTimeout(() => {
          onLoginExitoso(response.data.email, response.data.rol); 
        }, 1000);
        
      } else {
        // Petición de registro
        const response = await axios.post('https://localhost:7044/api/auth/register', { 
          nombre_completo: nombre, 
          email, 
          password,
          plan: plan
        });
        setMensaje(response.data.mensaje || response.data);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.mensaje || error.response?.data || "Error de conexión con el servidor";
      setMensaje(errorMsg);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '450px', padding: '40px', fontFamily: 'sans-serif' }}>
      
      <h2 style={{ color: 'black', fontSize: '2.5rem', marginBottom: '30px', textAlign: 'left', fontWeight: '800' }}>
        {isLogin ? 'INICIAR SESIÓN' : 'REGISTRARSE'}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        {!isLogin && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'black', fontWeight: 'bold' }}>Nombre completo</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required 
                style={{ padding: '15px', borderRadius: '5px', fontSize: '1rem', border: '1px solid #ccc' }}/>
            </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ color: 'black', fontWeight: 'bold' }}>Selecciona tu Plan</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {planesDisponibles.map((p) => (
                  <div 
                    key={p.nombre}
                    onClick={() => setPlan(p.nombre)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      textAlign: 'center',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      border: plan === p.nombre ? `3px solid ${p.color}` : '1px solid #ccc',
                      backgroundColor: plan === p.nombre ? '#f0f9ff' : 'white',
                      transition: '0.3s'
                    }}
                  >
                    {p.nombre.replace('366Fit ', '')}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: 'black', fontWeight: 'bold' }}>Correo</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required 
            style={{ padding: '15px', borderRadius: '5px', fontSize: '1rem', border: '1px solid #ccc' }}/>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: 'black', fontWeight: 'bold' }}>Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required 
            style={{ padding: '15px', borderRadius: '5px', fontSize: '1rem', border: '1px solid #ccc' }}/>
        </div>

        <button type="submit" style={{ 
          padding: '18px', 
          background: '#1c7097',
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer', 
          fontWeight: 'bold', 
          fontSize: '1.2rem',
          marginTop: '10px'
        }}>
          {isLogin ? 'INICIAR SESIÓN' : 'REGISTRARSE'}
        </button>
      </form>

      {mensaje && (
        <p style={{ 
          color: mensaje.toLowerCase().includes('error') || mensaje.toLowerCase().includes('incorrecta') || mensaje.toLowerCase().includes('no existe') 
            ? '#d93025' 
            : '#1e8e3e', 
          marginTop: '20px', 
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {mensaje}
        </p>
      )}

      <button onClick={() => { setIsLogin(!isLogin); setMensaje(''); setPlan(''); }} 
        style={{ marginTop: '20px', background: 'none', border: 'none', color: 'black', textDecoration: 'underline', cursor: 'pointer', opacity: '0.8' }}>
        {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </div>
  );
}