import React, { useState, useEffect, useCallback } from 'react';

// DESCRIPTIONS DES TYPES DE RÉMUNÉRATION
const viewDescriptions = {
  income: { 
    title: '💰 Income View', 
    desc: 'Vous retirez les gains chaque jour ouvrable. Votre capital initial reste constant. Idéal pour générer des revenus réguliers.', 
    icon: '💰', 
    color: '#ef4444' 
  },
  growth: { 
    title: '📈 Growth View', 
    desc: 'Les gains s\'accumulent sans être réinvestis. Croissance linéaire prévisible. Un compromis entre revenu et capitalisation.', 
    icon: '📈', 
    color: '#3b82f6' 
  },
  compound: { 
    title: '🚀 Compound View', 
    desc: 'Les gains sont automatiquement réinvestis chaque jour. Croissance exponentielle maximale grâce aux intérêts composés !', 
    icon: '🚀', 
    color: '#10b981' 
  }
};

// ✅ COMPOSANT ISOLÉ POUR UNE LIGNE DE MEMBRE - VERSION MOBILE FRIENDLY
function MemberInputRow({ member, index, theme, onUpdate, onDelete, canDelete }) {
  const [localName, setLocalName] = useState(member.name);
  const [localAmount, setLocalAmount] = useState(member.amount);

  const handleNameBlur = () => {
    if (localName !== member.name) {
      onUpdate(member.id, { name: localName });
    }
  };

  const handleAmountChange = (e) => {
    const newValue = e.target.value === '' ? 0 : Number(e.target.value);
    setLocalAmount(newValue);
  };

  const handleAmountBlur = () => {
    if (localAmount !== member.amount) {
      onUpdate(member.id, { amount: localAmount });
    }
  };

  return (
    <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Header avec avatar et bouton delete */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '800', color: 'white', flexShrink: 0 }}>
            {String.fromCharCode(65 + index)}
          </div>
          <input 
            type="text" 
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            onBlur={handleNameBlur}
            placeholder="Nom du membre"
            style={{ padding: '10px', borderRadius: '8px', background: theme.inputBg, color: theme.text, border: 'none', fontSize: '0.95rem', fontWeight: '600', flex: 1, minWidth: 0, width: '100%' }} 
          />
        </div>
        <button 
          onClick={() => onDelete(member.id)}
          disabled={!canDelete}
          style={{ 
            padding: '10px 12px', 
            borderRadius: '8px', 
            background: !canDelete ? 'rgba(0,0,0,0.1)' : 'rgba(239, 68, 68, 0.2)', 
            color: !canDelete ? theme.textSec : '#f87171', 
            border: 'none', 
            cursor: !canDelete ? 'not-allowed' : 'pointer', 
            fontSize: '1.2rem', 
            opacity: !canDelete ? 0.5 : 1,
            flexShrink: 0
          }}
        >
          🗑️
        </button>
      </div>
      
      {/* Input montant en pleine largeur */}
      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', color: theme.textSec, marginBottom: '6px', fontWeight: '600' }}>
          💰 Montant investi
        </label>
        <input 
          type="number" 
          value={localAmount}
          onChange={handleAmountChange}
          onBlur={handleAmountBlur}
          min="0" 
          step="100" 
          placeholder="Montant"
          style={{ width: '100%', padding: '12px', borderRadius: '8px', background: theme.inputBg, color: theme.text, border: `2px solid ${theme.cardBorder}`, fontSize: '1.1rem', fontWeight: '700', textAlign: 'center', boxSizing: 'border-box' }} 
        />
      </div>
    </div>
  );
}

// ✅ COMPOSANT ISOLÉ POUR L'INPUT DU MONTANT PRINCIPAL - AVEC ÉTAT LOCAL
function AmountInput({ amount, min, max, theme, onUpdate }) {
  const [localAmount, setLocalAmount] = useState(amount);

  // Synchroniser avec le prop si le montant change de l'extérieur (boutons, slider)
  useEffect(() => {
    setLocalAmount(amount);
  }, [amount]);

  const handleChange = (e) => {
    const newValue = e.target.value === '' ? 0 : Number(e.target.value);
    setLocalAmount(newValue);
  };

  const handleBlur = () => {
    const validAmount = Math.max(min, Math.min(max, localAmount || min));
    setLocalAmount(validAmount);
    if (validAmount !== amount) {
      onUpdate(validAmount);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.target.blur(); // Déclenche le blur qui valide
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
        padding: '14px', 
        borderRadius: '12px', 
        background: theme.inputBg, 
        color: theme.text, 
        border: `2px solid ${theme.cardBorder}`, 
        fontSize: '1.1rem', 
        fontWeight: '700', 
        textAlign: 'center'
      }} 
    />
  );
}

