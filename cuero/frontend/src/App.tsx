import React from 'react';

export default function App() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, sans-serif', 
      textAlign: 'center',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
      color: '#333'
    }}>
      <h1 style={{ color: '#8b5a2b' }}>✨ ¡Taller de Cuero Levantado! ✨</h1>
      <p style={{ fontSize: '18px' }}>Si estás viendo este mensaje, tu servidor React y Vite están configurados al 100%.</p>
      
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        background: '#fff', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        display: 'inline-block' 
      }}>
        <p>🟢 <strong>Backend:</strong> Conectado exitosamente en el puerto 5000</p>
        <p>🟢 <strong>Base de datos:</strong> MongoDB Atlas ("tienda-cuero") activa</p>
      </div>
    </div>
  );
}