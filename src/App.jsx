import React, { useState, useEffect, useCallback } from 'react';

// DESCRIPTIONS
const viewDescriptions = {
  income: { title: '💰 Income View', desc: 'Vous retirez les gains chaque jour ouvrable. Votre capital initial reste constant.', icon: '💰', color: '#ef4444' },
  growth: { title: '📈 Growth View', desc: 'Les gains s\'accumulent sans être réinvestis. Croissance linéaire prévisible.', icon: '📈', color: '#3b82f6' },
  compound: { title: '🚀 Compound View', desc: 'Les gains sont automatiquement réinvestis. Croissance exponentielle maximale !', icon: '🚀', color: '#10b981' }
};

// ✅ COMPOSANT ISOLÉ POUR UNE LIGNE DE MEMBRE - AVEC SON PROPRE STATE LOCAL
function MemberInputRow({ member, index, theme, onUpdate, onDelete, canDelete }) {
  // État LOCAL pour éviter les re-renders du parent
  const [localName, setLocalName] = useState(member.name);
  const [localAmount, setLocalAmount] = useState(member.amount);

  // Sync avec le parent seulement quand on perd le focus
  const handleNameBlur = () => {
    if (localName !== member.name) {
      onUpdate(member.id, { name: localName });
    }
  };

  const handleAmountBlur = () => {
    if (localAmount !== member.amount) {
      onUpdate(member.id, { amount: localAmount });
    }
  };

  return (
    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'grid', gridTemplateColumns: '50px 1fr 1fr auto', gap: '15px', alignItems: 'center' }}>
      <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: '800', color: 'white' }}>
        {String.fromCharCode(65 + index)}
      </div>
      <input 
        type="text" 
        value={localName}
        onChange={(e) => setLocalName(e.target.value)}
        onBlur={handleNameBlur}
        placeholder="Nom du membre"
        style={{ padding: '12px', borderRadius: '8px', background: theme.inputBg, color: theme.text, border: 'none', fontSize: '0.95rem', fontWeight: '600' }} 
      />
      <input 
        type="number" 
        value={localAmount}
        onChange={(e) => setLocalAmount(e.target.value === '' ? 0 : Number(e.target.value))}
        onBlur={handleAmountBlur}
        min="0" 
        step="100" 
        placeholder="Montant"
        style={{ padding: '12px', borderRadius: '8px', background: theme.inputBg, color: theme.text, border: 'none', fontSize: '0.95rem', fontWeight: '600' }} 
      />
      <button 
        onClick={() => onDelete(member.id)}
        disabled={!canDelete}
        style={{ 
          padding: '12px', 
          borderRadius: '8px', 
          background: !canDelete ? 'rgba(0,0,0,0.1)' : 'rgba(239, 68, 68, 0.2)', 
          color: !canDelete ? theme.textSec : '#f87171', 
          border: 'none', 
          cursor: !canDelete ? 'not-allowed' : 'pointer', 
          fontSize: '1.2rem', 
          opacity: !canDelete ? 0.5 : 1 
        }}
      >
        🗑️
      </button>
    </div>
  );
}

