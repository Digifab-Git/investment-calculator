import React, { useState, useEffect } from 'react';

export default function GroupSimulator({ funds, darkMode, onBack, theme }) {
  const [selectedFund, setSelectedFund] = useState(funds[0]);
  const [groupMembers, setGroupMembers] = useState([
    { id: 1, name: 'Personne A', amount: 100000, percentage: 0, gains: 0, finalCapital: 0 },
    { id: 2, name: 'Personne B', amount: 150000, percentage: 0, gains: 0, finalCapital: 0 }
  ]);
  const [nextId, setNextId] = useState(3);

  const calculateWorkingDays = (months) => {
    const workingDaysPerMonth = 21.4;
    return Math.round(months * workingDaysPerMonth);
  };

  const calculateGroupStats = () => {
    const totalInvestment = groupMembers.reduce((sum, member) => sum + parseFloat(member.amount || 0), 0);
    const workingDays = calculateWorkingDays(selectedFund.duration);
    
    let groupFinalCapital = totalInvestment * Math.pow(1 + selectedFund.rateGrowth, workingDays);
    const totalGains = groupFinalCapital - totalInvestment;
    
    const updatedMembers = groupMembers.map(member => {
      const memberAmount = parseFloat(member.amount || 0);
      const percentage = totalInvestment > 0 ? (memberAmount / totalInvestment) * 100 : 0;
      const memberFinalCapital = (percentage / 100) * groupFinalCapital;
      const memberGains = memberFinalCapital - memberAmount;
      
      return {
        ...member,
        percentage: percentage,
        gains: memberGains,
        finalCapital: memberFinalCapital
      };
    });
    
    return {
      totalInvestment,
      groupFinalCapital,
      totalGains,
      members: updatedMembers,
      workingDays
    };
  };

  const stats = calculateGroupStats();
  const isValidInvestment = stats.totalInvestment >= selectedFund.minimum;

  useEffect(() => {
    setGroupMembers(stats.members);
  }, [JSON.stringify(groupMembers.map(m => ({ id: m.id, amount: m.amount }))), selectedFund]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value) => `${value.toFixed(2)}%`;

  const addMember = () => {
    setGroupMembers([
      ...groupMembers,
      { id: nextId, name: `Personne ${String.fromCharCode(64 + nextId)}`, amount: 50000, percentage: 0, gains: 0, finalCapital: 0 }
    ]);
    setNextId(nextId + 1);
  };

  const removeMember = (id) => {
    if (groupMembers.length > 2) {
      setGroupMembers(groupMembers.filter(m => m.id !== id));
    }
  };

  const updateMember = (id, field, value) => {
    setGroupMembers(groupMembers.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const Card = ({ children, style = {} }) => (
    <div style={{
      background: theme.cardBg,
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '30px',
      border: `1px solid ${theme.cardBorder}`,
      boxShadow: theme.shadow,
      transition: 'all 0.3s ease',
      ...style
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
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={onBack}
            style={{
              marginBottom: '20px',
              padding: '12px 24px',
              borderRadius: '12px',
              border: `2px solid ${theme.cardBorder}`,
              background: theme.cardBg,
              color: theme.text,
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ← Retour au calculateur
          </button>
          
          <div style={{
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px',
              letterSpacing: '-0.02em'
            }}>
              👥 Simulateur d'Investissement de Groupe
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: theme.textSecondary,
              fontWeight: '400'
            }}>
              Calculez automatiquement la répartition équitable des gains entre investisseurs
            </p>
          </div>
        </div>

        {/* Sélection du fonds */}
        <Card style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px', color: theme.text }}>
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
              transition: 'all 0.3s ease',
              outline: 'none',
              marginBottom: '15px'
            }}
          >
            {funds.map(fund => (
              <option key={fund.name} value={fund.name}>
                {fund.icon} {fund.name} - {(fund.rateGrowth * 100).toFixed(2)}% par jour - Min: {formatCurrency(fund.minimum)} - {fund.duration} mois
              </option>
            ))}
          </select>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            <div style={{
              padding: '12px',
              background: 'rgba(99, 102, 241, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(99, 102, 241, 0.2)'
            }}>
              <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '4px' }}>
                Taux journalier
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#a78bfa' }}>
                {formatPercent(selectedFund.rateGrowth * 100)}
              </div>
            </div>
            <div style={{
              padding: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '4px' }}>
                Durée
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#34d399' }}>
                {selectedFund.duration} mois
              </div>
            </div>
            <div style={{
              padding: '12px',
              background: 'rgba(245, 158, 11, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
              <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '4px' }}>
                Jours ouvrables
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fbbf24' }}>
                {stats.workingDays}
              </div>
            </div>
            <div style={{
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <div style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '4px' }}>
                Minimum requis
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#f87171' }}>
                {formatCurrency(selectedFund.minimum)}
              </div>
            </div>
          </div>
        </Card>

        {/* Alerte si investissement insuffisant */}
        {!isValidInvestment && (
          <div style={{
            padding: '15px 20px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <div>
              <div style={{ fontWeight: '700', color: '#f87171', marginBottom: '4px' }}>
                Investissement insuffisant
              </div>
              <div style={{ fontSize: '0.9rem', color: theme.textSecondary }}>
                Total actuel : {formatCurrency(stats.totalInvestment)} • Minimum requis : {formatCurrency(selectedFund.minimum)}
              </div>
            </div>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '25px',
          marginBottom: '30px'
        }}>
          {/* Section Membres */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: theme.text, margin: 0 }}>
                👥 Membres du groupe ({groupMembers.length})
              </h2>
              <button
                onClick={addMember}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '2px solid rgba(16, 185, 129, 0.3)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                + Ajouter
              </button>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
              {groupMembers.map((member, index) => (
                <div
                  key={member.id}
                  style={{
                    padding: '18px',
                    background: theme.hoverBg,
                    borderRadius: '12px',
                    border: `1px solid ${theme.cardBorder}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${selectedFund.color}40, ${selectedFund.color}20)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        color: selectedFund.color,
                        fontSize: '1.1rem'
                      }}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: `1px solid ${theme.cardBorder}`,
                          background: theme.inputBg,
                          color: theme.text,
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          outline: 'none'
                        }}
                      />
                    </div>
                    {groupMembers.length > 2 && (
                      <button
                        onClick={() => removeMember(member.id)}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#f87171',
                          cursor: 'pointer',
                          fontSize: '1.1rem',
                          marginLeft: '10px'
                        }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: theme.textSecondary,
                      marginBottom: '6px',
                      fontWeight: '600'
                    }}>
                      Montant investi
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: theme.textSecondary,
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}>
                        $
                      </span>
                      <input
                        type="number"
                        value={member.amount}
                        onChange={(e) => updateMember(member.id, 'amount', parseFloat(e.target.value) || 0)}
                        style={{
                          width: '100%',
                          padding: '10px 14px 10px 28px',
                          borderRadius: '8px',
                          border: `1px solid ${theme.cardBorder}`,
                          background: theme.inputBg,
                          color: theme.text,
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          outline: 'none'
                        }}
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>

                  {isValidInvestment && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      <div style={{
                        padding: '8px',
                        background: theme.inputBg,
                        borderRadius: '6px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '0.7rem', color: theme.textSecondary, marginBottom: '2px' }}>
                          Part
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#3b82f6' }}>
                          {formatPercent(member.percentage)}
                        </div>
                      </div>
                      <div style={{
                        padding: '8px',
                        background: theme.inputBg,
                        borderRadius: '6px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '0.7rem', color: theme.textSecondary, marginBottom: '2px' }}>
                          Gains
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#10b981' }}>
                          {formatCurrency(member.gains)}
                        </div>
                      </div>
                      <div style={{
                        padding: '8px',
                        background: theme.inputBg,
                        borderRadius: '6px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '0.7rem', color: theme.textSecondary, marginBottom: '2px' }}>
                          Total
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#a78bfa' }}>
                          {formatCurrency(member.finalCapital)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Section Résumé */}
          <Card>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', color: theme.text }}>
              📊 Résumé du groupe
            </h2>

            <div style={{ display: 'grid', gap: '15px' }}>
              {/* Total investi */}
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))',
                borderRadius: '14px',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <div style={{ fontSize: '0.85rem', color: theme.textSecondary, marginBottom: '6px', fontWeight: '600' }}>
                  💰 Investissement total
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: theme.text }}>
                  {formatCurrency(stats.totalInvestment)}
                </div>
              </div>

              {isValidInvestment && (
                <>
                  {/* Gains totaux */}
                  <div style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))',
                    borderRadius: '14px',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: theme.textSecondary, marginBottom: '6px', fontWeight: '600' }}>
                      📈 Gains totaux du groupe
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: '800', color: theme.text }}>
                      {formatCurrency(stats.totalGains)}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: '700', marginTop: '6px' }}>
                      ROI: {formatPercent((stats.totalGains / stats.totalInvestment) * 100)}
                    </div>
                  </div>

                  {/* Capital final */}
                  <div style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(168, 85, 247, 0.05))',
                    borderRadius: '14px',
                    border: '1px solid rgba(168, 85, 247, 0.3)'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: theme.textSecondary, marginBottom: '6px', fontWeight: '600' }}>
                      💎 Capital final du groupe
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: '800', color: theme.text }}>
                      {formatCurrency(stats.groupFinalCapital)}
                    </div>
                  </div>

                  {/* Tableau récapitulatif */}
                  <div style={{
                    padding: '18px',
                    background: theme.hoverBg,
                    borderRadius: '12px',
                    border: `1px solid ${theme.cardBorder}`
                  }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '15px', color: theme.text }}>
                      Répartition détaillée
                    </h3>
                    
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {groupMembers.map((member, index) => (
                        <div key={member.id} style={{
                          padding: '12px',
                          background: theme.inputBg,
                          borderRadius: '8px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: `${selectedFund.color}30`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                color: selectedFund.color,
                                fontSize: '0.85rem'
                              }}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span style={{ fontWeight: '600', color: theme.text, fontSize: '0.95rem' }}>
                                {member.name}
                              </span>
                            </div>
                            <span style={{ fontWeight: '800', color: '#3b82f6', fontSize: '0.9rem' }}>
                              {formatPercent(member.percentage)}
                            </span>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '0.8rem' }}>
                            <div>
                              <div style={{ color: theme.textSecondary, marginBottom: '2px' }}>Investi</div>
                              <div style={{ fontWeight: '700', color: theme.text }}>
                                {formatCurrency(member.amount)}
                              </div>
                            </div>
                            <div>
                              <div style={{ color: theme.textSecondary, marginBottom: '2px' }}>Gains</div>
                              <div style={{ fontWeight: '700', color: '#10b981' }}>
                                {formatCurrency(member.gains)}
                              </div>
                            </div>
                            <div>
                              <div style={{ color: theme.textSecondary, marginBottom: '2px' }}>Final</div>
                              <div style={{ fontWeight: '700', color: '#a78bfa' }}>
                                {formatCurrency(member.finalCapital)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Recommandation */}
        {isValidInvestment && (
          <Card style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f59e0b', marginBottom: '12px' }}>
              💡 Recommandation importante
            </h3>
            <p style={{ fontSize: '0.9rem', color: theme.textSecondary, marginBottom: '15px', lineHeight: '1.6' }}>
              Pour éviter tout conflit, créez un document écrit précisant les éléments suivants :
            </p>
            <ul style={{ fontSize: '0.9rem', color: theme.textSecondary, lineHeight: '1.8', paddingLeft: '20px' }}>
              <li>Apports initiaux de chaque membre ({groupMembers.map(m => `${m.name}: ${formatCurrency(m.amount)}`).join(', ')})</li>
              <li>Pourcentages de répartition ({groupMembers.map(m => `${m.name}: ${formatPercent(m.percentage)}`).join(', ')})</li>
              <li>Fonds choisi : {selectedFund.name} ({selectedFund.duration} mois, {formatPercent(selectedFund.rateGrowth * 100)} par jour)</li>
              <li>Conditions de sortie anticipée</li>
              <li>Règles de réinvestissement des gains</li>
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}
