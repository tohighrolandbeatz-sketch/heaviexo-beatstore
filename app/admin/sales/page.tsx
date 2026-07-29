'use client';

import { useState } from 'react';

export default function AdminSalesPage() {
  const [links, setLinks] = useState({
    mp3: 'https://www.paypal.com/ncp/payment/ZSS69K9VHU59C',
    wav: 'https://www.paypal.com/ncp/payment/8ATGLJLD9WVBC',
    stems: 'https://www.paypal.com/ncp/payment/WG64S2QL5RUNL',
    exclusive: 'https://www.paypal.com/ncp/payment/XU9GSXMKN2HKL'
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '16px', padding: '30px', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: '#ff6b35', textTransform: 'uppercase' }}>
          🔗 Liens de Paiement & Livraison Automatique
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {saved && <span style={{ color: '#22c55e', fontSize: '12px' }}>Sauvegardé !</span>}
          <button type="submit" style={{ background: 'linear-gradient(135deg, #ff6b35, #e85d26)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
            💾 Sauvegarder
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Lien PayPal (MP3)</label>
          <input type="text" value={links.mp3} onChange={(e) => setLinks({...links, mp3: e.target.value})} style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Lien PayPal (WAV)</label>
          <input type="text" value={links.wav} onChange={(e) => setLinks({...links, wav: e.target.value})} style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Lien PayPal (STEMS)</label>
          <input type="text" value={links.stems} onChange={(e) => setLinks({...links, stems: e.target.value})} style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Lien PayPal (EXCLUSIVE)</label>
          <input type="text" value={links.exclusive} onChange={(e) => setLinks({...links, exclusive: e.target.value})} style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }} />
        </div>
      </div>
    </form>
  );
}