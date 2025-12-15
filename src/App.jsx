import React, { useState } from 'react';

export default function InvestmentCalculator() {
  const [darkMode, setDarkMode] = useState(true);

  const theme = darkMode ? {
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    cardBg: 'rgba(30, 41, 59, 0.8)',
    text: '#f1f5f9',
    textSecondary: '#94a3b8'
  } : {
    bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    text: '#0f172a',
    textSecondary: '#475569'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      padding: '40px 20px',
      fontFamily: 'system-ui',
      color: theme.text
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px'
          }}>
            Investment Calculator
          </h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              background: theme.cardBg,
              color: theme.text,
              fontSize: '1.2rem',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div style={{
          background: theme.cardBg,
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
            ✅ TEST SANS GROUPSIMULATOR
          </h2>
          <p style={{ fontSize: '1.1rem', color: theme.textSecondary }}>
            Si vous voyez ce message, le problème vient de GroupSimulator.jsx
          </p>
        </div>
      </div>
    </div>
  );
}
