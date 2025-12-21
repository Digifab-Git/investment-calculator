import React, { useState, useEffect } from 'react';

// Composant Metric Card simple
function MetricCard({ title, value, subtitle, color = '#10b981' }) {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '20px', 
      background: 'rgba(255,255,255,0.05)', 
      borderRadius: '14px',
      border: '2px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', fontWeight: '600' }}>
        {title}
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: '900', color: color, marginBottom: '5px' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
        {subtitle}
      </div>
    </div>
  );
}

// Composant Input avec validation
function ValidatedInput({ amount, setAmount, min, max }) {
  const [localAmount, setLocalAmount] = useState(amount);

  useEffect(() => {
    setLocalAmount(amount);
  }, [amount]);

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalAmount(value);
  };

  const handleBlur = () => {
    const numValue = Number(localAmount) || min;
    const validValue = Math.max(min, Math.min(max, numValue));
    setAmount(validValue);
    setLocalAmount(validValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <input 
      type="number" 
      value={localAmount}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyPress={handleKeyPress}
      min={min}
      max={max}
      step="1000"
      placeholder="Entrez le montant"
      style={{ 
        width: '100%', 
        padding: '16px', 
        borderRadius: '12px', 
        background: 'rgba(30, 41, 59, 0.6)', 
        color: '#f1f5f9', 
        border: '2px solid rgba(148, 163, 184, 0.2)', 
        fontSize: '1.2rem', 
        fontWeight: '700', 
        textAlign: 'center',
        outline: 'none',
        transition: 'all 0.2s'
      }} 
      onFocus={(e) => e.target.style.border = '2px solid #3b82f6'}
      onBlur={(e) => { handleBlur(); e.target.style.border = '2px solid rgba(148, 163, 184, 0.2)'; }}
    />
  );
}

