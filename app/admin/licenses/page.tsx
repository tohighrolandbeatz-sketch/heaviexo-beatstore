'use client';

import { useState } from 'react';

type License = {
  id: string;
  name: string;
  price: string;
  terms: string;
};

export default function AdminLicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([
    { id: '1', name: 'MP3 Lease', price: '29,99', terms: 'Fichier MP3 320kbps, Jusqu\'à 100 000 streams, 2 500 ventes max, 1 Clip Vidéo (YouTube), Usage commercial autorisé' },
    { id: '2', name: 'WAV Premium', price: '49,99', terms: 'Fichier WAV + MP3 haute qualité, Jusqu\'à 500 000 streams, 5 000 ventes max, 2 Clips Vidéos & Radio, Usage commercial autorisé' },
    { id: '3', name: 'Trackout / Stems', price: '149', terms: 'Toutes les pistes séparées (WAV), Streams illimités, Ventes illimitées, Clips & Radio illimités, Liberté totale de remix' },
    { id: '4', name: 'Exclusive Rights', price: '997', terms: 'Propriété exclusive (Retiré du store), Droits et ventes illimités, Cession totale d\'exploitation, HeavieXo conserve 100% parts auteur (BMI)' },
  ]);

  const [saved, setSaved] = useState(false);

  const handleChange = (id: string, field: 'name' | 'price' | 'terms', value: string) => {
    setLicenses(licenses.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      <form onSubmit={handleSave} style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '16px', padding: '30px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: '#ff6b35', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎹</span> Gestion des Licences & Prix
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {saved && <span style={{ color: '#22c55e', fontSize: '12px' }}>Modifications sauvegardées !</span>}
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #ff6b35, #e85d26)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '12px',
                letterSpacing: '0.5px'
              }}
            >
              💾 Sauvegarder
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {licenses.map((lic) => (
            <div key={lic.id} style={{ background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Nom de la licence</label>
                  <input
                    type="text"
                    value={lic.name}
                    onChange={(e) => handleChange(lic.id, 'name', e.target.value)}
                    style={{ width: '100%', background: '#171513', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Prix ($)</label>
                  <input
                    type="text"
                    value={lic.price}
                    onChange={(e) => handleChange(lic.id, 'price', e.target.value)}
                    style={{ width: '100%', background: '#171513', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#ff6b35', fontWeight: 'bold', outline: 'none', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Fonctionnalités / Termes (séparés par des virgules)</label>
                <textarea
                  value={lic.terms}
                  onChange={(e) => handleChange(lic.id, 'terms', e.target.value)}
                  style={{ width: '100%', background: '#171513', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px', minHeight: '70px', resize: 'vertical' }}
                />
              </div>
            </div>
          ))}
        </div>

      </form>

    </div>
  );
}