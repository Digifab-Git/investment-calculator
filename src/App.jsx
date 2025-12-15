import React, { useState, useEffect } from 'react';

export default function InvestmentCalculator() {
  const funds = [
    { name: 'Technology Fund', rateIncome: 0.005, rateGrowth: 0.0055, minimum: 500, duration: 12, icon: '💻' },
    { name: 'Energy Fund', rateIncome: 0.006, rateGrowth: 0.0065, minimum: 10000, duration: 10, icon: '⚡' },
    { name: 'Health Fund', rateIncome: 0.008, rateGrowth: 0.0085, minimum: 100000, duration: 10, icon: '💊' },
    { name: 'Emerging Markets', rateIncome: 0.009, rateGrowth: 0.010, minimum: 250000, duration: 10, icon: '🌍' },
    { name: 'International Fund', rateIncome: 0.012, rateGrowth: 0.0125, minimum: 500000, duration: 10, icon: '🌟' }
  ];

  const [selectedFund, setSelectedFund] = useState(funds[0]);
  const [amount, setAmount] = useState(500);
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState('main');

  const theme = darkMode ? {
    bg: 'linear-gradient(135deg, #0f172a, #1e293b)',
    cardBg: 'rgba(30, 41, 59, 0.8)',
    text: '#f1f5f9',
    textSec: '#94a3b8'
  } : {
    bg: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    text: '#0f172a',
    textSec: '#475569'
  };

  useEffect(() => {
    setAmount(selectedFund.minimum);
  }, [selectedFund]);

  const workingDays = Math.round(selectedFund.duration * 21.4);
  const compoundView = amount * Math.pow(1 + selectedFund.rateGrowth, workingDays);
  const compoundGain = compoundView - amount;
  const roi = ((compoundView - amount) / amount) * 100;

  const formatCurrency = (val) => `$${Math.round(val).toLocaleString()}`;
  const formatPercent = (val) => `${val.toFixed(2)}%`;

  if (currentView === 'group') {
    const totalInv = 1000;
    const totalGains = totalInv * Math.pow(1 + selectedFund.rateGrowth, workingDays) - totalInv;
    
    return (
      <div style={{ minHeight: '100vh', background: theme.bg, padding: '40px 20px', color: theme.text, fontFamily: 'system-ui' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={() => setCurrentView('main')} style={{ padding: '12px 24px', borderRadius: '12px', background: theme.cardBg, color: theme.text, border: 'none', cursor: 'pointer', marginBottom: '30px', fontSize: '1rem', fontWeight: '600' }}>
            ← Retour
          </button>
          
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '30px' }}>
            👥 Simulateur de Groupe
          </h1>

          <div style={{ background: theme.cardBg, borderRadius: '20px', padding: '30px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>📊 Résumé</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '20px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.9rem', color: theme.textSec, marginBottom: '8px' }}>💰 Total Investi</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#a78bfa' }}>{formatCurrency(totalInv)}</div>
              </div>
              <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.9rem', color: theme.textSec, marginBottom: '8px' }}>🎯 Gains</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>{formatCurrency(totalGains)}</div>
              </div>
              <div style={{ padding: '20px', background: 'rgba(236, 72, 153, 0.15)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.9rem', color: theme.textSec, marginBottom: '8px' }}>🚀 Final</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ec4899' }}>{formatCurrency(totalInv + totalGains)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, padding: '40px 20px', color: theme.text, fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '20px' }}>
            Investment Calculator
          </h1>
          <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '10px 20px', borderRadius: '10px', background: theme.cardBg, color: theme.text, border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <button onClick={() => setCurrentView('group')} style={{ padding: '12px 24px', borderRadius: '12px', border: '2px solid #ec4899', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.15))', color: '#ec4899', fontSize: '1rem', cursor: 'pointer', fontWeight: '700', marginBottom: '30px' }}>
          👥 Simulateur de Groupe
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ background: theme.cardBg, borderRadius: '20px', padding: '30px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>🏦 Fonds</h2>
            <select value={selectedFund.name} onChange={(e) => setSelectedFund(funds.find(f => f.name === e.target.value))} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', color: theme.text, border: 'none', fontSize: '1rem', cursor: 'pointer' }}>
              {funds.map(f => <option key={f.name} value={f.name}>{f.icon} {f.name}</option>)}
            </select>
          </div>

          <div style={{ background: theme.cardBg, borderRadius: '20px', padding: '30px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>💰 Montant</h2>
            <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', marginBottom: '15px' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#a78bfa' }}>{formatCurrency(amount)}</div>
            </div>
            <input type="range" min={selectedFund.minimum} max={500000} step={1000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={{ width: '100%', marginBottom: '15px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              <button onClick={() => setAmount(Math.max(selectedFund.minimum, amount - 10000))} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: theme.text, border: 'none', cursor: 'pointer', fontWeight: '700' }}>−10K</button>
              <button onClick={() => setAmount(Math.max(selectedFund.minimum, amount - 1000))} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: theme.text, border: 'none', cursor: 'pointer', fontWeight: '700' }}>−1K</button>
              <button onClick={() => setAmount(Math.min(500000, amount + 1000))} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: 'none', cursor: 'pointer', fontWeight: '700' }}>+1K</button>
              <button onClick={() => setAmount(Math.min(500000, amount + 10000))} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: 'none', cursor: 'pointer', fontWeight: '700' }}>+10K</button>
            </div>
          </div>

          <div style={{ background: theme.cardBg, borderRadius: '20px', padding: '30px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>📊 Résultat</h2>
            <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '12px', marginBottom: '15px' }}>
              <div style={{ fontSize: '0.9rem', color: theme.textSec, marginBottom: '8px' }}>Capital Final</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>{formatCurrency(compoundView)}</div>
              <div style={{ fontSize: '0.9rem', color: '#10b981', marginTop: '5px' }}>+{formatCurrency(compoundGain)}</div>
            </div>
            <div style={{ padding: '15px', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#c4b5fd', marginBottom: '5px' }}>ROI</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#a78bfa' }}>+{formatPercent(roi)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
