import React, { useState, useEffect, useRef } from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ResponsiveContainer } from 'recharts';
import GroupSimulator from './TestSimulator';

export default function InvestmentCalculator() {
  const funds = [
    { name: 'Technology Opportunities Fund', rateIncome: 0.005, rateGrowth: 0.0055, minimum: 500, duration: 12, color: '#f59e0b', icon: '💻' },
    { name: 'Energy and Natural Resources Fund', rateIncome: 0.006, rateGrowth: 0.0065, minimum: 10000, duration: 10, color: '#10b981', icon: '⚡' },
    { name: 'Health Sciences Opportunities Fund', rateIncome: 0.008, rateGrowth: 0.0085, minimum: 100000, duration: 10, color: '#6366f1', icon: '💊' },
    { name: 'Fonds pour les Marchés Émergents', rateIncome: 0.009, rateGrowth: 0.010, minimum: 250000, duration: 10, color: '#ec4899', icon: '🌍' },
    { name: 'Fonds International LGMCORP', rateIncome: 0.012, rateGrowth: 0.0125, minimum: 500000, duration: 10, color: '#8b5cf6', icon: '🌟' }
  ];

  const viewDescriptions = {
    income: { title: '💰 Income View', desc: 'Vous retirez les gains chaque jour ouvrable. Votre capital initial reste constant.', icon: '💰', color: '#ef4444' },
    growth: { title: '📈 Growth View', desc: 'Les gains s\'accumulent sans être réinvestis. Croissance linéaire prévisible.', icon: '📈', color: '#3b82f6' },
    compound: { title: '🚀 Compound View', desc: 'Les gains sont automatiquement réinvestis. Croissance exponentielle maximale !', icon: '🚀', color: '#10b981' }
  };

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
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showGroupSimulator, setShowGroupSimulator] = useState(false);
  
  const isInitialMount = useRef(true);

  const theme = darkMode ? {
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    cardBg: 'rgba(30, 41, 59, 0.8)',
    cardBorder: 'rgba(148, 163, 184, 0.1)',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    textTertiary: '#cbd5e1',
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
    textTertiary: '#64748b',
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('lastSimulation', JSON.stringify({
        fund: selectedFund.name,
        amount: amount,
        date: new Date().toISOString()
      }));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [selectedFund, amount]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const last = localStorage.getItem('lastSimulation');
      if (last) {
        const data = JSON.parse(last);
        const fund = funds.find(f => f.name === data.fund);
        if (fund) setSelectedFund(fund);
        if (data.amount) setAmount(data.amount);
      }
      const history = localStorage.getItem('simulationHistory');
      if (history) setSavedSimulations(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    setAmount(selectedFund.minimum);
  }, [selectedFund]);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 1000);
    return () => clearTimeout(timer);
  }, []);
  
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
  const compareCompoundGain = compareCompoundView - amount;
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

  const generateChartData = () => {
    const data = [];
    let workingDayCount = 0;
    for (let day = 1; day <= 42 && workingDayCount < 30; day++) {
      if (day % 7 !== 6 && day % 7 !== 0) {
        workingDayCount++;
        data.push({
          day: workingDayCount,
          income: amount + (dailyGainIncome * workingDayCount),
          growth: amount + (dailyGainGrowth * workingDayCount),
          compound: amount * Math.pow(1 + selectedFund.rateGrowth, workingDayCount)
        });
      }
    }
    return data;
  };

  const chartData = generateChartData();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value) => `${value.toFixed(2)}%`;

  const InfoTooltip = ({ text }) => {
    const [show, setShow] = useState(false);
    return (
      <div style={{ position: 'relative', display: 'inline-block', marginLeft: '8px' }}>
        <span
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          style={{
            cursor: 'help',
            background: 'rgba(99, 102, 241, 0.2)',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            color: '#6366f1'
          }}
        >
          ?
        </span>
        {show && (
          <div style={{
            position: 'absolute',
            bottom: '25px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: theme.tooltipBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: '8px',
            padding: '10px 15px',
            fontSize: '0.85rem',
            zIndex: 1000,
            boxShadow: theme.shadow,
            color: theme.text,
            maxWidth: '250px',
            whiteSpace: 'normal'
          }}>
            {text}
          </div>
        )}
      </div>
    );
  };

  const Card = ({ children, delay = 0 }) => (
    <div style={{
      background: theme.cardBg,
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '30px',
      border: `1px solid ${theme.cardBorder}`,
      boxShadow: theme.shadow,
      animation: hasAnimated ? 'none' : `fadeInUp 0.8s ease-out ${delay}s backwards`,
      transition: 'all 0.3s ease'
    }}>
      {children}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      padding: '40px 20px',
      fontFamily: '"DM Sans", system-ui, sans-serif',
      color: theme.text,
      transition: 'all 0.5s ease'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
          animation: 'fadeInDown 0.8s ease-out'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px',
            letterSpacing: '-0.02em'
          }}>
            Draham Invest Calculator
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: theme.textSecondary,
            fontWeight: '400',
            marginBottom: '20px'
          }}>
            Choisissez votre stratégie : Revenus immédiats, Croissance ou Capitalisation
          </p>

          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <button onClick={() => setShowHelp(!showHelp)} style={{ padding: '10px 18px', borderRadius: '12px', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s ease', fontWeight: '600', whiteSpace: 'nowrap' }}>
              ❓ Aide
            </button>
            <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '10px 18px', borderRadius: '12px', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, fontSize: '1.2rem', cursor: 'pointer', transition: 'all 0.3s ease', minWidth: '50px' }}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {showHelp && (
          <div style={{ background: theme.cardBg, borderRadius: '16px', padding: '25px', marginBottom: '30px', border: `1px solid ${theme.cardBorder}`, animation: 'fadeInDown 0.5s ease-out', boxShadow: theme.shadow }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: theme.text }}>📚 Guide complet</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {Object.values(viewDescriptions).map((view) => (
                <div key={view.title} style={{ padding: '15px', background: theme.hoverBg, borderRadius: '10px', borderLeft: `4px solid ${view.color}` }}>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: view.color, marginBottom: '8px' }}>{view.icon} {view.title}</div>
                  <div style={{ fontSize: '0.9rem', color: theme.textSecondary, lineHeight: '1.5' }}>{view.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
          <button onClick={() => setShowGroupSimulator(true)} style={{ padding: '12px 24px', borderRadius: '12px', border: '2px solid rgba(236, 72, 153, 0.5)', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.15))', color: '#ec4899', fontSize: '0.95rem', cursor: 'pointer', fontWeight: '700', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(236, 72, 153, 0.2)' }}>
            👥 Simulateur de Groupe ✨
          </button>
          <button onClick={() => { setShowComparison(!showComparison); setShowGoalMode(false); setShowHistory(false); }} style={{ padding: '12px 24px', borderRadius: '12px', border: showComparison ? '2px solid #3b82f6' : `2px solid ${theme.cardBorder}`, background: showComparison ? 'rgba(59, 130, 246, 0.15)' : theme.cardBg, color: showComparison ? '#3b82f6' : theme.text, fontSize: '0.95rem', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s ease' }}>
            ⚖️ Comparateur
          </button>
          <button onClick={() => { setShowGoalMode(!showGoalMode); setShowComparison(false); setShowHistory(false); }} style={{ padding: '12px 24px', borderRadius: '12px', border: showGoalMode ? '2px solid #10b981' : `2px solid ${theme.cardBorder}`, background: showGoalMode ? 'rgba(16, 185, 129, 0.15)' : theme.cardBg, color: showGoalMode ? '#10b981' : theme.text, fontSize: '0.95rem', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s ease' }}>
            🎯 Mode Objectif
          </button>
          <button onClick={() => { setShowHistory(!showHistory); setShowComparison(false); setShowGoalMode(false); }} style={{ padding: '12px 24px', borderRadius: '12px', border: showHistory ? '2px solid #f59e0b' : `2px solid ${theme.cardBorder}`, background: showHistory ? 'rgba(245, 158, 11, 0.15)' : theme.cardBg, color: showHistory ? '#f59e0b' : theme.text, fontSize: '0.95rem', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s ease' }}>
            📊 Historique ({savedSimulations.length})
          </button>
          <button onClick={saveSimulation} disabled={!isValid} style={{ padding: '12px 24px', borderRadius: '12px', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: isValid ? theme.text : theme.textSecondary, fontSize: '0.95rem', cursor: isValid ? 'pointer' : 'not-allowed', fontWeight: '600', transition: 'all 0.3s ease', opacity: isValid ? 1 : 0.5 }}>
            💾 Sauvegarder
          </button>
        </div>

        {showGoalMode && (
          <Card delay={0}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px', color: theme.text }}>🎯 Mode Objectif</h2>
            <p style={{ color: theme.textSecondary, marginBottom: '20px', fontSize: '0.95rem' }}>Définissez vos gains souhaités</p>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '10px', color: theme.textTertiary }}>
                Gain souhaité : {formatCurrency(targetGain)}
              </label>
              <input type="range" min="1000" max="1000000" step="5000" value={targetGain} onChange={(e) => setTargetGain(Number(e.target.value))} style={{ width: '100%', height: '6px', marginBottom: '15px' }} />
              <input
                type="text"
                inputMode="numeric"
                value={targetGain}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (val === '') setTargetGain(0);
                  else {
                    const num = parseInt(val, 10);
                    if (!isNaN(num)) setTargetGain(num);
                  }
                }}
                onBlur={() => { if (targetGain < 1000) setTargetGain(1000); }}
                placeholder="Saisissez un montant..."
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid rgba(16, 185, 129, 0.3)', background: theme.inputBg, color: theme.text, fontSize: '1.3rem', fontWeight: '700', outline: 'none' }}
              />
            </div>
            <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: theme.textSecondary, marginBottom: '8px' }}>💡 Investissement requis</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#10b981' }}>{formatCurrency(calculateRequiredInvestment())}</div>
            </div>
          </Card>
        )}

        {showHistory && (
          <Card delay={0}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px', color: theme.text }}>📊 Historique</h2>
            {savedSimulations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: theme.textSecondary }}>Aucune simulation</div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {savedSimulations.map((sim) => (
                  <div key={sim.id} style={{ padding: '15px', background: theme.hoverBg, borderRadius: '10px', border: `1px solid ${theme.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: theme.textSecondary, marginBottom: '5px' }}>{sim.date}</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '600', color: theme.text, marginBottom: '3px' }}>{sim.fund}</div>
                      <div style={{ fontSize: '0.9rem', color: theme.textTertiary }}>
                        {formatCurrency(sim.amount)} → {formatCurrency(sim.amount + sim.gain)} 
                        <span style={{ color: '#10b981', fontWeight: '700', marginLeft: '8px' }}>+{formatPercent(sim.roi)}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteSimulation(sim.id)} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', cursor: 'pointer', fontSize: '0.9rem' }}>🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {showComparison && (
          <Card delay={0}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px', color: theme.text }}>⚖️ Comparateur</h2>
            <select value={compareWith.name} onChange={(e) => setCompareWith(funds.find(f => f.name === e.target.value))} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `2px solid ${theme.cardBorder}`, background: theme.inputBg, color: theme.text, fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginBottom: '20px' }}>
              {funds.map(fund => (
                <option key={fund.name} value={fund.name} disabled={fund.name === selectedFund.name}>{fund.icon} {fund.name}</option>
              ))}
            </select>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div style={{ padding: '20px', background: compoundView > compareCompoundView ? 'rgba(16, 185, 129, 0.15)' : theme.hoverBg, borderRadius: '12px', border: `2px solid ${compoundView > compareCompoundView ? '#10b981' : theme.cardBorder}` }}>
                <div style={{ fontSize: '0.85rem', color: theme.textSecondary, marginBottom: '8px' }}>{selectedFund.icon} {selectedFund.name}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: theme.text }}>{formatCurrency(compoundView)}</div>
                <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: '700' }}>+{formatPercent(roi)}</div>
              </div>
              <div style={{ padding: '20px', background: compareCompoundView > compoundView ? 'rgba(16, 185, 129, 0.15)' : theme.hoverBg, borderRadius: '12px', border: `2px solid ${compareCompoundView > compoundView ? '#10b981' : theme.cardBorder}` }}>
                <div style={{ fontSize: '0.85rem', color: theme.textSecondary, marginBottom: '8px' }}>{compareWith.name}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: theme.text }}>{formatCurrency(compareCompoundView)}</div>
                <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: '700' }}>+{formatPercent(compareRoi)}</div>
              </div>
            </div>
          </Card>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginBottom: '30px' }}>
          <Card delay={0.1}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px', color: theme.text }}>
              🏦 Fonds<InfoTooltip text="Choisissez votre fonds" />
            </h2>
            <select value={selectedFund.name} onChange={(e) => setSelectedFund(funds.find(f => f.name === e.target.value))} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${theme.cardBorder}`, background: theme.inputBg, color: theme.text, fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginBottom: '20px' }}>
              {funds.map(fund => <option key={fund.name} value={fund.name}>{fund.icon} {fund.name}</option>)}
            </select>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              <div style={{ padding: '15px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: theme.textSecondary, marginBottom: '5px' }}>Taux/jour</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#a78bfa' }}>{formatPercent(selectedFund.rateIncome * 100)}</div>
              </div>
              <div style={{ padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: theme.textSecondary, marginBottom: '5px' }}>Durée</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#34d399' }}>{selectedFund.duration} mois</div>
              </div>
            </div>
            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: theme.textSecondary, marginBottom: '5px' }}>Minimum</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fbbf24' }}>{formatCurrency(selectedFund.minimum)}</div>
            </div>
          </Card>

          <Card delay={0.2}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px', color: theme.text }}>💰 Investissement</h2>
            <div style={{ textAlign: 'center', padding: '25px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.05))', borderRadius: '16px', marginBottom: '20px', border: '2px solid rgba(99, 102, 241, 0.2)' }}>
              <div style={{ fontSize: '0.9rem', color: theme.textSecondary, marginBottom: '8px', fontWeight: '600' }}>À investir</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '5px' }}>{formatCurrency(amount)}</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                <button onClick={() => setAmount(Math.max(selectedFund.minimum, amount - 1000))} style={{ width: '50px', height: '50px', borderRadius: '50%', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, fontSize: '1.5rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>◄</button>
                <div style={{ flex: 1 }}>
                  <input type="range" min={selectedFund.minimum} max={maxAmount} step={1000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="investment-slider" style={{ width: '100%' }} />
                </div>
                <button onClick={() => setAmount(Math.min(maxAmount, amount + 1000))} style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '1.5rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>►</button>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: theme.textSecondary, marginBottom: '10px' }}>⚡ Ajustement rapide</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                <button onClick={() => setAmount(Math.max(selectedFund.minimum, amount - 10000))} style={{ padding: '10px', borderRadius: '8px', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' }}>−10K</button>
                <button onClick={() => setAmount(Math.max(selectedFund.minimum, amount - 1000))} style={{ padding: '10px', borderRadius: '8px', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' }}>−1K</button>
                <button onClick={() => setAmount(Math.min(maxAmount, amount + 1000))} style={{ padding: '10px', borderRadius: '8px', border: '2px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' }}>+1K</button>
                <button onClick={() => setAmount(Math.min(maxAmount, amount + 10000))} style={{ padding: '10px', borderRadius: '8px', border: '2px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' }}>+10K</button>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: theme.textSecondary, marginBottom: '10px' }}>💡 Suggestions</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <button onClick={() => setAmount(100000)} disabled={selectedFund.minimum > 100000} style={{ padding: '12px 8px', borderRadius: '8px', border: amount === 100000 ? '2px solid #6366f1' : `2px solid ${theme.cardBorder}`, background: amount === 100000 ? 'rgba(99, 102, 241, 0.1)' : theme.inputBg, color: selectedFund.minimum > 100000 ? theme.textTertiary : (amount === 100000 ? '#6366f1' : theme.text), fontSize: '0.95rem', fontWeight: '700', cursor: selectedFund.minimum > 100000 ? 'not-allowed' : 'pointer', opacity: selectedFund.minimum > 100000 ? 0.5 : 1 }}>$100K</button>
                <button onClick={() => setAmount(250000)} disabled={selectedFund.minimum > 250000} style={{ padding: '12px 8px', borderRadius: '8px', border: amount === 250000 ? '2px solid #6366f1' : `2px solid ${theme.cardBorder}`, background: amount === 250000 ? 'rgba(99, 102, 241, 0.1)' : theme.inputBg, color: selectedFund.minimum > 250000 ? theme.textTertiary : (amount === 250000 ? '#6366f1' : theme.text), fontSize: '0.95rem', fontWeight: '700', cursor: selectedFund.minimum > 250000 ? 'not-allowed' : 'pointer', opacity: selectedFund.minimum > 250000 ? 0.5 : 1 }}>$250K</button>
                <button onClick={() => setAmount(500000)} style={{ padding: '12px 8px', borderRadius: '8px', border: amount === 500000 ? '2px solid #6366f1' : `2px solid ${theme.cardBorder}`, background: amount === 500000 ? 'rgba(99, 102, 241, 0.1)' : theme.inputBg, color: amount === 500000 ? '#6366f1' : theme.text, fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer' }}>$500K</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
              <button onClick={() => setAmount(selectedFund.minimum)} style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${theme.cardBorder}`, background: theme.inputBg, color: theme.textSecondary, fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>↺ Min</button>
              <button onClick={() => setAmount(Math.round(amount / 10000) * 10000)} style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${theme.cardBorder}`, background: theme.inputBg, color: theme.textSecondary, fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>⌀ Rond</button>
              <button onClick={() => setAmount(maxAmount)} style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${theme.cardBorder}`, background: theme.inputBg, color: theme.textSecondary, fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>↻ Max</button>
            </div>

            <div style={{ padding: '12px 20px', borderRadius: '12px', background: isValid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${isValid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, textAlign: 'center', fontSize: '0.95rem', fontWeight: '600', color: isValid ? '#34d399' : '#f87171', marginBottom: '20px' }}>
              {isValid ? '✓ Valide' : '⚠ Insuffisant'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              <div style={{ padding: '15px', background: theme.hoverBg, borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '5px' }}>Jours ouvrables</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: theme.text }}>{workingDays}</div>
              </div>
              <div style={{ padding: '15px', background: theme.hoverBg, borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '5px' }}>Gains/jour</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#10b981' }}>{formatCurrency(dailyGainGrowth)}</div>
              </div>
            </div>
          </Card>

          <Card delay={0.3}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px', color: theme.text }}>📊 Résultats</h2>
            {!isValid ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: theme.textSecondary, fontSize: '0.95rem' }}>Ajustez le montant</div>
            ) : (
              <>
                <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                  {[
                    { label: 'Income', value: incomeView, gain: incomeGain, icon: '💰', color: '#ef4444', desc: 'Capital constant' },
                    { label: 'Growth', value: growthView, gain: growthGain, icon: '📈', color: '#3b82f6', desc: 'Accumulation' },
                    { label: 'Compound', value: compoundView, gain: compoundGain, icon: '🚀', color: '#10b981', desc: 'Exponentiel' }
                  ].map((view) => (
                    <div key={view.label} style={{ padding: '18px', background: `linear-gradient(135deg, ${view.color}20, ${view.color}10)`, borderRadius: '14px', border: `2px solid ${view.color}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div>
                          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{view.icon} {view.label}</span>
                          <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginTop: '2px' }}>{view.desc}</div>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600' }}>+{formatCurrency(view.gain)}</span>
                      </div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: theme.text }}>{formatCurrency(view.value)}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(139, 92, 246, 0.05))', borderRadius: '14px', border: '1px solid rgba(168, 85, 247, 0.3)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#c4b5fd', marginBottom: '5px', fontWeight: '600' }}>ROI Compound</div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#a78bfa' }}>+{formatPercent(roi)}</div>
                </div>
              </>
            )}
          </Card>
        </div>

        {isValid && (
          <Card delay={0.4}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '25px', color: theme.text, textAlign: 'center' }}>📈 Évolution (30 jours)</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.gridStroke} />
                <XAxis dataKey="day" stroke={theme.textSecondary} style={{ fontSize: '0.85rem' }} />
                <YAxis stroke={theme.textSecondary} style={{ fontSize: '0.85rem' }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: theme.tooltipBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '12px', padding: '12px', color: theme.text }} formatter={(value) => formatCurrency(value)} labelFormatter={(label) => `Jour ${label}`} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
                <Line type="monotone" dataKey="income" stroke="#ef4444" strokeWidth={3} name="Income" dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="growth" stroke="#3b82f6" strokeWidth={3} name="Growth" dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="compound" stroke="#10b981" strokeWidth={3} name="Compound" dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px', color: theme.textSecondary, fontSize: '0.9rem', borderTop: `1px solid ${theme.cardBorder}` }}>
          <p>📅 Gains versés les jours ouvrables uniquement</p>
          <p style={{ marginTop: '15px', color: '#ec4899', fontWeight: '600' }}>✨ Simulateur de Groupe disponible</p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        .investment-slider { width: 100%; height: 6px; margin: 15px 0; cursor: pointer; }
        body { margin: 0; padding: 0; background: #0f172a !important; }
      `}</style>
    </div>
  );
}