export default function InvestmentCalculator() {
  const funds = [
    { name: 'Technology Opportunities Fund', rateIncome: 0.005, rateGrowth: 0.0055, minimum: 500, maximum: 50000, duration: 12, icon: '💻' },
    { name: 'Energy and Natural Resources Fund', rateIncome: 0.006, rateGrowth: 0.0065, minimum: 10000, maximum: 100000, duration: 10, icon: '⚡' },
    { name: 'Fonds pour les Marchés Émergents', rateIncome: 0.009, rateGrowth: 0.010, minimum: 250000, maximum: 1000000, duration: 10, icon: '🌍' },
    { name: 'Fonds International LGMCORP', rateIncome: 0.012, rateGrowth: 0.0125, minimum: 500000, maximum: 1000000, duration: 10, icon: '🌟' }
  ];

  const [selectedFund, setSelectedFund] = useState(funds[0]);
  const [amount, setAmount] = useState(500);
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState('main');
  const [showGoalMode, setShowGoalMode] = useState(false);
  const [targetGain, setTargetGain] = useState(50000);
  const [savedSimulations, setSavedSimulations] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  // États pour le Simulateur de Groupe
  const [groupMembers, setGroupMembers] = useState([
    { id: 1, name: 'Personne A', amount: 500 },
    { id: 2, name: 'Personne B', amount: 500 }
  ]);
  const [nextId, setNextId] = useState(3);
  const [savedGroupSimulations, setSavedGroupSimulations] = useState([]);
  const [showGroupHistory, setShowGroupHistory] = useState(false);

  const theme = darkMode ? {
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    cardBg: 'rgba(30, 41, 59, 0.8)',
    cardBorder: 'rgba(148, 163, 184, 0.1)',
    text: '#f1f5f9',
    textSec: '#94a3b8',
    inputBg: 'rgba(30, 41, 59, 0.6)',
    hoverBg: 'rgba(51, 65, 85, 0.5)'
  } : {
    bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(100, 116, 139, 0.2)',
    text: '#0f172a',
    textSec: '#64748b',
    inputBg: 'rgba(248, 250, 252, 0.8)',
    hoverBg: 'rgba(226, 232, 240, 0.5)'
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  };

  const formatPercent = (value) => {
    return value.toFixed(2);
  };

  const calculateCompoundRealistic = (capital, dailyRate, days, threshold) => {
    let currentCapital = capital;
    let buffer = 0;

    for (let i = 0; i < days; i++) {
      const dailyGain = currentCapital * dailyRate;
      
      if (dailyGain >= threshold) {
        currentCapital += dailyGain;
      } else {
        buffer += dailyGain;
        if (buffer >= threshold) {
          currentCapital += buffer;
          buffer = 0;
        }
      }
    }
    
    return currentCapital + buffer;
  };

  const calculateEndDate = (startDateStr, months) => {
    const start = new Date(startDateStr);
    const end = new Date(start);
    end.setMonth(end.getMonth() + months);
    return end.toISOString().split('T')[0];
  };

  const workingDays = selectedFund.duration * 20;
  const incomeView = amount + (amount * selectedFund.rateIncome * workingDays);
  const growthView = amount + (amount * selectedFund.rateGrowth * workingDays);
  const compoundView = calculateCompoundRealistic(amount, selectedFund.rateGrowth, workingDays, 100);
  
  const incomeGain = incomeView - amount;
  const growthGain = growthView - amount;
  const compoundGain = compoundView - amount;
  
  const roiIncome = (incomeGain / amount) * 100;
  const roiGrowth = (growthGain / amount) * 100;
  const roiCompound = (compoundGain / amount) * 100;
  
  const dailyIncomeGain = amount * selectedFund.rateIncome;
  const dailyGrowthGain = amount * selectedFund.rateGrowth;
  
  const isValid = amount >= selectedFund.minimum && amount <= selectedFund.maximum;
  const endDate = calculateEndDate(startDate, selectedFund.duration);

  const saveSimulation = () => {
    const simulation = {
      id: Date.now(),
      date: new Date().toLocaleString('fr-FR'),
      fund: selectedFund.name,
      amount: amount,
      duration: selectedFund.duration,
      incomeGain, growthGain, compoundGain,
      roiIncome, roiGrowth, roiCompound
    };
    setSavedSimulations([simulation, ...savedSimulations]);
  };

  const exportResults = (copy = true) => {
    const text = `
📊 SIMULATION DRAHAM INVEST CALCULATOR

🏦 Fonds : ${selectedFund.name}
💰 Montant investi : ${formatCurrency(amount)}
📅 Durée : ${selectedFund.duration} mois (${workingDays} jours ouvrables)

📈 RÉSULTATS :

💰 Income View (Capital constant) :
   Gains quotidiens : ${formatCurrency(dailyIncomeGain)}
   Gains totaux : ${formatCurrency(incomeGain)}
   Capital final : ${formatCurrency(incomeView)}
   ROI : +${formatPercent(roiIncome)}%

📈 Growth View (Accumulation) :
   Gains quotidiens : ${formatCurrency(dailyGrowthGain)}
   Gains totaux : ${formatCurrency(growthGain)}
   Capital final : ${formatCurrency(growthView)}
   ROI : +${formatPercent(roiGrowth)}%

🚀 Compound View (Réinvestissement) :
   Gains totaux : ${formatCurrency(compoundGain)}
   Capital final : ${formatCurrency(compoundView)}
   ROI : +${formatPercent(roiCompound)}%

📅 Période : ${startDate} → ${endDate}
    `.trim();

    if (copy) {
      navigator.clipboard.writeText(text);
      alert('Résultats copiés dans le presse-papiers !');
    }
    return text;
  };

  const calculateGoalResults = () => {
    const results = [];
    
    funds.forEach(fund => {
      const days = fund.duration * 20;
      
      let minCapital = fund.minimum;
      let maxCapital = fund.maximum;
      let requiredCapital = null;
      let finalResult = null;
      
      const maxCompound = calculateCompoundRealistic(fund.maximum, fund.rateGrowth, days, 100);
      const maxGain = maxCompound - fund.maximum;
      
      if (maxGain < targetGain) {
        return;
      }
      
      const minCompound = calculateCompoundRealistic(fund.minimum, fund.rateGrowth, days, 100);
      const minGain = minCompound - fund.minimum;
      
      if (minGain > targetGain * 2) {
        return;
      }
      
      if (minGain >= targetGain) {
        requiredCapital = fund.minimum;
        finalResult = minCompound;
      } else {
        while (maxCapital - minCapital > 100) {
          const midCapital = Math.floor((minCapital + maxCapital) / 2);
          const midCompound = calculateCompoundRealistic(midCapital, fund.rateGrowth, days, 100);
          const midGain = midCompound - midCapital;
          
          if (midGain < targetGain) {
            minCapital = midCapital;
          } else {
            maxCapital = midCapital;
          }
        }
        
        requiredCapital = maxCapital;
        finalResult = calculateCompoundRealistic(requiredCapital, fund.rateGrowth, days, 100);
      }
      
      const capital = requiredCapital;
      const incomeResult = capital + (capital * fund.rateIncome * days);
      const growthResult = capital + (capital * fund.rateGrowth * days);
      const compoundResult = finalResult;
      
      results.push({
        fund: fund,
        requiredCapital: capital,
        incomeGain: incomeResult - capital,
        growthGain: growthResult - capital,
        compoundGain: compoundResult - capital,
        incomeFinal: incomeResult,
        growthFinal: growthResult,
        compoundFinal: compoundResult,
        roiIncome: ((incomeResult - capital) / capital) * 100,
        roiGrowth: ((growthResult - capital) / capital) * 100,
        roiCompound: ((compoundResult - capital) / capital) * 100
      });
    });
    
    return results.sort((a, b) => a.requiredCapital - b.requiredCapital);
  };

  function Card({ children, style = {} }) {
    return (
      <div style={{ 
        background: theme.cardBg, 
        padding: '25px', 
        borderRadius: '18px', 
        border: `2px solid ${theme.cardBorder}`, 
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        ...style 
      }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: theme.bg, 
      color: theme.text, 
      padding: '30px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Draham Invest Calculator
          </h1>
          <p style={{ fontSize: '1rem', color: theme.textSec }}>
            Choisissez votre stratégie : Revenus, Croissance ou Capitalisation
          </p>
        </div>

        {/* Boutons flottants en haut à droite */}
        <div style={{ position: 'fixed', top: '20px', right: '20px', display: 'flex', gap: '10px', zIndex: 1000 }}>
          <button onClick={() => setShowHelp(!showHelp)} style={{ padding: '10px 16px', borderRadius: '10px', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, cursor: 'pointer', fontWeight: '600', fontSize: '1.2rem', opacity: 0.8, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.target.style.opacity = '1'} onMouseLeave={(e) => e.target.style.opacity = '0.8'}>
            ❓
          </button>
          <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '10px 16px', borderRadius: '10px', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, cursor: 'pointer', fontWeight: '600', fontSize: '1.2rem', opacity: 0.8, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.target.style.opacity = '1'} onMouseLeave={(e) => e.target.style.opacity = '0.8'}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => { setCurrentView('group'); setShowGoalMode(false); setShowHistory(false); }} style={{ padding: '12px 24px', borderRadius: '12px', border: currentView === 'group' ? '2px solid #ec4899' : `2px solid ${theme.cardBorder}`, background: currentView === 'group' ? 'rgba(236, 72, 153, 0.15)' : theme.cardBg, color: currentView === 'group' ? '#ec4899' : theme.text, cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' }}>
            👥 Simulateur de Groupe
          </button>
          <button onClick={() => { setShowGoalMode(!showGoalMode); setCurrentView('main'); setShowHistory(false); }} style={{ padding: '12px 24px', borderRadius: '12px', border: showGoalMode ? '2px solid #10b981' : `2px solid ${theme.cardBorder}`, background: showGoalMode ? 'rgba(16, 185, 129, 0.15)' : theme.cardBg, color: showGoalMode ? '#10b981' : theme.text, cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' }}>
            🎯 Mode Objectif
          </button>
          <button onClick={() => { setShowHistory(!showHistory); setCurrentView('main'); setShowGoalMode(false); }} style={{ padding: '12px 24px', borderRadius: '12px', border: showHistory ? '2px solid #f59e0b' : `2px solid ${theme.cardBorder}`, background: showHistory ? 'rgba(245, 158, 11, 0.15)' : theme.cardBg, color: showHistory ? '#f59e0b' : theme.text, cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' }}>
            📚 Historique ({savedSimulations.length})
          </button>
        </div>

        {/* Mode Aide */}
        {showHelp && (
          <Card style={{ marginBottom: '30px', background: 'rgba(59, 130, 246, 0.1)', border: '2px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#3b82f6' }}>❓ Guide d'utilisation</div>
            <div style={{ fontSize: '0.95rem', lineHeight: '1.8', color: theme.text }}>
              <p><strong>💰 Income View</strong> : Vous retirez les gains chaque jour. Le capital reste constant. Idéal pour des revenus réguliers.</p>
              <p><strong>📈 Growth View</strong> : Les gains s'accumulent mais ne sont pas réinvestis. Croissance linéaire prévisible.</p>
              <p><strong>🚀 Compound View</strong> : Réinvestissement automatique des gains (seuil 100$). Maximise les rendements avec croissance exponentielle.</p>
              <p><strong>👥 Simulateur de Groupe</strong> : Calculez les gains d'un investissement collectif avec répartition automatique.</p>
              <p><strong>🎯 Mode Objectif</strong> : Fixez un objectif de gains et découvrez le montant minimum à investir par fonds.</p>
            </div>
          </Card>
        )}

        {/* PAGE D'ACCUEIL - Mode normal */}
        {currentView === 'main' && !showGoalMode && !showHistory && (
          <>
            {/* Section Configuration - 3 cartes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              
              {/* Card Fonds */}
              <Card>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>
                  🏦 Fonds d'investissement
                </div>
                <select 
                  value={funds.indexOf(selectedFund)} 
                  onChange={(e) => {
                    const newFund = funds[e.target.value];
                    setSelectedFund(newFund);
                    setAmount(Math.max(newFund.minimum, Math.min(amount, newFund.maximum)));
                  }}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    borderRadius: '10px', 
                    background: theme.inputBg, 
                    color: theme.text, 
                    border: `2px solid ${theme.cardBorder}`, 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '15px'
                  }}
                >
                  {funds.map((fund, idx) => (
                    <option key={idx} value={idx}>
                      {fund.icon} {fund.name}
                    </option>
                  ))}
                </select>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '15px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: theme.textSec, marginBottom: '5px' }}>Taux Income</div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ef4444' }}>{formatPercent(selectedFund.rateIncome * 100)}%/jour</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: theme.textSec, marginBottom: '5px' }}>Taux Growth</div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: '#3b82f6' }}>{formatPercent(selectedFund.rateGrowth * 100)}%/jour</div>
                  </div>
                </div>
                
                <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: theme.textSec }}>Investissement min.</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#f59e0b' }}>{formatCurrency(selectedFund.minimum)}</div>
                </div>
              </Card>

              {/* Card Montant */}
              <Card>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>
                  💰 Montant à investir
                </div>
                
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                  <div style={{ fontSize: '0.8rem', color: theme.textSec, marginBottom: '8px' }}>Capital investi</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#a78bfa' }}>{formatCurrency(amount)}</div>
                </div>

                <ValidatedInput amount={amount} setAmount={setAmount} min={selectedFund.minimum} max={selectedFund.maximum} />
                
                <input 
                  type="range" 
                  min={selectedFund.minimum} 
                  max={selectedFund.maximum} 
                  step="1000" 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))} 
                  style={{ width: '100%', marginTop: '15px' }} 
                />
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '15px' }}>
                  {[-10000, -1000, 1000, 10000].map(delta => (
                    <button 
                      key={delta}
                      onClick={() => setAmount(Math.max(selectedFund.minimum, Math.min(selectedFund.maximum, amount + delta)))}
                      style={{ 
                        padding: '8px', 
                        borderRadius: '8px', 
                        border: `2px solid ${theme.cardBorder}`, 
                        background: theme.cardBg, 
                        color: theme.text, 
                        cursor: 'pointer', 
                        fontWeight: '700',
                        fontSize: '0.85rem'
                      }}
                    >
                      {delta > 0 ? '+' : ''}{delta >= 1000 || delta <= -1000 ? `${delta/1000}K` : delta}
                    </button>
                  ))}
                </div>
                
                {isValid ? (
                  <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', textAlign: 'center', color: '#10b981', fontWeight: '600', fontSize: '0.9rem' }}>
                    ✅ Montant valide
                  </div>
                ) : (
                  <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', textAlign: 'center', color: '#ef4444', fontWeight: '600', fontSize: '0.9rem' }}>
                    ⚠️ Hors limites ({formatCurrency(selectedFund.minimum)} - {formatCurrency(selectedFund.maximum)})
                  </div>
                )}
              </Card>

              {/* Card Période */}
              <Card>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>
                  📅 Période d'investissement
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: theme.textSec, marginBottom: '5px' }}>📍 Début</div>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      borderRadius: '10px', 
                      background: theme.inputBg, 
                      color: theme.text, 
                      border: `2px solid ${theme.cardBorder}`, 
                      fontSize: '0.95rem',
                      fontWeight: '600'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: theme.textSec, marginBottom: '5px' }}>🏁 Fin</div>
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: '10px', 
                    background: 'rgba(255,255,255,0.05)', 
                    border: `2px solid ${theme.cardBorder}`,
                    fontSize: '0.95rem',
                    fontWeight: '600'
                  }}>
                    {endDate}
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: theme.textSec }}>📅 Durée</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#3b82f6' }}>{selectedFund.duration} mois</div>
                  </div>
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: theme.textSec }}>⏱️ Jours ouvrables</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#f59e0b' }}>{workingDays} jours</div>
                  </div>
                </div>
                
                <div style={{ marginTop: '12px', fontSize: '0.75rem', color: theme.textSec, textAlign: 'center' }}>
                  💡 Méthode LGM : 20 jours ouvrables par mois
                </div>
              </Card>
            </div>

            {/* Section Résultats - Les 3 vues avec gauges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              
              {/* Income View */}
              <Card style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))', border: '2px solid rgba(239, 68, 68, 0.3)' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '20px', color: '#ef4444', textAlign: 'center' }}>
                  💰 Income View
                </div>
                <div style={{ fontSize: '0.85rem', color: theme.textSec, textAlign: 'center', marginBottom: '20px' }}>
                  Capital constant, gains retirés quotidiennement
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '25px' }}>
                  <div style={{ display: 'inline-block', padding: '15px 30px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '16px', border: '2px solid #ef4444' }}>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '5px' }}>ROI</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#ef4444' }}>+{formatPercent(roiIncome)}%</div>
                  </div>
                </div>
                
                <div style={{ marginTop: '25px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: theme.textSec, marginBottom: '5px' }}>💵 Gains quotidiens</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#ef4444' }}>
                    {formatCurrency(dailyIncomeGain)} / jour
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '15px' }}>
                  <MetricCard 
                    title="Gross Profit" 
                    value={formatCurrency(incomeGain)} 
                    subtitle="Profit"
                    color="#ef4444"
                  />
                  <MetricCard 
                    title="Net Profit" 
                    value={formatCurrency(incomeView)} 
                    subtitle="Capital + Profit"
                    color="#ef4444"
                  />
                </div>
              </Card>

              {/* Growth View */}
              <Card style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))', border: '2px solid rgba(59, 130, 246, 0.3)' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '20px', color: '#3b82f6', textAlign: 'center' }}>
                  📈 Growth View
                </div>
                <div style={{ fontSize: '0.85rem', color: theme.textSec, textAlign: 'center', marginBottom: '20px' }}>
                  Gains accumulés sans réinvestissement
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '25px' }}>
                  <div style={{ display: 'inline-block', padding: '15px 30px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '16px', border: '2px solid #3b82f6' }}>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '5px' }}>ROI</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#3b82f6' }}>+{formatPercent(roiGrowth)}%</div>
                  </div>
                </div>
                
                <div style={{ marginTop: '25px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: theme.textSec, marginBottom: '5px' }}>💵 Gains quotidiens</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#3b82f6' }}>
                    {formatCurrency(dailyGrowthGain)} / jour
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '15px' }}>
                  <MetricCard 
                    title="Gross Profit" 
                    value={formatCurrency(growthGain)} 
                    subtitle="Profit"
                    color="#3b82f6"
                  />
                  <MetricCard 
                    title="Net Profit" 
                    value={formatCurrency(growthView)} 
                    subtitle="Capital + Profit"
                    color="#3b82f6"
                  />
                </div>
              </Card>

              {/* Compound View */}
              <Card style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))', border: '2px solid rgba(16, 185, 129, 0.3)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '15px', right: '15px', padding: '6px 12px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', color: 'white' }}>
                  ⭐ OPTIMAL
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '20px', color: '#10b981', textAlign: 'center' }}>
                  🚀 Compound View
                </div>
                <div style={{ fontSize: '0.85rem', color: theme.textSec, textAlign: 'center', marginBottom: '20px' }}>
                  Réinvestissement automatique (seuil 100$)
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '25px' }}>
                  <div style={{ display: 'inline-block', padding: '15px 30px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '16px', border: '2px solid #10b981' }}>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '5px' }}>ROI</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#10b981' }}>+{formatPercent(roiCompound)}%</div>
                  </div>
                </div>
                
                <div style={{ marginTop: '25px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: theme.textSec, marginBottom: '5px' }}>💎 Croissance exponentielle</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#10b981' }}>
                    Gains réinvestis automatiquement
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '15px' }}>
                  <MetricCard 
                    title="Gross Profit" 
                    value={formatCurrency(compoundGain)} 
                    subtitle="Profit"
                    color="#10b981"
                  />
                  <MetricCard 
                    title="Net Profit" 
                    value={formatCurrency(compoundView)} 
                    subtitle="Capital + Profit"
                    color="#10b981"
                  />
                </div>
              </Card>
            </div>

            {/* Boutons d'action */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
              <button onClick={saveSimulation} disabled={!isValid} style={{ padding: '14px 28px', borderRadius: '12px', border: 'none', background: isValid ? 'linear-gradient(135deg, #10b981, #34d399)' : 'gray', color: 'white', cursor: isValid ? 'pointer' : 'not-allowed', fontWeight: '700', fontSize: '1rem', opacity: isValid ? 1 : 0.5 }}>
                💾 Sauvegarder
              </button>
              <button onClick={() => exportResults(true)} disabled={!isValid} style={{ padding: '14px 28px', borderRadius: '12px', border: 'none', background: isValid ? 'linear-gradient(135deg, #3b82f6, #60a5fa)' : 'gray', color: 'white', cursor: isValid ? 'pointer' : 'not-allowed', fontWeight: '700', fontSize: '1rem', opacity: isValid ? 1 : 0.5 }}>
                📄 Exporter
              </button>
            </div>

            {/* Footer info */}
            <div style={{ textAlign: 'center', marginTop: '40px', padding: '20px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '14px', border: '2px solid rgba(59, 130, 246, 0.2)' }}>
              <div style={{ fontSize: '0.85rem', color: theme.textSec, marginBottom: '8px' }}>
                📊 Les gains sont versés uniquement les jours ouvrables
              </div>
              <div style={{ fontSize: '0.8rem', color: theme.textSec }}>
                Version 2.0 • Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </div>
            </div>
          </>
        )}


        {/* SIMULATEUR DE GROUPE */}
        {currentView === 'group' && (
          <div>
            <Card>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>👥 Simulateur de Groupe</h2>
              <p style={{ color: theme.textSec, marginBottom: '20px' }}>
                Calculez les gains d'un investissement collectif. Parfait pour les partenariats !
              </p>

              {groupMembers.map((member) => (
                <div key={member.id} style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center', padding: '15px', background: theme.hoverBg, borderRadius: '10px' }}>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => setGroupMembers(groupMembers.map(m => m.id === member.id ? { ...m, name: e.target.value } : m))}
                    placeholder="Nom"
                    style={{ flex: '1', padding: '10px', borderRadius: '8px', background: theme.inputBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, fontWeight: '600' }}
                  />
                  <input
                    type="number"
                    value={member.amount}
                    onChange={(e) => setGroupMembers(groupMembers.map(m => m.id === member.id ? { ...m, amount: Number(e.target.value) } : m))}
                    min="0"
                    step="100"
                    placeholder="Montant"
                    style={{ flex: '1', padding: '10px', borderRadius: '8px', background: theme.inputBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, textAlign: 'right', fontWeight: '700' }}
                  />
                  {groupMembers.length > 1 && (
                    <button onClick={() => setGroupMembers(groupMembers.filter(m => m.id !== member.id))} style={{ padding: '10px 15px', borderRadius: '8px', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '700' }}>
                      ❌
                    </button>
                  )}
                </div>
              ))}

              <button onClick={() => setGroupMembers([...groupMembers, { id: nextId, name: `Personne ${String.fromCharCode(64 + nextId)}`, amount: 500 }]) || setNextId(nextId + 1)} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, #ec4899, #a855f7)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '700', marginBottom: '20px' }}>
                ➕ Ajouter un membre
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' }}>
                <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.05))', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', color: theme.textSec, marginBottom: '8px' }}>💰 Total du groupe</div>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: '#a78bfa' }}>
                    {formatCurrency(groupMembers.reduce((sum, m) => sum + m.amount, 0))}
                  </div>
                </div>
                <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(236, 72, 153, 0.05))', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', color: theme.textSec, marginBottom: '8px' }}>👥 Nombre de membres</div>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: '#ec4899' }}>
                    {groupMembers.length}
                  </div>
                </div>
              </div>
            </Card>

            {/* Résultats du groupe */}
            {groupMembers.reduce((sum, m) => sum + m.amount, 0) > 0 && (
              <div style={{ marginTop: '20px' }}>
                {funds.map((fund, idx) => {
                  const totalAmount = groupMembers.reduce((sum, m) => sum + m.amount, 0);
                  if (totalAmount < fund.minimum || totalAmount > fund.maximum) return null;

                  const days = fund.duration * 20;
                  const incomeTotal = totalAmount + (totalAmount * fund.rateIncome * days);
                  const growthTotal = totalAmount + (totalAmount * fund.rateGrowth * days);
                  const compoundTotal = calculateCompoundRealistic(totalAmount, fund.rateGrowth, days, 100);

                  const incomeGainTotal = incomeTotal - totalAmount;
                  const growthGainTotal = growthTotal - totalAmount;
                  const compoundGainTotal = compoundTotal - totalAmount;

                  return (
                    <Card key={idx} style={{ marginTop: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: theme.text }}>{fund.icon} {fund.name}</div>
                          <div style={{ fontSize: '0.85rem', color: theme.textSec, marginTop: '5px' }}>
                            Durée: {fund.duration} mois • Taux: {formatPercent(fund.rateIncome * 100)}-{formatPercent(fund.rateGrowth * 100)}%/jour
                          </div>
                        </div>
                      </div>

                      {/* Résultats globaux */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                        <div style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))', borderRadius: '12px', border: '2px solid rgba(239, 68, 68, 0.3)' }}>
                          <div style={{ fontSize: '0.85rem', color: theme.textSec, marginBottom: '5px' }}>💰 Income View</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ef4444' }}>+{formatCurrency(incomeGainTotal)}</div>
                          <div style={{ fontSize: '0.75rem', color: theme.textSec, marginTop: '5px' }}>
                            Total: {formatCurrency(incomeTotal)}
                          </div>
                        </div>
                        <div style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))', borderRadius: '12px', border: '2px solid rgba(59, 130, 246, 0.3)' }}>
                          <div style={{ fontSize: '0.85rem', color: theme.textSec, marginBottom: '5px' }}>📈 Growth View</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#3b82f6' }}>+{formatCurrency(growthGainTotal)}</div>
                          <div style={{ fontSize: '0.75rem', color: theme.textSec, marginTop: '5px' }}>
                            Total: {formatCurrency(growthTotal)}
                          </div>
                        </div>
                        <div style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))', borderRadius: '12px', border: '2px solid rgba(16, 185, 129, 0.3)' }}>
                          <div style={{ fontSize: '0.85rem', color: theme.textSec, marginBottom: '5px' }}>🚀 Compound View</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#10b981' }}>+{formatCurrency(compoundGainTotal)}</div>
                          <div style={{ fontSize: '0.75rem', color: theme.textSec, marginTop: '5px' }}>
                            Total: {formatCurrency(compoundTotal)}
                          </div>
                        </div>
                      </div>

                      {/* Répartition par membre */}
                      <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '15px', color: theme.text }}>
                          📊 Répartition des gains (Compound View)
                        </div>
                        <div style={{ display: 'grid', gap: '10px' }}>
                          {groupMembers.map(member => {
                            const memberRatio = member.amount / totalAmount;
                            const memberCompoundGain = compoundGainTotal * memberRatio;
                            const memberCompoundTotal = member.amount + memberCompoundGain;
                            
                            return (
                              <div key={member.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <div>
                                  <div style={{ fontWeight: '700', color: theme.text }}>{member.name}</div>
                                  <div style={{ fontSize: '0.75rem', color: theme.textSec }}>
                                    Investissement: {formatCurrency(member.amount)} ({formatPercent(memberRatio * 100)}%)
                                  </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#10b981' }}>
                                    +{formatCurrency(memberCompoundGain)}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: theme.textSec }}>
                                    Total: {formatCurrency(memberCompoundTotal)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Mode Objectif */}
        {showGoalMode && (
  <Card>
    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎯</div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '10px', background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Mode Objectif
      </h2>
      <p style={{ fontSize: '0.95rem', color: theme.textSec }}>
        Fixez un objectif de gains et découvrez le montant minimum requis
      </p>
    </div>

    {/* Input Objectif */}
    <div style={{ marginBottom: '30px' }}>
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="number" 
          value={targetGain}
          onChange={(e) => setTargetGain(Number(e.target.value) || 1000)}
          min="1000" 
          max="5000000" 
          step="1000"
          placeholder="Entrez votre objectif"
          style={{ 
            width: '100%', 
            padding: '18px', 
            borderRadius: '14px', 
            background: theme.inputBg, 
            color: theme.text, 
            border: `3px solid ${theme.cardBorder}`, 
            fontSize: '1.5rem', 
            fontWeight: '800', 
            textAlign: 'center',
            boxSizing: 'border-box'
          }} 
        />
      </div>

      <div>
        <input 
          type="range" 
          min="1000" 
          max="5000000" 
          step="10000" 
          value={targetGain} 
          onChange={(e) => setTargetGain(Number(e.target.value))} 
          style={{ width: '100%' }} 
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.85rem', color: theme.textSec }}>
          <span>1 K$</span>
          <span style={{ fontWeight: '700', fontSize: '0.95rem', color: theme.text }}>{formatCurrency(targetGain)}</span>
          <span>5 M$</span>
        </div>
      </div>
    </div>

    {/* Paliers rapides */}
    <div style={{ marginBottom: '35px' }}>
      <div style={{ fontSize: '0.85rem', color: theme.textSec, marginBottom: '12px', textAlign: 'center', fontWeight: '600' }}>
        🚀 Ou choisissez un palier rapide :
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
        {[10000, 50000, 100000, 250000, 500000, 1000000, 2500000, 5000000].map(val => (
          <button 
            key={val}
            onClick={() => setTargetGain(val)}
            style={{ 
              padding: '12px 8px', 
              borderRadius: '10px', 
              background: targetGain === val ? 'linear-gradient(135deg, #10b981, #34d399)' : theme.cardBg, 
              color: targetGain === val ? 'white' : theme.text, 
              border: targetGain === val ? 'none' : `2px solid ${theme.cardBorder}`, 
              cursor: 'pointer', 
              fontWeight: '700',
              fontSize: '0.85rem',
              transition: 'all 0.2s'
            }}
          >
            {val >= 1000000 ? `${val/1000000}M$` : `${val/1000}K$`}
          </button>
        ))}
      </div>
    </div>

    {/* Résultats */}
    {(() => {
      const goalResults = calculateGoalResults();
      
      if (goalResults.length === 0) {
        return (
          <div style={{ padding: '50px 30px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))', borderRadius: '20px', textAlign: 'center', border: '2px solid rgba(239, 68, 68, 0.3)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚠️</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '15px', color: '#f87171' }}>
              Objectif inatteignable
            </div>
            <div style={{ fontSize: '1rem', color: theme.textSec, lineHeight: '1.6', maxWidth: '500px', margin: '0 auto' }}>
              Aucun fonds ne permet d'atteindre <strong style={{ color: theme.text }}>{formatCurrency(targetGain)}</strong> de gains.
            </div>
          </div>
        );
      }

      return (
        <>
          <div style={{ marginBottom: '25px', padding: '15px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))', borderRadius: '12px', textAlign: 'center', border: '2px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ fontSize: '1rem', color: '#10b981', fontWeight: '700' }}>
              ✅ {goalResults.length} fonds compatible{goalResults.length > 1 ? 's' : ''} trouvé{goalResults.length > 1 ? 's' : ''} !
            </div>
            <div style={{ fontSize: '0.85rem', color: theme.textSec, marginTop: '5px' }}>
              Triés par montant requis (du moins cher au plus cher)
            </div>
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>
            {goalResults.map((result, idx) => {
              const days = result.fund.duration * 20;
              const dailyIncome = result.requiredCapital * result.fund.rateIncome;
              const dailyGrowth = result.requiredCapital * result.fund.rateGrowth;

              return (
                <div key={idx} style={{ 
                  padding: '25px', 
                  background: idx === 0 ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))' : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.05))', 
                  borderRadius: '18px',
                  border: idx === 0 ? '3px solid #10b981' : `2px solid ${theme.cardBorder}`,
                  position: 'relative'
                }}>
                  {idx === 0 && (
                    <div style={{ position: 'absolute', top: '15px', right: '15px', padding: '8px 16px', background: 'linear-gradient(135deg, #10b981, #34d399)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '800', color: 'white' }}>
                      💰 PLUS ACCESSIBLE
                    </div>
                  )}

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{result.fund.icon}</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '800', color: idx === 0 ? '#10b981' : '#a78bfa', marginBottom: '8px' }}>
                      {result.fund.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: theme.textSec }}>
                      📅 Durée: {result.fund.duration} mois • 📈 Taux: {formatPercent(result.fund.rateIncome * 100)}% / {formatPercent(result.fund.rateGrowth * 100)}%
                    </div>
                  </div>

                  <div style={{ padding: '25px', background: idx === 0 ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.1))' : 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.05))', borderRadius: '14px', marginBottom: '20px', textAlign: 'center', border: idx === 0 ? '2px solid #10b981' : '2px solid rgba(99, 102, 241, 0.3)' }}>
                    <div style={{ fontSize: '0.95rem', color: theme.textSec, marginBottom: '10px', fontWeight: '600' }}>
                      💰 Montant MINIMUM à investir
                    </div>
                    <div style={{ fontSize: '2.8rem', fontWeight: '900', color: idx === 0 ? '#10b981' : '#a78bfa', marginBottom: '10px' }}>
                      {formatCurrency(result.requiredCapital)}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: theme.textSec }}>
                      Limites: {formatCurrency(result.fund.minimum)} - {formatCurrency(result.fund.maximum)}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '15px', textAlign: 'center', color: theme.text }}>
                      📊 Résultats selon le type d'investissement
                    </div>

                    <div style={{ display: 'grid', gap: '15px' }}>
                      {/* Income */}
                      <div style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))', borderRadius: '12px', border: '2px solid rgba(239, 68, 68, 0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ef4444', marginBottom: '4px' }}>💰 Income</div>
                            <div style={{ fontSize: '0.75rem', color: theme.textSec }}>{formatCurrency(dailyIncome)} / jour</div>
                          </div>
                          <div style={{ padding: '6px 14px', background: '#ef4444', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800', color: 'white' }}>
                            ROI: +{formatPercent(result.roiIncome)}%
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                          <MetricCard title="Gains" value={formatCurrency(result.incomeGain)} subtitle="" color="#ef4444" />
                          <MetricCard title="Final" value={formatCurrency(result.incomeFinal)} subtitle="" color="#ef4444" />
                        </div>
                      </div>

                      {/* Growth */}
                      <div style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))', borderRadius: '12px', border: '2px solid rgba(59, 130, 246, 0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>📈 Growth</div>
                            <div style={{ fontSize: '0.75rem', color: theme.textSec }}>{formatCurrency(dailyGrowth)} / jour</div>
                          </div>
                          <div style={{ padding: '6px 14px', background: '#3b82f6', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800', color: 'white' }}>
                            ROI: +{formatPercent(result.roiGrowth)}%
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                          <MetricCard title="Gains" value={formatCurrency(result.growthGain)} subtitle="" color="#3b82f6" />
                          <MetricCard title="Final" value={formatCurrency(result.growthFinal)} subtitle="" color="#3b82f6" />
                        </div>
                      </div>

                      {/* Compound */}
                      <div style={{ padding: '18px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))', borderRadius: '12px', border: '2px solid rgba(16, 185, 129, 0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>🚀 Compound</div>
                            <div style={{ fontSize: '0.75rem', color: theme.textSec }}>Réinvestissement auto (100$)</div>
                          </div>
                          <div style={{ padding: '6px 14px', background: '#10b981', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800', color: 'white' }}>
                            ROI: +{formatPercent(result.roiCompound)}%
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                          <MetricCard title="Gains" value={formatCurrency(result.compoundGain)} subtitle="" color="#10b981" />
                          <MetricCard title="Final" value={formatCurrency(result.compoundFinal)} subtitle="" color="#10b981" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comparaison */}
                  <div style={{ padding: '15px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', marginTop: '15px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '10px', color: theme.text }}>
                      🎯 Comparaison avec objectif de {formatCurrency(targetGain)}
                    </div>
                    <div style={{ display: 'grid', gap: '8px', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: theme.textSec }}>💰 Income :</span>
                        <span style={{ fontWeight: '700', color: result.incomeGain >= targetGain ? '#10b981' : '#f59e0b' }}>
                          {result.incomeGain >= targetGain ? '✅' : '⚠️'} {formatCurrency(result.incomeGain)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: theme.textSec }}>📈 Growth :</span>
                        <span style={{ fontWeight: '700', color: result.growthGain >= targetGain ? '#10b981' : '#f59e0b' }}>
                          {result.growthGain >= targetGain ? '✅' : '⚠️'} {formatCurrency(result.growthGain)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: theme.textSec }}>🚀 Compound :</span>
                        <span style={{ fontWeight: '700', color: '#10b981' }}>
                          ✅ {formatCurrency(result.compoundGain)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
    })()}
  </Card>
)}

        {/* HISTORIQUE */}
        {showHistory && (
          <Card>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📚</div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '10px', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Historique
              </h2>
              <p style={{ fontSize: '0.95rem', color: theme.textSec }}>
                Vos simulations sauvegardées ({savedSimulations.length})
              </p>
            </div>
        
            {savedSimulations.length === 0 ? (
              <div style={{ padding: '40px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📭</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: '#f59e0b' }}>
                  Aucune simulation sauvegardée
                </div>
                <div style={{ fontSize: '0.95rem', color: theme.textSec }}>
                  Effectuez une simulation et cliquez sur "Sauvegarder"
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                  <button onClick={() => setSavedSimulations([])} style={{ padding: '10px 20px', borderRadius: '10px', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: '#ef4444', cursor: 'pointer', fontWeight: '600' }}>
                    🗑️ Tout supprimer
                  </button>
                </div>
        
                <div style={{ display: 'grid', gap: '15px' }}>
                  {savedSimulations.map((sim) => (
                    <div key={sim.id} style={{ padding: '20px', background: theme.hoverBg, borderRadius: '14px', border: `2px solid ${theme.cardBorder}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '5px' }}>{sim.fund}</div>
                          <div style={{ fontSize: '0.85rem', color: theme.textSec }}>{sim.date}</div>
                        </div>
                        <button 
                          onClick={() => setSavedSimulations(savedSimulations.filter(s => s.id !== sim.id))}
                          style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: '600' }}
                        >
                          🗑️
                        </button>
                      </div>
        
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: theme.textSec, marginBottom: '4px' }}>💰 Montant</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: theme.text }}>{formatCurrency(sim.amount)}</div>
                        </div>
                        <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: theme.textSec, marginBottom: '4px' }}>💰 Income</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ef4444' }}>+{formatPercent(sim.roiIncome)}%</div>
                        </div>
                        <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: theme.textSec, marginBottom: '4px' }}>📈 Growth</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#3b82f6' }}>+{formatPercent(sim.roiGrowth)}%</div>
                        </div>
                        <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: theme.textSec, marginBottom: '4px' }}>🚀 Compound</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#10b981' }}>+{formatPercent(sim.roiCompound)}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
