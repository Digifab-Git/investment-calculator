import React, { useState } from 'react';

export default function GroupSimulator({ funds, darkMode, onBack, theme }) {
  const [selectedFund, setSelectedFund] = useState(funds[0]);
  const [groupMembers, setGroupMembers] = useState([
    { id: 1, name: 'Personne A', amount: selectedFund.minimum },
    { id: 2, name: 'Personne B', amount: selectedFund.minimum }
  ]);
  const [nextId, setNextId] = useState(3);

  const calculateWorkingDays = (months) => {
    const workingDaysPerMonth = 21.4;
    return Math.round(months * workingDaysPerMonth);
  };

  const workingDays = calculateWorkingDays(selectedFund.duration);

  const calculateGroupStats = () => {
    const totalInvestment = groupMembers.reduce((sum, m) => sum + m.amount, 0);
    const groupFinalCapital = totalInvestment * Math.pow(1 + selectedFund.rateGrowth, workingDays);
    const totalGains = groupFinalCapital - totalInvestment;

    const members = groupMembers.map(member => {
      const percentage = (member.amount / totalInvestment) * 100;
      const memberGains = (percentage / 100) * groupFinalCapital - member.amount;
      const finalCapital = member.amount + memberGains;
      return { ...member, percentage, memberGains, finalCapital };
    });

    return { totalInvestment, groupFinalCapital, totalGains, members };
  };

  const stats = calculateGroupStats();
  const isValidInvestment = stats.totalInvestment >= selectedFund.minimum;

  const addMember = () => {
    setGroupMembers([...groupMembers, {
      id: nextId,
      name: `Personne ${String.fromCharCode(64 + nextId)}`,
      amount: selectedFund.minimum
    }]);
    setNextId(nextId + 1);
  };

  const removeMember = (id) => {
    if (groupMembers.length > 2) {
      setGroupMembers(groupMembers.filter(m => m.id !== id));
    }
  };

  const updateMember = (id, field, value) => {
    setGroupMembers(groupMembers.map(m =>
      m.id === id ? { ...m, [field]: field === 'amount' ? Number(value) : value } : m
    ));
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
        {/* Header avec bouton retour */}
        <div style={{ marginBottom: '40px' }}>
          <button
            onClick={onBack}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: `2px solid ${theme.cardBorder}`,
              background: theme.cardBg,
              color: theme.text,
              fontSize: '1rem',
              cursor: 'pointer',
              marginBottom: '20px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = theme.hoverBg}
            onMouseLeave={(e) => e.currentTarget.style.background = theme.cardBg}
          >
            ← Retour au calculateur
          </button>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            👥 Simulateur d'Investissement de Groupe
          </h1>
          <p style={{ fontSize: '1.1rem', color: theme.textSecondary }}>
            Planifiez un investissement collectif avec répartition équitable des gains
          </p>
        </div>

        {/* Sélection du fonds */}
        <div style={{
          background: theme.cardBg,
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: theme.shadow
        }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
            🏦 Sélection du Fonds
          </h2>

          <select
            value={selectedFund.name}
            onChange={(e) => setSelectedFund(funds.find(f => f.name === e.target.value))}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: `2px solid ${theme.cardBorder}`,
              background: theme.inputBg,
              color: theme.text,
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            {funds.map(fund => (
              <option key={fund.name} value={fund.name}>
                {fund.icon} {fund.name} - Taux: {formatPercent(fund.rateGrowth * 100)}/jour
              </option>
            ))}
          </select>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ padding: '15px', background: theme.hoverBg, borderRadius: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: theme.textSecondary, marginBottom: '5px' }}>
                Taux journalier
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#a78bfa' }}>
                {formatPercent(selectedFund.rateGrowth * 100)}
              </div>
            </div>
            <div style={{ padding: '15px', background: theme.hoverBg, borderRadius: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: theme.textSecondary, marginBottom: '5px' }}>
                Durée
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#34d399' }}>
                {selectedFund.duration} mois
              </div>
            </div>
            <div style={{ padding: '15px', background: theme.hoverBg, borderRadius: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: theme.textSecondary, marginBottom: '5px' }}>
                Jours ouvrables
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#60a5fa' }}>
                {workingDays} jours
              </div>
            </div>
            <div style={{ padding: '15px', background: theme.hoverBg, borderRadius: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: theme.textSecondary, marginBottom: '5px' }}>
                Minimum requis
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fbbf24' }}>
                {formatCurrency(selectedFund.minimum)}
              </div>
            </div>
          </div>

          {!isValidInvestment && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              color: '#f87171',
              fontSize: '0.95rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              ⚠️ L'investissement total du groupe ({formatCurrency(stats.totalInvestment)}) est inférieur au minimum requis ({formatCurrency(selectedFund.minimum)})
            </div>
          )}
        </div>

        {/* Gestion des membres */}
        <div style={{
          background: theme.cardBg,
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: theme.shadow
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>
              👥 Membres du Groupe ({groupMembers.length})
            </h2>
            <button
              onClick={addMember}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: '2px solid #10b981',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                fontSize: '0.95rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              + Ajouter un membre
            </button>
          </div>

          <div style={{ display: 'grid', gap: '15px' }}>
            {groupMembers.map((member, index) => (
              <div key={member.id} style={{
                padding: '20px',
                background: theme.hoverBg,
                borderRadius: '12px',
                border: `1px solid ${theme.cardBorder}`,
                display: 'grid',
                gridTemplateColumns: '50px 1fr 1fr auto',
                gap: '15px',
                alignItems: 'center'
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
                  fontWeight: '800',
                  color: 'white'
                }}>
                  {String.fromCharCode(65 + index)}
                </div>

                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                  placeholder="Nom du membre"
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: `2px solid ${theme.cardBorder}`,
                    background: theme.inputBg,
                    color: theme.text,
                    fontSize: '0.95rem',
                    fontWeight: '600'
                  }}
                />

                <input
                  type="number"
                  value={member.amount}
                  onChange={(e) => updateMember(member.id, 'amount', e.target.value)}
                  placeholder="Montant"
                  min="0"
                  step="1000"
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: `2px solid ${theme.cardBorder}`,
                    background: theme.inputBg,
                    color: theme.text,
                    fontSize: '0.95rem',
                    fontWeight: '600'
                  }}
                />

                <button
                  onClick={() => removeMember(member.id)}
                  disabled={groupMembers.length <= 2}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: groupMembers.length <= 2 ? theme.hoverBg : 'rgba(239, 68, 68, 0.1)',
                    color: groupMembers.length <= 2 ? theme.textSecondary : '#f87171',
                    cursor: groupMembers.length <= 2 ? 'not-allowed' : 'pointer',
                    fontSize: '1.2rem',
                    opacity: groupMembers.length <= 2 ? 0.5 : 1
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: 'rgba(99, 102, 241, 0.1)',
            borderRadius: '10px',
            fontSize: '0.9rem',
            color: theme.textSecondary,
            textAlign: 'center'
          }}>
            💡 Minimum 2 membres requis pour un investissement de groupe
          </div>
        </div>

        {/* Résumé */}
        {isValidInvestment && (
          <div style={{
            background: theme.cardBg,
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: theme.shadow
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
              📊 Résumé du Groupe
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.05))',
                borderRadius: '14px',
                border: '2px solid rgba(99, 102, 241, 0.3)'
              }}>
                <div style={{ fontSize: '0.9rem', color: theme.textSecondary, marginBottom: '8px' }}>
                  💰 Investissement Total
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#a78bfa' }}>
                  {formatCurrency(stats.totalInvestment)}
                </div>
              </div>

              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))',
                borderRadius: '14px',
                border: '2px solid rgba(16, 185, 129, 0.3)'
              }}>
                <div style={{ fontSize: '0.9rem', color: theme.textSecondary, marginBottom: '8px' }}>
                  🎯 Gains Totaux
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>
                  {formatCurrency(stats.totalGains)}
                </div>
              </div>

              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.05))',
                borderRadius: '14px',
                border: '2px solid rgba(236, 72, 153, 0.3)'
              }}>
                <div style={{ fontSize: '0.9rem', color: theme.textSecondary, marginBottom: '8px' }}>
                  🚀 Capital Final
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ec4899' }}>
                  {formatCurrency(stats.groupFinalCapital)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tableau récapitulatif */}
        {isValidInvestment && (
          <div style={{
            background: theme.cardBg,
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: theme.shadow
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
              📋 Répartition Détaillée
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${theme.cardBorder}` }}>
                    <th style={{ padding: '15px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: theme.textSecondary }}>Membre</th>
                    <th style={{ padding: '15px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600', color: theme.textSecondary }}>Investissement</th>
                    <th style={{ padding: '15px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600', color: theme.textSecondary }}>Part (%)</th>
                    <th style={{ padding: '15px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600', color: theme.textSecondary }}>Gains</th>
                    <th style={{ padding: '15px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600', color: theme.textSecondary }}>Capital Final</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.members.map((member, index) => (
                    <tr key={member.id} style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
                      <td style={{ padding: '15px', fontSize: '0.95rem', fontWeight: '600' }}>
                        <span style={{
                          display: 'inline-block',
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                          textAlign: 'center',
                          lineHeight: '30px',
                          marginRight: '10px',
                          color: 'white',
                          fontSize: '0.85rem'
                        }}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        {member.name}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'right', fontSize: '0.95rem', fontWeight: '600' }}>
                        {formatCurrency(member.amount)}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'right', fontSize: '0.95rem', fontWeight: '700', color: '#a78bfa' }}>
                        {formatPercent(member.percentage)}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'right', fontSize: '0.95rem', fontWeight: '700', color: '#10b981' }}>
                        +{formatCurrency(member.memberGains)}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'right', fontSize: '1.1rem', fontWeight: '800', color: '#ec4899' }}>
                        {formatCurrency(member.finalCapital)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recommandation */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.05))',
          borderRadius: '16px',
          padding: '25px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#60a5fa', marginBottom: '10px' }}>
            📝 Recommandation importante
          </div>
          <p style={{ fontSize: '0.95rem', color: theme.textSecondary, lineHeight: '1.6' }}>
            Pour sécuriser votre investissement de groupe, nous vous recommandons de documenter cet accord par écrit. 
            Incluez les noms des participants, leurs contributions respectives, et la répartition des gains calculée ci-dessus.
          </p>
        </div>
      </div>
    </div>
  );
}