// ✅ COMPOSANT POUR L'INPUT DU MODE OBJECTIF - AVEC ÉTAT LOCAL
function TargetGainInput({ targetGain, min, max, theme, onUpdate }) {
  const [localValue, setLocalValue] = useState(targetGain);

  // Synchroniser avec le prop si la valeur change de l'extérieur (slider, boutons)
  useEffect(() => {
    setLocalValue(targetGain);
  }, [targetGain]);

  const handleChange = (e) => {
    const newValue = e.target.value === '' ? '' : e.target.value;
    setLocalValue(newValue);
  };

  const handleBlur = () => {
    const numValue = Number(localValue) || min;
    const validValue = Math.max(min, Math.min(max, numValue));
    setLocalValue(validValue);
    if (validValue !== targetGain) {
      onUpdate(validValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <input 
      type="number" 
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyPress={handleKeyPress}
      min={min}
      max={max}
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
  );
}

// ✅ COMPOSANT METRICCARD - STYLE LGM CORP
function MetricCard({ title, value, subtitle, color = '#10b981' }) {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '20px', 
      background: 'rgba(255,255,255,0.05)', 
      borderRadius: '14px',
      border: '2px solid rgba(255,255,255,0.1)',
      flex: 1,
      minWidth: '140px'
    }}>
      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', fontWeight: '600' }}>
        {title}
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: '900', color: color, marginBottom: '5px' }}>
        {value}
      </div>
      {subtitle && <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
        {subtitle}
      </div>}
    </div>
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
  const [showComparison, setShowComparison] = useState(false);
  const [compareWith, setCompareWith] = useState(funds[1]);
  const [showGoalMode, setShowGoalMode] = useState(false);
  const [targetGain, setTargetGain] = useState(50000);
  const [savedSimulations, setSavedSimulations] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Gestion des dates de démarrage
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  // État pour les simulations de groupe
  const [savedGroupSimulations, setSavedGroupSimulations] = useState([]);
  const [showGroupHistory, setShowGroupHistory] = useState(false);
  
  const [groupMembers, setGroupMembers] = useState([
    { id: 1, name: 'Personne A', amount: 500 },
    { id: 2, name: 'Personne B', amount: 500 }
  ]);
  const [nextId, setNextId] = useState(3);

  const theme = darkMode ? {
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    cardBg: 'rgba(30, 41, 59, 0.8)',
    cardBorder: 'rgba(148, 163, 184, 0.1)',
    text: '#f1f5f9',
    textSec: '#94a3b8',
    inputBg: 'rgba(15, 23, 42, 0.6)',
    hoverBg: 'rgba(148, 163, 184, 0.08)',
    shadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
  } : {
    bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(203, 213, 225, 0.4)',
    text: '#0f172a',
    textSec: '#475569',
    inputBg: 'rgba(248, 250, 252, 0.8)',
    hoverBg: 'rgba(148, 163, 184, 0.1)',
    shadow: '0 20px 60px rgba(0, 0, 0, 0.08)'
  };

  useEffect(() => {
    setAmount(selectedFund.minimum);
  }, [selectedFund]);

  useEffect(() => {
    const history = localStorage.getItem('simulationHistory');
    if (history) setSavedSimulations(JSON.parse(history));
    
    // Charger l'historique des simulations de groupe
    const groupHistory = localStorage.getItem('groupSimulationHistory');
    if (groupHistory) setSavedGroupSimulations(JSON.parse(groupHistory));
  }, []);

  const updateMember = useCallback((id, updates) => {
    setGroupMembers(prev => prev.map(m => 
      m.id === id ? { ...m, ...updates } : m
    ));
  }, []);

  const addMember = () => {
    setGroupMembers(prev => [...prev, {
      id: nextId,
      name: `Personne ${String.fromCharCode(64 + nextId)}`,
      amount: selectedFund.minimum
    }]);
    setNextId(nextId + 1);
  };

  const removeMember = useCallback((id) => {
    setGroupMembers(prev => prev.length > 2 ? prev.filter(m => m.id !== id) : prev);
  }, []);

  const formatCurrency = (val) => {
    return Math.round(val).toLocaleString('fr-FR').replace(/\s/g, ' ') + ' $';
  };

  const formatPercent = (val) => `${val.toFixed(2)}%`;

  // ✅ NOUVELLE FONCTION : Compound réaliste avec seuil de réinvestissement de 100 $
  const calculateCompoundRealistic = (initialCapital, dailyRate, days, threshold = 100) => {
    let currentCapital = initialCapital;
    let accumulatedGains = 0;
    
    for (let day = 1; day <= days; day++) {
      // Gain quotidien basé sur le capital actuel
      const dailyGain = currentCapital * dailyRate;
      
      // Si le gain quotidien >= 100 $ : réinvestit immédiatement (compound quotidien)
      if (dailyGain >= threshold) {
        currentCapital += dailyGain;
      } 
      // Sinon : accumule jusqu'à atteindre 100 $
      else {
        accumulatedGains += dailyGain;
        
        // Quand on atteint 100 $, on réinvestit par tranches de 100 $
        if (accumulatedGains >= threshold) {
          const toReinvest = Math.floor(accumulatedGains / threshold) * threshold;
          currentCapital += toReinvest;
          accumulatedGains -= toReinvest;
        }
      }
    }
    
    // Capital final = capital actuel + gains non réinvestis
    return currentCapital + accumulatedGains;
  };

  // NOUVEAU : Calcul de la date de fin selon la méthode LGM
  const calculateEndDate = (start, durationMonths) => {
    const startD = new Date(start);
    const endD = new Date(startD);
    endD.setMonth(endD.getMonth() + durationMonths);
    return endD;
  };

  const formatDate = (date) => {
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const endDate = calculateEndDate(startDate, selectedFund.duration);
  const calendarDays = Math.floor((endDate - new Date(startDate)) / (1000 * 60 * 60 * 24));

  const workingDays = selectedFund.duration * 20; // ✅ Formule LGM : 20 jours ouvrables/mois
  const maxAmount = selectedFund.maximum; // ✅ Utilise le vrai maximum du fonds
  
  const dailyGainIncome = amount * selectedFund.rateIncome;
  const dailyGainGrowth = amount * selectedFund.rateGrowth;
  const incomeView = amount + (dailyGainIncome * workingDays);
  const growthView = amount + (dailyGainGrowth * workingDays);
  const compoundView = calculateCompoundRealistic(amount, selectedFund.rateGrowth, workingDays, 100);
  const incomeGain = incomeView - amount;
  const growthGain = growthView - amount;
  const compoundGain = compoundView - amount;
  const roi = ((compoundView - amount) / amount) * 100;
  const isValid = amount >= selectedFund.minimum;

  // ✅ NOUVEAU : Calcul du montant MINIMUM requis pour atteindre l'objectif de gains
  const calculateGoalResults = () => {
    const results = [];
    
    funds.forEach(fund => {
      const days = fund.duration * 20;
      
      // On cherche le montant MINIMUM à investir pour atteindre l'objectif
      // Recherche binaire entre minimum et maximum du fonds
      let minCapital = fund.minimum;
      let maxCapital = fund.maximum;
      let requiredCapital = null;
      let finalResult = null;
      
      // Vérifier d'abord si c'est même possible avec le maximum du fonds
      const maxCompound = calculateCompoundRealistic(fund.maximum, fund.rateGrowth, days, 100);
      const maxGain = maxCompound - fund.maximum;
      
      if (maxGain < targetGain) {
        // Même avec le max, on n'atteint pas l'objectif → ce fonds ne convient pas
        return;
      }
      
      // Vérifier si avec le minimum on dépasse déjà TROP l'objectif
      const minCompound = calculateCompoundRealistic(fund.minimum, fund.rateGrowth, days, 100);
      const minGain = minCompound - fund.minimum;
      
      // Si le minimum génère déjà plus de 2x l'objectif, ce fonds est trop puissant
      if (minGain > targetGain * 2) {
        // Le fonds est trop puissant pour cet objectif → on ne l'affiche pas
        return;
      }
      
      // Si le minimum génère entre 1x et 2x l'objectif, on utilise le minimum
      if (minGain >= targetGain) {
        requiredCapital = fund.minimum;
        finalResult = minCompound;
      } else {
        // Recherche binaire pour trouver le montant exact
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
      
      // Calculs pour les 3 vues avec le capital trouvé
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
    
    // Trier par montant requis (du plus petit au plus grand)
    return results.sort((a, b) => a.requiredCapital - b.requiredCapital);
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

  // NOUVEAU : Fonctions pour les simulations de groupe
  const saveGroupSimulation = () => {
    const newSim = {
      id: Date.now(),
      date: new Date().toLocaleString('fr-FR'),
      fund: selectedFund.name,
      members: groupMembers.map(m => ({ name: m.name, amount: m.amount })),
      totalInvested: totalInv,
      // Growth View
      totalGainsGrowth: totalGainsGrowth,
      finalCapitalGrowth: groupGrowthView,
      roiGrowth: ((groupGrowthView - totalInv) / totalInv) * 100,
      // Compound View (par défaut pour rétrocompatibilité)
      totalGains: totalGainsCompound,
      finalCapital: groupCompoundView,
      roi: ((groupCompoundView - totalInv) / totalInv) * 100
    };
    const updated = [newSim, ...savedGroupSimulations].slice(0, 10);
    setSavedGroupSimulations(updated);
    localStorage.setItem('groupSimulationHistory', JSON.stringify(updated));
    alert('✅ Simulation de groupe sauvegardée !');
  };

  const deleteGroupSimulation = (id) => {
    const updated = savedGroupSimulations.filter(s => s.id !== id);
    setSavedGroupSimulations(updated);
    localStorage.setItem('groupSimulationHistory', JSON.stringify(updated));
  };

  const loadGroupSimulation = (sim) => {
    setSelectedFund(funds.find(f => f.name === sim.fund) || funds[0]);
    setGroupMembers(sim.members.map((m, i) => ({ id: i + 1, name: m.name, amount: m.amount })));
    setNextId(sim.members.length + 1);
    setShowGroupHistory(false);
    alert('✅ Simulation chargée !');
  };

  // NOUVEAU : Fonction d'export des résultats
  const exportResults = (isGroup = false) => {
    let text = '';
    if (isGroup) {
      text = `🎯 SIMULATION DE GROUPE - ${selectedFund.name}\n`;
      text += `📅 Date : ${new Date().toLocaleString('fr-FR')}\n\n`;
      text += `💰 Total investi : ${formatCurrency(totalInv)}\n`;
      text += `⏱️ Durée : ${selectedFund.duration} mois (${workingDays} jours ouvrables)\n\n`;
      
      text += `📈 GROWTH VIEW (Gains linéaires):\n`;
      text += `   Gains totaux : ${formatCurrency(totalGainsGrowth)}\n`;
      text += `   Capital final : ${formatCurrency(groupGrowthView)}\n`;
      text += `   ROI : ${formatPercent(((groupGrowthView - totalInv) / totalInv) * 100)}\n\n`;
      
      text += `🚀 COMPOUND VIEW (Gains composés):\n`;
      text += `   Gains totaux : ${formatCurrency(totalGainsCompound)}\n`;
      text += `   Capital final : ${formatCurrency(groupCompoundView)}\n`;
      text += `   ROI : ${formatPercent(((groupCompoundView - totalInv) / totalInv) * 100)}\n\n`;
      
      text += `👥 RÉPARTITION PAR MEMBRE (Compound View):\n`;
      membersWithCalcCompound.forEach((m, i) => {
        text += `\n${String.fromCharCode(65 + i)}. ${m.name}\n`;
        text += `   Investi : ${formatCurrency(m.amount)}\n`;
        text += `   Part : ${formatPercent(m.percentage)}\n`;
        text += `   Gains : ${formatCurrency(m.memberGains)}\n`;
        text += `   Final : ${formatCurrency(m.finalCapital)}\n`;
      });
    } else {
      text = `🎯 SIMULATION INDIVIDUELLE - ${selectedFund.name}\n`;
      text += `📅 Date : ${new Date().toLocaleString('fr-FR')}\n\n`;
      text += `💰 Capital investi : ${formatCurrency(amount)}\n`;
      text += `⏱️ Durée : ${selectedFund.duration} mois (${workingDays} jours ouvrables)\n\n`;
      text += `💰 Income View : ${formatCurrency(incomeView)} (Gains: ${formatCurrency(incomeGain)})\n`;
      text += `📈 Growth View : ${formatCurrency(growthView)} (Gains: ${formatCurrency(growthGain)})\n`;
      text += `🚀 Compound View : ${formatCurrency(compoundView)} (Gains: ${formatCurrency(compoundGain)})\n\n`;
      text += `📊 ROI Compound : ${formatPercent(roi)}`;
    }
    navigator.clipboard.writeText(text).then(() => {
      alert('✅ Résultats copiés dans le presse-papier !');
    }).catch(() => {
      alert('❌ Erreur lors de la copie');
    });
  };

  // NOUVEAU : Suggestions de fonds intelligentes
  const getRecommendedFunds = (investAmount) => {
    return funds.filter(f => investAmount >= f.minimum && investAmount <= f.maximum);
  };

  const totalInv = groupMembers.reduce((sum, m) => sum + m.amount, 0);
  
  // Calculs Growth View (gains linéaires)
  const dailyGainGrowthGroup = totalInv * selectedFund.rateGrowth;
  const groupGrowthView = totalInv + (dailyGainGrowthGroup * workingDays);
  const totalGainsGrowth = groupGrowthView - totalInv;
  
  // Calculs Compound View (gains composés)
  const groupCompoundView = calculateCompoundRealistic(totalInv, selectedFund.rateGrowth, workingDays, 100);
  const totalGainsCompound = groupCompoundView - totalInv;
  
  const isGroupValid = totalInv >= selectedFund.minimum;

  const recommendedFunds = getRecommendedFunds(amount);
  const recommendedGroupFunds = getRecommendedFunds(totalInv);

  const membersWithCalcGrowth = groupMembers.map(m => {
    const percentage = totalInv > 0 ? (m.amount / totalInv) * 100 : 0;
    const memberGains = (percentage / 100) * groupGrowthView - m.amount;
    const finalCapital = m.amount + memberGains;
    return { ...m, percentage, memberGains, finalCapital };
  });

  const membersWithCalcCompound = groupMembers.map(m => {
    const percentage = totalInv > 0 ? (m.amount / totalInv) * 100 : 0;
    const memberGains = (percentage / 100) * groupCompoundView - m.amount;
    const finalCapital = m.amount + memberGains;
    return { ...m, percentage, memberGains, finalCapital };
  });

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
    return (
      <div style={{ minHeight: '100vh', background: theme.bg, padding: '40px 20px', color: theme.text, fontFamily: 'system-ui' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <button 
            onClick={() => setCurrentView('main')} 
            style={{ padding: '12px 24px', borderRadius: '12px', background: theme.cardBg, color: theme.text, border: `2px solid ${theme.cardBorder}`, cursor: 'pointer', marginBottom: '30px', fontSize: '1rem', fontWeight: '600' }}
          >
            ← Retour
          </button>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <button 
              onClick={saveGroupSimulation}
              disabled={!isGroupValid}
              style={{ padding: '10px 20px', borderRadius: '10px', background: isGroupValid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0,0,0,0.1)', color: isGroupValid ? '#10b981' : theme.textSec, border: 'none', cursor: isGroupValid ? 'pointer' : 'not-allowed', fontWeight: '600', opacity: isGroupValid ? 1 : 0.5 }}
            >
              💾 Sauvegarder
            </button>
            <button 
              onClick={() => setShowGroupHistory(!showGroupHistory)}
              style={{ padding: '10px 20px', borderRadius: '10px', background: showGroupHistory ? 'rgba(245, 158, 11, 0.2)' : theme.cardBg, color: showGroupHistory ? '#f59e0b' : theme.text, border: `2px solid ${showGroupHistory ? '#f59e0b' : theme.cardBorder}`, cursor: 'pointer', fontWeight: '600' }}
            >
              📊 Historique ({savedGroupSimulations.length})
            </button>
            <button 
              onClick={() => exportResults(true)}
              disabled={!isGroupValid}
              style={{ padding: '10px 20px', borderRadius: '10px', background: isGroupValid ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0,0,0,0.1)', color: isGroupValid ? '#3b82f6' : theme.textSec, border: 'none', cursor: isGroupValid ? 'pointer' : 'not-allowed', fontWeight: '600', opacity: isGroupValid ? 1 : 0.5 }}
            >
              📄 Copier les résultats
            </button>
          </div>

          {showGroupHistory && (
            <Card>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>📊 Historique des Simulations de Groupe</h2>
              {savedGroupSimulations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: theme.textSec }}>Aucune simulation de groupe sauvegardée</div>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {savedGroupSimulations.map((sim) => (
                    <div key={sim.id} style={{ padding: '15px', background: theme.hoverBg, borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', color: theme.textSec }}>{sim.date}</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: '600', marginTop: '5px' }}>{sim.fund}</div>
                        <div style={{ fontSize: '0.9rem', marginTop: '5px', color: theme.textSec }}>
                          👥 {sim.members.length} membres • {formatCurrency(sim.totalInvested)} → {formatCurrency(sim.finalCapital)}
                          <span style={{ color: '#10b981', fontWeight: '700', marginLeft: '8px' }}>+{formatPercent(sim.roi)}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => loadGroupSimulation(sim)} 
                          style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', cursor: 'pointer', border: 'none', fontSize: '0.9rem', fontWeight: '600' }}
                        >
                          📥 Charger
                        </button>
                        <button 
                          onClick={() => deleteGroupSimulation(sim.id)} 
                          style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', cursor: 'pointer', border: 'none', fontSize: '1.2rem' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
          
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>
            👥 Simulateur de Groupe
          </h1>
          <p style={{ fontSize: '1.1rem', color: theme.textSec, marginBottom: '30px' }}>
            Investissement collectif avec répartition équitable
          </p>

          <Card>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>🏦 Sélection du Fonds</h2>
            
            <select 
              value={selectedFund.name} 
              onChange={(e) => setSelectedFund(funds.find(f => f.name === e.target.value))} 
              style={{ 
                width: '100%', 
                padding: '14px', 
                borderRadius: '12px', 
                background: theme.inputBg, 
                color: theme.text, 
                border: 'none', 
                fontSize: '1rem', 
                cursor: 'pointer', 
                fontWeight: '600',
                marginBottom: '20px'
              }}
            >
              {funds.map(fund => {
                const isRecommended = recommendedGroupFunds.some(f => f.name === fund.name);
                const isTooLow = totalInv < fund.minimum;
                const isTooHigh = totalInv > fund.maximum;
                return (
                  <option key={fund.name} value={fund.name}>
                    {fund.icon} {fund.name} (Min: {formatCurrency(fund.minimum)})
                    {isRecommended ? ' 🎯 Recommandé' : isTooLow ? ' ⚠️ Minimum non atteint' : isTooHigh ? ' ⚠️ Maximum dépassé' : ''}
                  </option>
                );
              })}
            </select>

            {totalInv > 0 && recommendedGroupFunds.length > 0 && recommendedGroupFunds.length < funds.length && (
              <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem', color: '#60a5fa', fontWeight: '600' }}>
                💡 {recommendedGroupFunds.length} fonds compatibles avec votre budget de {formatCurrency(totalInv)}
              </div>
            )}

            <div style={{ padding: '20px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#a78bfa', marginBottom: '10px' }}>
                {selectedFund.icon} {selectedFund.name}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '15px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: theme.textSec }}>Taux</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#a78bfa' }}>{formatPercent(selectedFund.rateGrowth * 100)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: theme.textSec }}>Durée</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#34d399' }}>{selectedFund.duration} mois</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: theme.textSec }}>Minimum</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fbbf24' }}>{formatCurrency(selectedFund.minimum)}</div>
                </div>
              </div>
            </div>

            {!isGroupValid && (
              <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: '#f87171', fontWeight: '600', textAlign: 'center' }}>
                ⚠️ Total ({formatCurrency(totalInv)}) inférieur au minimum ({formatCurrency(selectedFund.minimum)})
              </div>
            )}
          </Card>

          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>👥 Membres ({groupMembers.length})</h2>
              <button 
                onClick={addMember}
                style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: 'none', cursor: 'pointer', fontWeight: '600' }}
              >
                + Ajouter
              </button>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
              {groupMembers.map((member, index) => (
                <MemberInputRow
                  key={member.id}
                  member={member}
                  index={index}
                  theme={theme}
                  onUpdate={updateMember}
                  onDelete={removeMember}
                  canDelete={groupMembers.length > 2}
                />
              ))}
            </div>
          </Card>

          {isGroupValid && (
            <>
              <Card>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>📊 Résumé - Total Investi</h2>
                <div style={{ padding: '25px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.05))', borderRadius: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', color: theme.textSec, marginBottom: '8px' }}>💰 Total Investi par le Groupe</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#a78bfa' }}>{formatCurrency(totalInv)}</div>
                  <div style={{ fontSize: '0.85rem', color: theme.textSec, marginTop: '10px' }}>
                    ⏱️ Durée : {selectedFund.duration} mois ({workingDays} jours ouvrables)
                  </div>
                </div>
              </Card>

              <Card>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>📈 Growth View - Gains Linéaires</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                  <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))', borderRadius: '14px' }}>
                    <div style={{ fontSize: '0.85rem', color: theme.textSec, marginBottom: '8px' }}>🎯 Gains Totaux</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#3b82f6' }}>{formatCurrency(totalGainsGrowth)}</div>
                  </div>
                  <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))', borderRadius: '14px' }}>
                    <div style={{ fontSize: '0.85rem', color: theme.textSec, marginBottom: '8px' }}>💼 Capital Final</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#3b82f6' }}>{formatCurrency(groupGrowthView)}</div>
                  </div>
                  <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))', borderRadius: '14px' }}>
                    <div style={{ fontSize: '0.85rem', color: theme.textSec, marginBottom: '8px' }}>📊 ROI</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#3b82f6' }}>+{formatPercent(((groupGrowthView - totalInv) / totalInv) * 100)}</div>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '15px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: theme.textSec }}>Membre</th>
                        <th style={{ padding: '15px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600', color: theme.textSec }}>Investi</th>
                        <th style={{ padding: '15px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600', color: theme.textSec }}>Part %</th>
                        <th style={{ padding: '15px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600', color: theme.textSec }}>Gains</th>
                        <th style={{ padding: '15px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600', color: theme.textSec }}>Final</th>
                      </tr>
                    </thead>
                    <tbody>
                      {membersWithCalcGrowth.map((member, index) => (
                        <tr key={member.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '15px', fontSize: '0.95rem', fontWeight: '600' }}>
                            <span style={{ display: 'inline-block', width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', textAlign: 'center', lineHeight: '30px', marginRight: '10px', color: 'white', fontSize: '0.85rem' }}>
                              {String.fromCharCode(65 + index)}
                            </span>
                            {member.name}
                          </td>
                          <td style={{ padding: '15px', textAlign: 'right', fontSize: '0.95rem', fontWeight: '600' }}>{formatCurrency(member.amount)}</td>
                          <td style={{ padding: '15px', textAlign: 'right', fontSize: '0.95rem', fontWeight: '700', color: '#60a5fa' }}>{formatPercent(member.percentage)}</td>
                          <td style={{ padding: '15px', textAlign: 'right', fontSize: '0.95rem', fontWeight: '700', color: '#3b82f6' }}>+{formatCurrency(member.memberGains)}</td>
                          <td style={{ padding: '15px', textAlign: 'right', fontSize: '1.1rem', fontWeight: '800', color: '#3b82f6' }}>{formatCurrency(member.finalCapital)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>🚀 Compound View - Gains Composés</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                  <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))', borderRadius: '14px' }}>
                    <div style={{ fontSize: '0.85rem', color: theme.textSec, marginBottom: '8px' }}>🎯 Gains Totaux</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>{formatCurrency(totalGainsCompound)}</div>
                  </div>
                  <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))', borderRadius: '14px' }}>
                    <div style={{ fontSize: '0.85rem', color: theme.textSec, marginBottom: '8px' }}>🚀 Capital Final</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>{formatCurrency(groupCompoundView)}</div>
                  </div>
                  <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))', borderRadius: '14px' }}>
                    <div style={{ fontSize: '0.85rem', color: theme.textSec, marginBottom: '8px' }}>📊 ROI</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>+{formatPercent(((groupCompoundView - totalInv) / totalInv) * 100)}</div>
                  </div>
                </div>

                <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', fontSize: '0.9rem', color: '#10b981', lineHeight: '1.6' }}>
                  <div style={{ fontWeight: '700', marginBottom: '8px' }}>💡 Système de compound LGM :</div>
                  <div style={{ fontSize: '0.85rem' }}>
                    • Seuil de réinvestissement : <strong>100 $ minimum</strong><br />
                    • Petits montants (gain &lt; 100 $/jour) : Accumulation jusqu'à 100 $, puis réinvestissement<br />
                    • Gros montants (gain ≥ 100 $/jour) : Réinvestissement quotidien automatique<br />
                    • Ce calcul reflète le système réel de LGM pour des résultats précis
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '15px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: theme.textSec }}>Membre</th>
                        <th style={{ padding: '15px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600', color: theme.textSec }}>Investi</th>
                        <th style={{ padding: '15px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600', color: theme.textSec }}>Part %</th>
                        <th style={{ padding: '15px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600', color: theme.textSec }}>Gains</th>
                        <th style={{ padding: '15px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600', color: theme.textSec }}>Final</th>
                      </tr>
                    </thead>
                    <tbody>
                      {membersWithCalcCompound.map((member, index) => (
                        <tr key={member.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '15px', fontSize: '0.95rem', fontWeight: '600' }}>
                            <span style={{ display: 'inline-block', width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #34d399)', textAlign: 'center', lineHeight: '30px', marginRight: '10px', color: 'white', fontSize: '0.85rem' }}>
                              {String.fromCharCode(65 + index)}
                            </span>
                            {member.name}
                          </td>
                          <td style={{ padding: '15px', textAlign: 'right', fontSize: '0.95rem', fontWeight: '600' }}>{formatCurrency(member.amount)}</td>
                          <td style={{ padding: '15px', textAlign: 'right', fontSize: '0.95rem', fontWeight: '700', color: '#34d399' }}>{formatPercent(member.percentage)}</td>
                          <td style={{ padding: '15px', textAlign: 'right', fontSize: '0.95rem', fontWeight: '700', color: '#10b981' }}>+{formatCurrency(member.memberGains)}</td>
                          <td style={{ padding: '15px', textAlign: 'right', fontSize: '1.1rem', fontWeight: '800', color: '#10b981' }}>{formatCurrency(member.finalCapital)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}

          <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.05))', borderRadius: '16px', padding: '25px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#60a5fa', marginBottom: '10px' }}>📝 Recommandation</div>
            <p style={{ fontSize: '0.95rem', color: theme.textSec, lineHeight: '1.6' }}>
              Documentez cet accord par écrit avec les noms, contributions et répartition des gains.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // PAGE PRINCIPALE COMPLÈTE
  return (
    <div style={{ minHeight: '100vh', background: theme.bg, padding: '40px 20px', color: theme.text, fontFamily: 'system-ui' }}>
      {/* Toggle Dark/Light Mode - Position fixe en haut à droite */}
      <button 
        onClick={() => setDarkMode(!darkMode)} 
        style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          padding: '8px 12px', 
          borderRadius: '10px', 
          border: `1px solid ${theme.cardBorder}`, 
          background: theme.cardBg, 
          color: theme.text, 
          fontSize: '1.2rem', 
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1000,
          transition: 'all 0.2s ease',
          opacity: 0.7
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.7'}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>
            Draham Invest Calculator
          </h1>
          <p style={{ fontSize: '1.1rem', color: theme.textSec, marginBottom: '20px' }}>
            Choisissez votre stratégie : Revenus, Croissance ou Capitalisation
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setShowHelp(!showHelp)} style={{ padding: '10px 18px', borderRadius: '12px', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, fontSize: '0.9rem', cursor: 'pointer', fontWeight: '600' }}>
              ❓ Aide
            </button>
          </div>
        </div>

        {showHelp && (
          <div style={{ background: theme.cardBg, borderRadius: '16px', padding: '25px', marginBottom: '30px', border: `1px solid ${theme.cardBorder}`, boxShadow: theme.shadow }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: theme.text }}>📚 Guide complet</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {Object.values(viewDescriptions).map((view) => (
                <div key={view.title} style={{ padding: '15px', background: theme.hoverBg, borderRadius: '10px', borderLeft: `4px solid ${view.color}` }}>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: view.color, marginBottom: '8px' }}>{view.icon} {view.title}</div>
                  <div style={{ fontSize: '0.9rem', color: theme.textSec, lineHeight: '1.5' }}>{view.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
          <button onClick={() => setCurrentView('group')} style={{ padding: '12px 24px', borderRadius: '12px', border: '2px solid rgba(236, 72, 153, 0.5)', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.15))', color: '#ec4899', fontSize: '0.95rem', cursor: 'pointer', fontWeight: '700' }}>
            👥 Simulateur de Groupe ✨
          </button>
          <button onClick={() => { setShowComparison(!showComparison); setShowGoalMode(false); setShowHistory(false); }} style={{ padding: '12px 24px', borderRadius: '12px', border: showComparison ? '2px solid #3b82f6' : `2px solid ${theme.cardBorder}`, background: showComparison ? 'rgba(59, 130, 246, 0.15)' : theme.cardBg, color: showComparison ? '#3b82f6' : theme.text, cursor: 'pointer', fontWeight: '600' }}>
            ⚖️ Comparateur
          </button>
          <button onClick={() => { setShowGoalMode(!showGoalMode); setShowComparison(false); setShowHistory(false); }} style={{ padding: '12px 24px', borderRadius: '12px', border: showGoalMode ? '2px solid #10b981' : `2px solid ${theme.cardBorder}`, background: showGoalMode ? 'rgba(16, 185, 129, 0.15)' : theme.cardBg, color: showGoalMode ? '#10b981' : theme.text, cursor: 'pointer', fontWeight: '600' }}>
            🎯 Mode Objectif
          </button>
          <button onClick={() => { setShowHistory(!showHistory); setShowComparison(false); setShowGoalMode(false); }} style={{ padding: '12px 24px', borderRadius: '12px', border: showHistory ? '2px solid #f59e0b' : `2px solid ${theme.cardBorder}`, background: showHistory ? 'rgba(245, 158, 11, 0.15)' : theme.cardBg, color: showHistory ? '#f59e0b' : theme.text, cursor: 'pointer', fontWeight: '600' }}>
            📊 Historique ({savedSimulations.length})
          </button>
          <button onClick={saveSimulation} disabled={!isValid} style={{ padding: '12px 24px', borderRadius: '12px', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: isValid ? theme.text : theme.textSec, cursor: isValid ? 'pointer' : 'not-allowed', fontWeight: '600', opacity: isValid ? 1 : 0.5 }}>
            💾 Sauvegarder
          </button>
          <button onClick={() => exportResults(false)} disabled={!isValid} style={{ padding: '12px 24px', borderRadius: '12px', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: isValid ? theme.text : theme.textSec, cursor: isValid ? 'pointer' : 'not-allowed', fontWeight: '600', opacity: isValid ? 1 : 0.5 }}>
            📄 Copier
          </button>
        </div>

        {showGoalMode && (
          <Card>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎯</div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '10px', background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Mode Objectif
              </h2>
              <p style={{ fontSize: '0.95rem', color: theme.textSec }}>
                Définissez vos gains souhaités et découvrez le meilleur fonds pour les atteindre
              </p>
            </div>
            
            {/* Input de l'objectif */}
            <div style={{ marginBottom: '35px' }}>
              <label style={{ display: 'block', marginBottom: '15px', fontWeight: '700', fontSize: '1.1rem', textAlign: 'center' }}>
                💰 Quel est votre objectif de gains ?
              </label>
              
              <div style={{ marginBottom: '20px' }}>
                <TargetGainInput
                  targetGain={targetGain}
                  min={1000}
                  max={5000000}
                  theme={theme}
                  onUpdate={setTargetGain}
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
                      Aucun fonds ne permet d'atteindre <strong style={{ color: theme.text }}>{formatCurrency(targetGain)}</strong> de gains avec les contraintes actuelles (investissement maximum de 1M$ par fonds).
                    </div>
                    <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#f87171' }}>
                      💡 Essayez un objectif plus bas ou envisagez d'investir dans plusieurs fonds simultanément
                    </div>
                  </div>
                );
              }

              return (
                <>
                  {/* Badge de succès */}
                  <div style={{ marginBottom: '25px', padding: '15px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))', borderRadius: '12px', textAlign: 'center', border: '2px solid rgba(16, 185, 129, 0.3)' }}>
                    <div style={{ fontSize: '1rem', color: '#10b981', fontWeight: '700' }}>
                      ✅ {goalResults.length} fonds compatible{goalResults.length > 1 ? 's' : ''} trouvé{goalResults.length > 1 ? 's' : ''} !
                    </div>
                    <div style={{ fontSize: '0.85rem', color: theme.textSec, marginTop: '5px' }}>
                      Triés par montant requis (du moins cher au plus cher)
                    </div>
                  </div>

                  {/* Liste de TOUS les fonds compatibles */}
                  <div style={{ display: 'grid', gap: '20px' }}>
                    {goalResults.map((result, idx) => (
                      <div key={idx} style={{ 
                        padding: '25px', 
                        background: idx === 0 ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))' : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.05))', 
                        borderRadius: '18px',
                        border: idx === 0 ? '3px solid #10b981' : `2px solid ${theme.cardBorder}`,
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {/* Badge pour le plus accessible */}
                        {idx === 0 && (
                          <div style={{ 
                            position: 'absolute', 
                            top: '15px', 
                            right: '15px', 
                            padding: '8px 16px', 
                            background: 'linear-gradient(135deg, #10b981, #34d399)', 
                            borderRadius: '20px', 
                            fontSize: '0.85rem', 
                            fontWeight: '800', 
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                          }}>
                            💰 PLUS ACCESSIBLE
                          </div>
                        )}

                        {/* Header du fonds */}
                        <div style={{ marginBottom: '20px' }}>
                          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{result.fund.icon}</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: idx === 0 ? '#10b981' : '#a78bfa', marginBottom: '8px' }}>
                            {result.fund.name}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: theme.textSec }}>
                            📅 Durée: {result.fund.duration} mois • 📈 Taux Income: {formatPercent(result.fund.rateIncome * 100)}/jour • Growth/Compound: {formatPercent(result.fund.rateGrowth * 100)}/jour
                          </div>
                        </div>

                        {/* MONTANT MINIMUM REQUIS - Le plus important */}
                        <div style={{ 
                          padding: '25px', 
                          background: idx === 0 ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.1))' : 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.05))', 
                          borderRadius: '14px', 
                          marginBottom: '20px',
                          textAlign: 'center',
                          border: idx === 0 ? '2px solid #10b981' : '2px solid rgba(99, 102, 241, 0.3)'
                        }}>
                          <div style={{ fontSize: '0.95rem', color: theme.textSec, marginBottom: '10px', fontWeight: '600' }}>
                            💰 Montant MINIMUM à investir
                          </div>
                          <div style={{ fontSize: '2.8rem', fontWeight: '900', color: idx === 0 ? '#10b981' : '#a78bfa', marginBottom: '10px' }}>
                            {formatCurrency(result.requiredCapital)}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: theme.textSec }}>
                            Limites du fonds: {formatCurrency(result.fund.minimum)} - {formatCurrency(result.fund.maximum)}
                          </div>
                        </div>

                        {/* LES 3 TYPES D'INVESTISSEMENT */}
                        <div style={{ marginBottom: '15px' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '15px', textAlign: 'center', color: theme.text }}>
                            📊 Résultats selon le type d'investissement
                          </div>

                          <div style={{ display: 'grid', gap: '15px' }}>
                            {/* Income View */}
                            <div style={{ 
                              padding: '18px', 
                              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))', 
                              borderRadius: '12px', 
                              border: '2px solid rgba(239, 68, 68, 0.3)' 
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ef4444', marginBottom: '4px' }}>
                                    💰 Income View
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: theme.textSec }}>
                                    Capital constant, gains retirés quotidiennement
                                  </div>
                                </div>
                                <div style={{ 
                                  padding: '6px 14px', 
                                  background: '#ef4444', 
                                  borderRadius: '10px', 
                                  fontSize: '0.8rem', 
                                  fontWeight: '800', 
                                  color: 'white',
                                  flexShrink: 0
                                }}>
                                  ROI: +{formatPercent(result.roiIncome)}
                                </div>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                                <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                  <div style={{ fontSize: '0.7rem', color: theme.textSec, marginBottom: '4px' }}>💵 Gains totaux</div>
                                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ef4444' }}>
                                    +{formatCurrency(result.incomeGain)}
                                  </div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                  <div style={{ fontSize: '0.7rem', color: theme.textSec, marginBottom: '4px' }}>💼 Capital final</div>
                                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ef4444' }}>
                                    {formatCurrency(result.incomeFinal)}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Growth View */}
                            <div style={{ 
                              padding: '18px', 
                              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))', 
                              borderRadius: '12px', 
                              border: '2px solid rgba(59, 130, 246, 0.3)' 
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>
                                    📈 Growth View
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: theme.textSec }}>
                                    Gains accumulés sans réinvestissement
                                  </div>
                                </div>
                                <div style={{ 
                                  padding: '6px 14px', 
                                  background: '#3b82f6', 
                                  borderRadius: '10px', 
                                  fontSize: '0.8rem', 
                                  fontWeight: '800', 
                                  color: 'white',
                                  flexShrink: 0
                                }}>
                                  ROI: +{formatPercent(result.roiGrowth)}
                                </div>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                                <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                  <div style={{ fontSize: '0.7rem', color: theme.textSec, marginBottom: '4px' }}>💵 Gains totaux</div>
                                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#3b82f6' }}>
                                    +{formatCurrency(result.growthGain)}
                                  </div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                  <div style={{ fontSize: '0.7rem', color: theme.textSec, marginBottom: '4px' }}>💼 Capital final</div>
                                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#3b82f6' }}>
                                    {formatCurrency(result.growthFinal)}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Compound View */}
                            <div style={{ 
                              padding: '18px', 
                              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))', 
                              borderRadius: '12px', 
                              border: '2px solid rgba(16, 185, 129, 0.3)' 
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
                                    🚀 Compound View
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: theme.textSec }}>
                                    Réinvestissement automatique (seuil 100$)
                                  </div>
                                </div>
                                <div style={{ 
                                  padding: '6px 14px', 
                                  background: '#10b981', 
                                  borderRadius: '10px', 
                                  fontSize: '0.8rem', 
                                  fontWeight: '800', 
                                  color: 'white',
                                  flexShrink: 0
                                }}>
                                  ROI: +{formatPercent(result.roiCompound)}
                                </div>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                                <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                  <div style={{ fontSize: '0.7rem', color: theme.textSec, marginBottom: '4px' }}>💵 Gains totaux</div>
                                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#10b981' }}>
                                    +{formatCurrency(result.compoundGain)}
                                  </div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                  <div style={{ fontSize: '0.7rem', color: theme.textSec, marginBottom: '4px' }}>💼 Capital final</div>
                                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#10b981' }}>
                                    {formatCurrency(result.compoundFinal)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Comparaison avec l'objectif */}
                        <div style={{ 
                          padding: '15px', 
                          background: 'rgba(99, 102, 241, 0.1)', 
                          borderRadius: '12px',
                          marginTop: '15px'
                        }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '10px', color: theme.text }}>
                            🎯 Comparaison avec votre objectif de {formatCurrency(targetGain)}
                          </div>
                          <div style={{ display: 'grid', gap: '8px', fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: theme.textSec }}>💰 Income :</span>
                              <span style={{ fontWeight: '700', color: result.incomeGain >= targetGain ? '#10b981' : '#f59e0b' }}>
                                {result.incomeGain >= targetGain ? '✅' : '⚠️'} {formatCurrency(result.incomeGain)} 
                                ({result.incomeGain >= targetGain ? '+' : ''}{formatCurrency(result.incomeGain - targetGain)})
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: theme.textSec }}>📈 Growth :</span>
                              <span style={{ fontWeight: '700', color: result.growthGain >= targetGain ? '#10b981' : '#f59e0b' }}>
                                {result.growthGain >= targetGain ? '✅' : '⚠️'} {formatCurrency(result.growthGain)} 
                                ({result.growthGain >= targetGain ? '+' : ''}{formatCurrency(result.growthGain - targetGain)})
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: theme.textSec }}>🚀 Compound :</span>
                              <span style={{ fontWeight: '700', color: '#10b981' }}>
                                ✅ {formatCurrency(result.compoundGain)} 
                                (+{formatCurrency(result.compoundGain - targetGain)})
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Indicateur de précision */}
                        {Math.abs(result.compoundGain - targetGain) < Math.max(1000, targetGain * 0.02) && (
                          <div style={{ 
                            marginTop: '15px',
                            padding: '12px', 
                            background: 'rgba(16, 185, 129, 0.2)', 
                            borderRadius: '10px', 
                            fontSize: '0.85rem', 
                            color: '#10b981', 
                            textAlign: 'center', 
                            fontWeight: '700',
                            border: '2px solid #10b981'
                          }}>
                            🎯 Précision maximale avec Compound : différence de {formatCurrency(Math.abs(result.compoundGain - targetGain))} seulement !
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Astuce */}
                  <div style={{ marginTop: '25px', padding: '18px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '14px', fontSize: '0.9rem', color: '#60a5fa', lineHeight: '1.6', border: `1px solid ${theme.cardBorder}` }}>
                    <div style={{ fontWeight: '700', marginBottom: '8px' }}>💡 Comment choisir :</div>
                    <div style={{ fontSize: '0.85rem' }}>
                      • <strong>Plus accessible</strong> : Choisissez le premier fonds (montant minimum requis le plus bas)<br />
                      • <strong>Meilleur ROI</strong> : Comparez les taux de rendement affichés<br />
                      • <strong>Durée</strong> : Certains fonds sont plus courts (Technology = 12 mois vs 10 mois pour les autres)<br />
                      • Les résultats sont basés sur le mode <strong>Compound</strong> (réinvestissement automatique, seuil 100 $)
                    </div>
                  </div>
                </>
              );
            })()}
          </Card>
        )}

        {showHistory && (
          <Card>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>📊 Historique des simulations</h2>
            {savedSimulations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: theme.textSec }}>Aucune simulation sauvegardée</div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {savedSimulations.map((sim) => (
                  <div key={sim.id} style={{ padding: '15px', background: theme.hoverBg, borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: theme.textSec }}>{sim.date}</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '600', marginTop: '5px' }}>{sim.fund}</div>
                      <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                        {formatCurrency(sim.amount)} → {formatCurrency(sim.amount + sim.gain)} 
                        <span style={{ color: '#10b981', fontWeight: '700', marginLeft: '8px' }}>+{formatPercent(sim.roi)}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteSimulation(sim.id)} style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', cursor: 'pointer', border: 'none', fontSize: '1.2rem' }}>🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}


        {!showGoalMode && !showHistory && !showComparison && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginBottom: '30px' }}>
          <Card>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>🏦 Fonds d'investissement</h2>
            <select value={selectedFund.name} onChange={(e) => setSelectedFund(funds.find(f => f.name === e.target.value))} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: theme.inputBg, color: theme.text, fontWeight: '600', cursor: 'pointer', marginBottom: '20px', border: 'none' }}>
              {funds.map(fund => {
                const isRecommended = recommendedFunds.some(f => f.name === fund.name);
                const isTooLow = amount < fund.minimum;
                const isTooHigh = amount > fund.maximum;
                return (
                  <option key={fund.name} value={fund.name}>
                    {fund.icon} {fund.name} (Min: {formatCurrency(fund.minimum)})
                    {isRecommended ? ' 🎯 Recommandé' : isTooLow ? ' ⚠️ Minimum non atteint' : isTooHigh ? ' ⚠️ Maximum dépassé' : ''}
                  </option>
                );
              })}
            </select>

            {amount > 0 && recommendedFunds.length > 0 && recommendedFunds.length < funds.length && (
              <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem', color: '#60a5fa', fontWeight: '600' }}>
                💡 {recommendedFunds.length} fonds compatibles avec {formatCurrency(amount)}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              <div style={{ padding: '15px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: theme.textSec, marginBottom: '5px' }}>Taux/jour</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#a78bfa' }}>{formatPercent(selectedFund.rateIncome * 100)}</div>
              </div>
              <div style={{ padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: theme.textSec, marginBottom: '5px' }}>Durée</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#34d399' }}>{selectedFund.duration} mois</div>
              </div>
            </div>
            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: theme.textSec, marginBottom: '5px' }}>Investissement minimum</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fbbf24' }}>{formatCurrency(selectedFund.minimum)}</div>
            </div>
          </Card>

          <Card>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>📅 Période d'investissement</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>Mode de calcul :</span>
                <button 
                  onClick={() => setShowDateSelector(!showDateSelector)}
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    background: showDateSelector ? 'rgba(59, 130, 246, 0.2)' : theme.cardBg, 
                    color: showDateSelector ? '#3b82f6' : theme.text, 
                    border: `2px solid ${showDateSelector ? '#3b82f6' : theme.cardBorder}`, 
                    cursor: 'pointer', 
                    fontWeight: '600',
                    fontSize: '0.85rem'
                  }}
                >
                  {showDateSelector ? '📅 Par dates' : '⏱️ Par durée'}
                </button>
              </div>

              {showDateSelector && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: theme.text }}>
                    📆 Date de démarrage :
                  </label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      borderRadius: '8px', 
                      background: theme.inputBg, 
                      color: theme.text, 
                      border: `2px solid ${theme.cardBorder}`, 
                      fontSize: '1rem', 
                      fontWeight: '600'
                    }} 
                  />
                </div>
              )}
            </div>

            <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(99, 102, 241, 0.05))', borderRadius: '14px' }}>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: theme.textSec }}>🚀 Début :</span>
                  <span style={{ fontSize: '1rem', fontWeight: '700', color: '#a78bfa' }}>{formatDate(startDate)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: theme.textSec }}>🏁 Fin :</span>
                  <span style={{ fontSize: '1rem', fontWeight: '700', color: '#10b981' }}>{formatDate(endDate)}</span>
                </div>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: theme.textSec }}>📊 Durée :</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: theme.text }}>{selectedFund.duration} mois ({calendarDays} jours calendaires)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: theme.textSec }}>💼 Jours ouvrables :</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ec4899' }}>{workingDays} jours</span>
                </div>
              </div>
              
              <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', fontSize: '0.85rem', color: '#60a5fa', lineHeight: '1.5' }}>
                💡 Méthode LGM : 20 jours ouvrables par mois (calendrier hors weekends et jours fériés)
              </div>
            </div>
          </Card>

          <Card>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>💰 Montant à investir</h2>
            <div style={{ textAlign: 'center', padding: '25px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.9rem', color: theme.textSec, marginBottom: '8px' }}>Capital investi</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#a78bfa' }}>{formatCurrency(amount)}</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: theme.text }}>
                ✏️ Saisie directe :
              </label>
              <AmountInput 
                amount={amount}
                min={selectedFund.minimum}
                max={maxAmount}
                theme={theme}
                onUpdate={setAmount}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: theme.text }}>
                🎚️ Ou utilisez le slider :
              </label>
              <input type="range" min={selectedFund.minimum} max={maxAmount} step={1000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: theme.text }}>
                🔢 Ou ajustez par paliers :
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                <button onClick={() => setAmount(Math.max(selectedFund.minimum, amount - 10000))} style={{ padding: '10px', borderRadius: '8px', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' }}>−10K</button>
                <button onClick={() => setAmount(Math.max(selectedFund.minimum, amount - 1000))} style={{ padding: '10px', borderRadius: '8px', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' }}>−1K</button>
                <button onClick={() => setAmount(Math.min(maxAmount, amount + 1000))} style={{ padding: '10px', borderRadius: '8px', border: '2px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' }}>+1K</button>
                <button onClick={() => setAmount(Math.min(maxAmount, amount + 10000))} style={{ padding: '10px', borderRadius: '8px', border: '2px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' }}>+10K</button>
              </div>
            </div>

            <div style={{ padding: '12px 20px', borderRadius: '12px', background: isValid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${isValid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, textAlign: 'center', fontSize: '0.95rem', fontWeight: '600', color: isValid ? '#34d399' : '#f87171' }}>
              {isValid ? '✓ Montant valide' : '⚠ Montant insuffisant'}
            </div>
          </Card>

          <Card>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>📊 Résultats des simulations</h2>
            {!isValid ? (
              <div style={{ padding: '40px', textAlign: 'center', color: theme.textSec }}>
                Ajustez le montant au minimum requis
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {/* Income View */}
                <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))', borderRadius: '14px', border: '2px solid rgba(239, 68, 68, 0.3)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px', color: '#ef4444', textAlign: 'center' }}>
                    💰 Income View
                  </div>
                  <div style={{ fontSize: '0.75rem', color: theme.textSec, textAlign: 'center', marginBottom: '15px' }}>
                    Capital constant
                  </div>
                  
                  <div style={{ marginBottom: '15px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: theme.textSec, marginBottom: '4px' }}>💵 Gains quotidiens</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#ef4444' }}>
                      {formatCurrency(dailyGainIncome)}<span style={{ fontSize: '0.8rem', fontWeight: '600' }}> /jour</span>
                    </div>
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px', fontWeight: '600' }}>
                        Total Value
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ef4444' }}>
                        {formatCurrency(incomeView)}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>
                        Capital + Gains
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px', fontWeight: '600' }}>
                        Profit
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ef4444' }}>
                        {formatCurrency(incomeGain)}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>
                        Gains purs
                      </div>
                    </div>
                  </div>
                </div>

                {/* Growth View */}
                <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))', borderRadius: '14px', border: '2px solid rgba(59, 130, 246, 0.3)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px', color: '#3b82f6', textAlign: 'center' }}>
                    📈 Growth View
                  </div>
                  <div style={{ fontSize: '0.75rem', color: theme.textSec, textAlign: 'center', marginBottom: '15px' }}>
                    Accumulation linéaire
                  </div>
                  
                  <div style={{ marginBottom: '15px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: theme.textSec, marginBottom: '4px' }}>💵 Gains quotidiens</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#3b82f6' }}>
                      {formatCurrency(dailyGainGrowth)}<span style={{ fontSize: '0.8rem', fontWeight: '600' }}> /jour</span>
                    </div>
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px', fontWeight: '600' }}>
                        Total Value
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#3b82f6' }}>
                        {formatCurrency(growthView)}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>
                        Capital + Gains
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px', fontWeight: '600' }}>
                        Profit
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#3b82f6' }}>
                        {formatCurrency(growthGain)}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>
                        Gains purs
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compound View */}
                <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))', borderRadius: '14px', border: '2px solid rgba(16, 185, 129, 0.3)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 10px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', borderRadius: '8px', fontSize: '0.65rem', fontWeight: '800', color: 'white' }}>
                    ⭐ OPTIMAL
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px', color: '#10b981', textAlign: 'center' }}>
                    🚀 Compound View
                  </div>
                  <div style={{ fontSize: '0.75rem', color: theme.textSec, textAlign: 'center', marginBottom: '15px' }}>
                    Croissance exponentielle
                  </div>
                  
                  <div style={{ marginBottom: '15px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: theme.textSec, marginBottom: '4px' }}>💎 Réinvestissement auto</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#10b981' }}>
                      Seuil: 100 $
                    </div>
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px', fontWeight: '600' }}>
                        Total Value
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981' }}>
                        {formatCurrency(compoundView)}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>
                        Capital + Gains
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px', fontWeight: '600' }}>
                        Profit
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981' }}>
                        {formatCurrency(compoundGain)}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>
                        Gains purs
                      </div>
                    </div>
                    
                    <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: theme.textSec, marginBottom: '3px', fontWeight: '600' }}>ROI</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#10b981' }}>+{formatPercent(roi)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px', color: theme.textSec, fontSize: '0.9rem', borderTop: `1px solid ${theme.cardBorder}` }}>
          <p>📅 Les gains sont versés uniquement les jours ouvrables</p>
          <p style={{ marginTop: '15px', color: '#ec4899', fontWeight: '600' }}>✨ Simulateur de Groupe disponible</p>
          <p style={{ marginTop: '25px', fontSize: '0.85rem', opacity: 0.7 }}>
            Version 1.3.2 • Dernière mise à jour : 20 décembre 2024
          </p>
          <p style={{ marginTop: '10px', fontSize: '0.8rem', opacity: 0.6 }}>
            🆕 v1.3.2 : Fix mobile groupe • Mode Objectif intelligent<br />
            v1.3.1 : Technology 12 mois • Montants min. dans listes
          </p>
          <p style={{ marginTop: '5px', fontSize: '0.75rem', opacity: 0.5 }}>
            v1.3.0 : Compound réaliste (seuil 100 $) • v1.2 : Formule LGM 20j/mois • v1.1 : Sauvegarde & Export
          </p>
        </div>
      </div>
    </div>
  );
}
