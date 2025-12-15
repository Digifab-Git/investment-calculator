import React, { useState } from 'react';

export default function GroupSimulator({ funds, darkMode, onBack, theme }) {
  const [selectedFund, setSelectedFund] = useState(funds[0]);
  const [groupMembers, setGroupMembers] = useState([
    { id: 1, name: 'Personne A', amount: funds[0].minimum },
    { id: 2, name: 'Personne B', amount: funds[0].minimum }
  ]);
  const [nextId, setNextId] = useState(3);

  const calculateWorkingDays = (months) => Math.round(months * 21.4);
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
      fontFamily: 'system-ui',
      color: theme.text
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            background: theme.cardBg,
            color: theme.text,
            fontSize: '1rem',
            cursor: 'pointer',
            marginBottom: '20px',
            fontWeight: '600',
            border: 'none'
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
          Investissement collectif avec répartition équitable
        </p>

        <div style={{
          background: theme.cardBg,
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
            🏦 Fonds
          </h2>

          <select
            value={selectedFund.name}
            onChange={(e) => setSelectedFund(funds.find(f => f.name === e.target.value))}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: theme.inputBg || 'rgba(0,0,0,0.1)',
              color: theme.text,
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '20px',
              border: 'none'
            }}
          >
            {funds.map(fund => (
              <option key={fund.name} value={fund.name}>
                {fund.icon} {fund.name} - {formatPercent(fund.rateGrowth * 100)}/jour
              </option>
            ))}
          </select>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            <div style={{ padding: '15px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: theme.textSecondary, marginBottom: '5px' }}>Taux</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#a78bfa' }}>{formatPercent(selectedFund.rateGrowth * 100)}</div>
            </div>
            <div style={{ padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: theme.textSecondary, marginBottom: '5px' }}>Durée</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#34d399' }}>{selectedFund.duration} mois</div>
            </div>
            <div style={{ padding: '15px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: theme.textSecondary, marginBottom: '5px' }}>Minimum</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fbbf24' }}>{formatCurrency(selectedFund.minimum)}</div>
            </div>
          </div>

          {!isValidInvestment && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '12px',
              color: '#f87171',
              fontSize: '0.95rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              ⚠️ Total ({formatCurrency(stats.totalInvestment)}) inférieur au minimum ({formatCurrency(selectedFund.minimum)})
            </div>
          )}
        </div>

        <div style={{
          background: theme.cardBg,
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>
              👥 Membres ({groupMembers.length})
            </h2>
            <button
              onClick={addMember}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                fontSize: '0.95rem',
                cursor: 'pointer',
                fontWeight: '600',
                border: 'none'
              }}
            >
              + Ajouter
            </button>
          </div>

          <div style={{ display: 'grid', gap: '15px' }}>
            {groupMembers.map((member, index) => (
              <div key={member.id} style={{
                padding: '20px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
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
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: theme.inputBg || 'rgba(0,0,0,0.2)',
                    color: theme.text,
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    border: 'none'
                  }}
                />

                <input
                  type="number"
                  value={member.amount}
                  onChange={(e) => updateMember(member.id, 'amount', e.target.value)}
                  min="0"
                  step="1000"
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: theme.inputBg || 'rgba(0,0,0,0.2)',
                    color: theme.text,
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    border: 'none'
                  }}
                />

                <button
                  onClick={() => removeMember(member.id)}
                  disabled={groupMembers.length <= 2}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: groupMembers.length <= 2 ? 'rgba(0,0,0,0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: groupMembers.length <= 2 ? theme.textSecondary : '#f87171',
                    cursor: groupMembers.length <= 2 ? 'not-allowed' : 'pointer',
                    fontSize: '1.2rem',
                    opacity: groupMembers.length <= 2 ? 0.5 : 1,
                    border: 'none'
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        {isValidInvestment && (
          <div style={{
            background: theme.cardBg,
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
              📊 Résumé
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.05))',
                borderRadius: '14px'
              }}>
                <div style={{ fontSize: '0.9rem', color: theme.textSecondary, marginBottom: '8px' }}>💰 Total Investi</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#a78bfa' }}>{formatCurrency(stats.totalInvestment)}</div>
              </div>

              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))',
                borderRadius: '14px'
              }}>
                <div style={{ fontSize: '0.9rem', color: theme.textSecondary, marginBottom: '8px' }}>🎯 Gains Totaux</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>{formatCurrency(stats.totalGains)}</div>
              </div>

              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.05))',
                borderRadius: '14px'
              }}>
                <div style={{ fontSize: '0.9rem', color: theme.textSecondary, marginBottom: '8px' }}>🚀 Capital Final</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ec4899' }}>{formatCurrency(stats.groupFinalCapital)}</div>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '15px', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600' }}>Membre</th>
                    <th style={{ padding: '15px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600' }}>Investi</th>
                    <th style={{ padding: '15px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600' }}>Part %</th>
                    <th style={{ padding: '15px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600' }}>Gains</th>
                    <th style={{ padding: '15px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600' }}>Final</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.members.map((member, index) => (
                    <tr key={member.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
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

        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.05))',
          borderRadius: '16px',
          padding: '25px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#60a5fa', marginBottom: '10px' }}>
            📝 Recommandation
          </div>
          <p style={{ fontSize: '0.95rem', color: theme.textSecondary, lineHeight: '1.6' }}>
            Documentez cet accord par écrit avec les noms, contributions et répartition des gains.
          </p>
        </div>
      </div>
    </div>
  );
}
