'use client';

import { useState } from 'react';

export default function AdminPromoPage() {
  const [promos, setPromos] = useState([
    { code: 'HEAVIE20', discount: '-20%' },
    { code: 'VIPBEATS', discount: '-10 $' }
  ]);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');

  const handleAddPromo = () => {
    if (newCode && newDiscount) {
      setPromos([...promos, { code: newCode.toUpperCase(), discount: newDiscount }]);
      setNewCode('');
      setNewDiscount('');
    }
  };

  const handleRemovePromo = (code: string) => {
    setPromos(promos.filter(p => p.code !== code));
  };

  return (
    <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '16px', padding: '30px', color: '#fff' }}>
      <h2 style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: '#ff6b35', textTransform: 'uppercase', marginBottom: '20px' }}>
        🏷️ Codes Promo & Réductions
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '15px', marginBottom: '25px', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Code</label>
          <input type="text" placeholder="ex: SUMMER20" value={newCode} onChange={(e) => setNewCode(e.target.value)} style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Remise</label>
          <input type="text" placeholder="ex: -15%" value={newDiscount} onChange={(e) => setNewDiscount(e.target.value)} style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }} />
        </div>
        <button type="button" onClick={handleAddPromo} style={{ background: 'linear-gradient(135deg, #ff6b35, #e85d26)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', height: '43px' }}>
          Ajouter
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {promos.map((p) => (
          <span key={p.code} style={{ background: '#0f0e0d', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #26221f', color: '#fff' }}>
            <b>{p.code}</b> <span style={{ color: '#ff6b35' }}>({p.discount})</span>
            <span onClick={() => handleRemovePromo(p.code)} style={{ color: '#888', cursor: 'pointer', fontWeight: 'bold' }}>×</span>
          </span>
        ))}
      </div>
    </div>
  );
}