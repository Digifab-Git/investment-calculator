import React from 'react';

export default function InvestmentCalculator() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'system-ui'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
        ✅ TEST RÉUSSI
      </h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '40px' }}>
        Si vous voyez ce message, React fonctionne !
      </p>
      <div style={{
        padding: '30px',
        background: 'rgba(16, 185, 129, 0.2)',
        borderRadius: '20px',
        border: '2px solid #10b981'
      }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
          📁 Fichiers chargés correctement
        </p>
        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
          ⚛️ React render OK
        </p>
        <p style={{ fontSize: '1.2rem' }}>
          🎨 Styles appliqués
        </p>
      </div>
    </div>
  );
}
