import React, { useState, useCallback } from 'react';

// VERSION DE TEST SIMPLIFIÉE POUR ISOLER LE BUG

export default function InvestmentCalculator() {
  const [currentView, setCurrentView] = useState('group');
  const [groupMembers, setGroupMembers] = useState([
    { id: 1, name: 'Personne A', amount: 500 },
    { id: 2, name: 'Personne B', amount: 500 }
  ]);

  console.log('🔄 RENDER du composant principal');

  // FONCTION AVEC useCallback
  const updateMemberName = useCallback((id, value) => {
    console.log('📝 updateMemberName appelé:', { id, value });
    setGroupMembers(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, name: value } : m);
      console.log('✅ Nouvel état:', updated);
      return updated;
    });
  }, []);

  const updateMemberAmount = useCallback((id, value) => {
    console.log('💰 updateMemberAmount appelé:', { id, value });
    const numValue = value === '' ? 0 : Number(value);
    setGroupMembers(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, amount: numValue } : m);
      console.log('✅ Nouvel état:', updated);
      return updated;
    });
  }, []);

  if (currentView !== 'group') {
    return <div>Page principale</div>;
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui', background: '#1e293b', minHeight: '100vh', color: 'white' }}>
      <h1>🔍 TEST DE DÉBOGAGE - Simulateur de Groupe</h1>
      
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '12px', marginTop: '30px' }}>
        <h2>Membres</h2>
        
        <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
          {groupMembers.map((member, index) => {
            console.log(`🎨 Render ligne membre ${member.id}`);
            
            return (
              <div 
                key={member.id}
                style={{ 
                  padding: '20px', 
                  background: 'rgba(255,255,255,0.1)', 
                  borderRadius: '8px',
                  display: 'grid',
                  gridTemplateColumns: '50px 1fr 1fr',
                  gap: '15px',
                  alignItems: 'center'
                }}
              >
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  {String.fromCharCode(65 + index)}
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', opacity: 0.7 }}>
                    Nom (ID: {member.id})
                  </label>
                  <input 
                    type="text"
                    value={member.name}
                    onChange={(e) => {
                      console.log(`⌨️ INPUT NAME onChange - ID: ${member.id}, Nouvelle valeur: "${e.target.value}"`);
                      updateMemberName(member.id, e.target.value);
                    }}
                    onFocus={() => console.log(`👆 Focus sur input NAME ID ${member.id}`)}
                    onBlur={() => console.log(`👋 Blur sur input NAME ID ${member.id}`)}
                    placeholder="Nom du membre"
                    style={{ 
                      width: '100%',
                      padding: '12px', 
                      borderRadius: '8px', 
                      background: 'rgba(0,0,0,0.3)', 
                      color: 'white', 
                      border: '2px solid rgba(255,255,255,0.2)',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }} 
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', opacity: 0.7 }}>
                    Montant (ID: {member.id})
                  </label>
                  <input 
                    type="number"
                    value={member.amount}
                    onChange={(e) => {
                      console.log(`⌨️ INPUT AMOUNT onChange - ID: ${member.id}, Nouvelle valeur: "${e.target.value}"`);
                      updateMemberAmount(member.id, e.target.value);
                    }}
                    onFocus={() => console.log(`👆 Focus sur input AMOUNT ID ${member.id}`)}
                    onBlur={() => console.log(`👋 Blur sur input AMOUNT ID ${member.id}`)}
                    min="0"
                    step="100"
                    placeholder="Montant"
                    style={{ 
                      width: '100%',
                      padding: '12px', 
                      borderRadius: '8px', 
                      background: 'rgba(0,0,0,0.3)', 
                      color: 'white', 
                      border: '2px solid rgba(255,255,255,0.2)',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px' }}>
        <h3>📊 État actuel</h3>
        <pre style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
          {JSON.stringify(groupMembers, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '12px' }}>
        <h3>🔍 Instructions de test</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Ouvrez la console (F12)</li>
          <li>Cliquez dans un champ "Nom"</li>
          <li>Tapez UN caractère</li>
          <li>Observez les logs dans la console</li>
          <li>Notez si vous voyez des "RENDER" multiples</li>
        </ol>
      </div>
    </div>
  );
}