export default function InvestmentCalculator() {
  const funds = [
    { name: 'Technology Opportunities Fund', rateIncome: 0.005, rateGrowth: 0.0055, minimum: 500, maximum: 50000, duration: 12, icon: '💻' },
    { name: 'Energy and Natural Resources Fund', rateIncome: 0.006, rateGrowth: 0.0065, minimum: 10000, maximum: 100000, duration: 10, icon: '⚡' },
    { name: 'Fonds pour les Marchés Émergents', rateIncome: 0.009, rateGrowth: 0.010, minimum: 250000, maximum: 1000000, duration: 10, icon: '🌍' },
    { name: 'Fonds International LGMCORP', rateIncome: 0.012, rateGrowth: 0.0125, minimum: 500000, maximum: 5000000, duration: 10, icon: '🌟' }
  ];

  const [selectedFund, setSelectedFund] = useState(funds[0]);
  const [amount, setAmount] = useState(500);
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState('main');
  const [showHelp, setShowHelp] = useState(false);
  
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

  // ✅ CALLBACK STABLE POUR METTRE À JOUR UN MEMBRE
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

  const workingDays = Math.round(selectedFund.duration * 21.4);

  // CALCULS POUR LE GROUPE
  const totalInv = groupMembers.reduce((sum, m) => sum + m.amount, 0);
  const groupFinal = totalInv * Math.pow(1 + selectedFund.rateGrowth, workingDays);
  const totalGains = groupFinal - totalInv;
  const isGroupValid = totalInv >= selectedFund.minimum;

  const membersWithCalc = groupMembers.map(m => {
    const percentage = totalInv > 0 ? (m.amount / totalInv) * 100 : 0;
    const memberGains = (percentage / 100) * groupFinal - m.amount;
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
              {funds.map(fund => (
                <option key={fund.name} value={fund.name}>
                  {fund.icon} {fund.name} (Min: {formatCurrency(fund.minimum)} • Max: {formatCurrency(fund.maximum)})
                </option>
              ))}
            </select>

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem' }}>👥 Membres ({groupMembers.length})</h2>
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
            <Card>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>📊 Résumé</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.05))', borderRadius: '14px' }}>
                  <div style={{ fontSize: '0.9rem', color: theme.textSec, marginBottom: '8px' }}>💰 Total Investi</div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#a78bfa' }}>{formatCurrency(totalInv)}</div>
                </div>
                <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))', borderRadius: '14px' }}>
                  <div style={{ fontSize: '0.9rem', color: theme.textSec, marginBottom: '8px' }}>🎯 Gains Totaux</div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>{formatCurrency(totalGains)}</div>
                </div>
                <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.05))', borderRadius: '14px' }}>
                  <div style={{ fontSize: '0.9rem', color: theme.textSec, marginBottom: '8px' }}>🚀 Capital Final</div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ec4899' }}>{formatCurrency(groupFinal)}</div>
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
                    {membersWithCalc.map((member, index) => (
                      <tr key={member.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '15px', fontSize: '0.95rem', fontWeight: '600' }}>
                          <span style={{ display: 'inline-block', width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', textAlign: 'center', lineHeight: '30px', marginRight: '10px', color: 'white', fontSize: '0.85rem' }}>
                            {String.fromCharCode(65 + index)}
                          </span>
                          {member.name}
                        </td>
                        <td style={{ padding: '15px', textAlign: 'right', fontSize: '0.95rem', fontWeight: '600' }}>{formatCurrency(member.amount)}</td>
                        <td style={{ padding: '15px', textAlign: 'right', fontSize: '0.95rem', fontWeight: '700', color: '#a78bfa' }}>{formatPercent(member.percentage)}</td>
                        <td style={{ padding: '15px', textAlign: 'right', fontSize: '0.95rem', fontWeight: '700', color: '#10b981' }}>+{formatCurrency(member.memberGains)}</td>
                        <td style={{ padding: '15px', textAlign: 'right', fontSize: '1.1rem', fontWeight: '800', color: '#ec4899' }}>{formatCurrency(member.finalCapital)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
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

  // PAGE PRINCIPALE
  return (
    <div style={{ minHeight: '100vh', background: theme.bg, padding: '40px 20px', color: theme.text, fontFamily: 'system-ui' }}>
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
            <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '10px 18px', borderRadius: '12px', border: `2px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, fontSize: '1.2rem', cursor: 'pointer' }}>
              {darkMode ? '☀️' : '🌙'}
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

        <button onClick={() => setCurrentView('group')} style={{ padding: '12px 24px', borderRadius: '12px', border: '2px solid rgba(236, 72, 153, 0.5)', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.15))', color: '#ec4899', fontSize: '0.95rem', cursor: 'pointer', fontWeight: '700', display: 'block', margin: '0 auto' }}>
          👥 Simulateur de Groupe ✨
        </button>

        <div style={{ textAlign: 'center', padding: '100px 20px', color: theme.textSec, marginTop: '40px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '20px' }}>🎯 SOLUTION EXPERT</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>État LOCAL dans chaque input</p>
          <p style={{ fontSize: '1.1rem' }}>Sync au parent seulement sur BLUR</p>
          <p style={{ fontSize: '1rem', marginTop: '30px', opacity: 0.7 }}>Les inputs ne perdent JAMAIS le focus !</p>
        </div>
      </div>
    </div>
  );
}
