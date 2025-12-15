import React, { useState, useEffect, useRef } from 'react';

export default function InvestmentCalculator() {
  const funds = [
    { name: 'Technology Opportunities Fund', rateIncome: 0.005, rateGrowth: 0.0055, minimum: 500, duration: 12, icon: '💻' },
    { name: 'Energy and Natural Resources Fund', rateIncome: 0.006, rateGrowth: 0.0065, minimum: 10000, duration: 10, icon: '⚡' },
    { name: 'Health Sciences Opportunities Fund', rateIncome: 0.008, rateGrowth: 0.0085, minimum: 100000, duration: 10, icon: '💊' },
    { name: 'Fonds pour les Marchés Émergents', rateIncome: 0.009, rateGrowth: 0.010, minimum: 250000, duration: 10, icon: '🌍' },
    { name: 'Fonds International LGMCORP', rateIncome: 0.012, rateGrowth: 0.0125, minimum: 500000, duration: 10, icon: '🌟' }
  ];

  const [selectedFund, setSelectedFund] = useState(funds[0]);
  const [amount, setAmount] = useState(selectedFund.minimum);
  const [darkMode, setDarkMode] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [compareWith, setCompareWith] = useState(funds[1]);
  const [showGoalMode, setShowGoalMode] = useState(false);
  const [targetGain, setTargetGain] = useState(50000);
  const [savedSimulations, setSavedSimulations] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentView, setCurrentView] = useState('main');
  
  const isInitialMount = useRef(true);

  const theme = darkMode ? {
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    cardBg: 'rgba(30, 41, 59, 0.8)',
    cardBorder: 'rgba(148, 163, 184, 0.1)',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    inputBg: 'rgba(15, 23, 42, 0.6)',
    hoverBg: 'rgba(148, 163, 184, 0.08)',
    shadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
  } : {
    bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(203, 213, 225, 0.4)',
    text: '#0f172a',
    textSecondary: '#475569',
    inputBg: 'rgba(248, 250, 252, 0.8)',
    hoverBg: 'rgba(148, 163, 184, 0.1)',
    shadow: '0 20px 60px rgba(0, 0, 0, 0.08)'
  };

  useEffect(() => {
    setAmount(selectedFund.minimum);
  }, [selectedFund]);
  
  const calculateWorkingDays = (months) => Math.round(months * 21.4);
  
  const workingDays = calculateWorkingDays(selectedFund.duration);
  const maxAmount = Math.max(500000, selectedFund.minimum * 2);
  
  const dailyGainIncome = amount * selectedFund.rateIncome;
  const dailyGainGrowth = amount * selectedFund.rateGrowth;
  const incomeView = amount + (dailyGainIncome * workingDays);
  const growthView = amount + (dailyGainGrowth * workingDays);
  const compoundView = amount * Math.pow(1 + selectedFund.rateGrowth, workingDays);
  const incomeGain = incomeView - amount;
  const growthGain = growthView - amount;
  const compoundGain = compoundView - amount;
  const roi = ((compoundView - amount) / amount) * 100;
  const isValid = amount >= selectedFund.minimum;

  const compareWorkingDays = Math.round(compareWith.duration * 30 * 5 / 7);
  const compareCompoundView = amount * Math.pow(1 + compareWith.rateGrowth, compareWorkingDays);
  const compareRoi = ((compareCompoundView - amount) / amount) * 100;

  const calculateRequiredInvestment = () => {
    return Math.ceil(targetGain / (Math.pow(1 + selectedFund.rateGrowth, workingDays) - 1));
  };

  const saveSimulation = () => {
    const newSim = {
      id: Date.now(),
      date: new Date().toLocaleString('fr-FR'),
      fund: selectedFund.name,
      amount: amount,
      gain: compoundGain,
      roi: roi
    };
    const updated = [newSim, ...savedSimulations].slice(0, 10);
    setSavedSimulations(updated);
    localStorage.setItem('simulationHistory', JSON.stringify(updated));
    alert('✅ Simulation sauvegardée !');
  };

  const deleteSimulation = (id) => {
    const updated = savedSimulations.filter(s => s.id !== id);
    setSavedSimulations(updated);
    localStorage.setItem('simulationHistory', JSON.stringify(updated));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value) => `${value.toFixed(2)}%`;

  const Card = ({ children }) => (
    <div style={{
      background: theme.cardBg,
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '30px',
      border: `1px solid ${theme.cardBorder}`,
      boxShadow: theme.shadow,
      marginBottom: '20px'
    }}>
      {children}
    </div>
  );

  // SIMULATEUR DE GROUPE
  if (currentView === 'group') {
    const [groupMembers] = useState([
      { id: 1, name: 'Personne A', amount: selectedFund.minimum },
      { id: 2, name: 'Personne B', amount: selectedFund.minimum }
    ]);

    const totalInvestment = groupMembers.reduce((sum, m) => sum + m.amount, 0);
    const groupFinalCapital = totalInvestment * Math.pow(1 + selectedFund.rateGrowth, workingDays);
    const totalGains = groupFinalCapital - totalInvestment;

    return (
      <div style={{
        minHeight: '100vh',
        background: theme.bg,
        padding: '40px 20px',
        fontFamily: 'system-ui',
        color: theme.text
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <button
            onClick={() => setCurrentView('main')}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: theme.cardBg,
              color: theme.text,
              fontSize: '1rem',
              cursor: 'pointer',
              marginBottom: '20px',
              fontWeight: '600',
              border: `2px solid ${theme.cardBorder}`
            }}
          >
            ← Retour
          </button>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            👥 Simulateur de Groupe
          </h1>
          <p style={{ fontSize: '1.1rem', color: theme.textSecondary, marginBottom: '30px' }}>
            Investissement collectif
          </p>

          <Card>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
              🏦 Fonds
            </h2>
            <div style={{
              padding: '20px',
              background: 'rgba(99, 102, 241, 0.1)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#a78bfa' }}>
                {selectedFund.icon} {selectedFund.name}
              </div>
            </div>
          </Card>

          <Card>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
              👥 Membres
            </h2>
            {groupMembers.map((member, index) => (
              <div key={member.id} style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  color: 'white'
                }}>
                  {String.fromCharCode(65 + index)}
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: '600' }}>{member.name}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#10b981' }}>
                    {formatCurrency(member.amount)}
                  </div>
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
              📊 Résumé
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '20px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '14px' }}>
                <div style={{ fontSize: '0.9rem', color: theme.textSecondary, marginBottom: '8px' }}>💰 Total</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#a78bfa' }}>{formatCurrency(totalInvestment)}</div>
              </div>
              <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '14px' }}>
                <div style={{ fontSize: '0.9rem', color: theme.textSecondary, marginBottom: '8px' }}>🎯 Gains</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>{formatCurrency(totalGains)}</div>
              </div>
              <div style={{ padding: '20px', background: 'rgba(236, 72, 153, 0.15)', borderRadius: '14px' }}>
                <div style={{ fontSize: '0.9rem', color: theme.textSecondary, marginBottom: '8px' }}>🚀 Final</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ec4899' }}>{formatCurrency(groupFinalCapital)}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // PAGE PRINCIPALE
  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      padding: '40px 20px',
      fontFamily: 'system-ui',
      color: theme.text
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            Investment Calculator
          </h1>
          <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '10px 18px', borderRadius: '12px', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, fontSize: '1.2rem', cursor: 'pointer' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setCurrentView('group')} 
            style={{ 
              padding: '12px 24px', 
              borderRadius: '12px', 
              border: '2px solid rgba(236, 72, 153, 0.5)', 
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.15))', 
              color: '#ec4899', 
              fontSize: '1rem', 
              cursor: 'pointer', 
              fontWeight: '700'
            }}
          >
            👥 Simulateur de Groupe
          </button>
          <button onClick={() => { setShowComparison(!showComparison); setShowGoalMode(false); setShowHistory(false); }} style={{ padding: '12px 24px', borderRadius: '12px', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, cursor: 'pointer', fontWeight: '600' }}>
            ⚖️ Comparateur
          </button>
          <button onClick={() => { setShowGoalMode(!showGoalMode); setShowComparison(false); setShowHistory(false); }} style={{ padding: '12px 24px', borderRadius: '12px', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, cursor: 'pointer', fontWeight: '600' }}>
            🎯 Mode Objectif
          </button>
          <button onClick={saveSimulation} disabled={!isValid} style={{ padding: '12px 24px', borderRadius: '12px', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, cursor: 'pointer', fontWeight: '600', opacity: isValid ? 1 : 0.5 }}>
            💾 Sauvegarder
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          <Card>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>🏦 Fonds</h2>
            <select value={selectedFund.name} onChange={(e) => setSelectedFund(funds.find(f => f.name === e.target.value))} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: theme.inputBg, color: theme.text, fontWeight: '600', cursor: 'pointer', border: 'none' }}>
              {funds.map(fund => <option key={fund.name} value={fund.name}>{fund.icon} {fund.name}</option>)}
            </select>
          </Card>

          <Card>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>💰 Montant</h2>
            <div style={{ textAlign: 'center', padding: '25px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#a78bfa' }}>{formatCurrency(amount)}</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => setAmount(Math.max(selectedFund.minimum, amount - 1000))} style={{ width: '50px', height: '50px', borderRadius: '50%', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, fontSize: '1.5rem', cursor: 'pointer' }}>◄</button>
                <input type="range" min={selectedFund.minimum} max={maxAmount} step={1000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={{ flex: 1 }} />
                <button onClick={() => setAmount(Math.min(maxAmount, amount + 1000))} style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #10b981', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '1.5rem', cursor: 'pointer' }}>►</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
              <button onClick={() => setAmount(Math.max(selectedFund.minimum, amount - 10000))} style={{ padding: '10px', borderRadius: '8px', background: theme.cardBg, color: theme.text, fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', border: 'none' }}>−10K</button>
              <button onClick={() => setAmount(Math.max(selectedFund.minimum, amount - 1000))} style={{ padding: '10px', borderRadius: '8px', background: theme.cardBg, color: theme.text, fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', border: 'none' }}>−1K</button>
              <button onClick={() => setAmount(Math.min(maxAmount, amount + 1000))} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', border: 'none' }}>+1K</button>
              <button onClick={() => setAmount(Math.min(maxAmount, amount + 10000))} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', border: 'none' }}>+10K</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button onClick={() => setAmount(100000)} disabled={selectedFund.minimum > 100000} style={{ padding: '12px', borderRadius: '8px', background: theme.inputBg, color: theme.text, fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', border: 'none', opacity: selectedFund.minimum > 100000 ? 0.5 : 1 }}>$100K</button>
              <button onClick={() => setAmount(250000)} disabled={selectedFund.minimum > 250000} style={{ padding: '12px', borderRadius: '8px', background: theme.inputBg, color: theme.text, fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', border: 'none', opacity: selectedFund.minimum > 250000 ? 0.5 : 1 }}>$250K</button>
              <button onClick={() => setAmount(500000)} style={{ padding: '12px', borderRadius: '8px', background: theme.inputBg, color: theme.text, fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', border: 'none' }}>$500K</button>
            </div>
          </Card>

          <Card>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>📊 Résultats</h2>
            {!isValid ? (
              <div style={{ padding: '40px', textAlign: 'center', color: theme.textSecondary }}>Ajustez le montant</div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { label: 'Income', value: incomeView, gain: incomeGain, color: '#ef4444' },
                  { label: 'Growth', value: growthView, gain: growthGain, color: '#3b82f6' },
                  { label: 'Compound', value: compoundView, gain: compoundGain, color: '#10b981' }
                ].map((view) => (
                  <div key={view.label} style={{ padding: '18px', background: `${view.color}20`, borderRadius: '14px', border: `2px solid ${view.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600' }}>{view.label}</span>
                      <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600' }}>+{formatCurrency(view.gain)}</span>
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: '800' }}>{formatCurrency(view.value)}</div>
                  </div>
                ))}
                <div style={{ padding: '18px', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#c4b5fd', marginBottom: '5px', fontWeight: '600' }}>ROI</div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#a78bfa' }}>+{formatPercent(roi)}</div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
