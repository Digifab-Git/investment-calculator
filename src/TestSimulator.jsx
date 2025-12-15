import React from 'react';

export default function TestSimulator({ onBack, darkMode, theme }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: theme?.bg || 'linear-gradient(135deg, #0f172a, #1e293b)',
      color: theme?.text || 'white',
      padding: '50px',
      fontFamily: 'system-ui'
    }}>
      <button
        onClick={onBack}
        style={{
          padding: '12px 24px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          fontSize: '1rem',
          cursor: 'pointer',
          marginBottom: '30px'
        }}
      >
        ← Retour
      </button>

      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
          ✅ TEST SIMULATEUR RÉUSSI !
        </h1>
        <p style={{ fontSize: '1.5rem', opacity: 0.8 }}>
          Si vous voyez ce message, la navigation fonctionne !
        </p>
        <p style={{ fontSize: '1.2rem', marginTop: '30px', opacity: 0.6 }}>
          Le problème vient donc de GroupSimulator.jsx
        </p>
      </div>
    </div>
  );
}
