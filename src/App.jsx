import React, { useState } from 'react';
import GroupSimulator from './GroupSimulator';

export default function InvestmentCalculator() {
  const [showGroupSimulator, setShowGroupSimulator] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const funds = [
    { name: 'Technology Fund', rateIncome: 0.005, rateGrowth: 0.0055, minimum: 500, duration: 12, color: '#f59e0b', icon: '💻' },
    { name: 'Energy Fund', rateIncome: 0.006, rateGrowth: 0.0065, minimum: 10000, duration: 10, color: '#10b981', icon: '⚡' }
  ];

  const theme = darkMode ? {
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    cardBg: 'rgba(30, 41, 59, 0.8)',
    cardBorder: 'rgba(148, 163, 184, 0.1)',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    inputBg: 'rgba(15, 23, 42, 0.6)',
    hoverBg: 'rgba(148, 163, 184, 0.08)',
    gridStroke: 'rgba(148, 163, 184, 0.1)',
    tooltipBg: 'rgba(15, 23, 42, 0.95)',
    shadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
  } : {
    bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(203, 213, 225, 0.4)',
    text: '#0f172a',
    textSecondary: '#475569',
    inputBg: 'rgba(248, 250, 252, 0.8)',
    hoverBg: 'rgba(148, 163, 184, 0.1)',
    gridStroke: 'rgba(148, 163, 184, 0.3)',
    tooltipBg: 'rgba(255, 255, 255, 0.98)',
    shadow: '0 20px 60px rgba(0, 0, 0, 0.08)'
  };

  if (showGroupSimulator) {
    return (
      <GroupSimulator
        funds={funds}
        darkMode={darkMode}
        onBack={() => setShowGroupSimulator(false)}
        theme={theme}
      />
    );
  }

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
              border: `2px solid ${theme.cardBorder}`,
              background: theme.cardBg,
              color: theme.text,
              fontSize: '1.2rem',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          <button
            onClick={() => setShowGroupSimulator(true)}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: '2px solid rgba(236, 72, 153, 0.5)',
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.15))',
              color: '#ec4899',
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontWeight: '700'
            }}
          >
            👥 Simulateur de Groupe ✨
          </button>
        </div>

        <div style={{
          background: theme.cardBg,
          padding: '40px',
          borderRadius: '20px',
          border: `1px solid ${theme.cardBorder}`,
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
            ✅ ÉTAPE 1 RÉUSSIE
          </h2>
          <p style={{ fontSize: '1.1rem', color: theme.textSecondary }}>
            Interface de base + Mode sombre/clair + Bouton simulateur
          </p>
          <p style={{ marginTop: '20px', fontSize: '0.9rem', color: theme.textSecondary }}>
            Si vous voyez ce message, testez le bouton "Simulateur de Groupe"
          </p>
        </div>
      </div>
    </div>
  );
}
