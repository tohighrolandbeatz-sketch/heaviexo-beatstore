'use client';

import { useState } from 'react';

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7j');

  const ranges = [
    { id: '24h', label: '24h' },
    { id: '7j', label: '7 jours' },
    { id: '30j', label: '30 jours' },
    { id: '12m', label: '12 mois' },
    { id: 'all', label: 'Tout' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* En-tête & Filtres de Période */}
      <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '16px', padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: '#ff6b35', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📊</span> Analytics & Tracking en Temps Réel
        </h2>
        <div style={{ display: 'flex', gap: '8px', background: '#0f0e0d', padding: '5px', borderRadius: '10px', border: '1px solid #26221f' }}>
          {ranges.map((r) => (
            <button
              key={r.id}
              onClick={() => setTimeRange(r.id)}
              style={{
                background: timeRange === r.id ? '#ff6b35' : 'transparent',
                color: timeRange === r.id ? '#fff' : '#888',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                fontWeight: 'bold',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* GRILLE DES MÉTRIQUES PRINCIPALES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        
        <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '14px', padding: '20px' }}>
          <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Chiffre d'Affaires (CA)</p>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#ff6b35' }}>1,245.00 $</h3>
        </div>

        <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '14px', padding: '20px' }}>
          <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Ventes (purchase)</p>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>38</h3>
        </div>

        <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '14px', padding: '20px' }}>
          <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Visiteurs (page_view)</p>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>3,412</h3>
        </div>

        <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '14px', padding: '20px' }}>
          <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Visiteurs Uniques</p>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>2,850</h3>
        </div>

        <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '14px', padding: '20px' }}>
          <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Écoutes (beat_play)</p>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>5,120</h3>
        </div>

        <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '14px', padding: '20px' }}>
          <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Écoutes Complètes (finish)</p>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>3,980</h3>
        </div>

        <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '14px', padding: '20px' }}>
          <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Likes / Favoris</p>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>412</h3>
        </div>

        <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '14px', padding: '20px' }}>
          <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Ajouts Panier (add_to_cart)</p>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>89</h3>
        </div>

        <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '14px', padding: '20px' }}>
          <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Taux de Conversion</p>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#22c55e' }}>1.11 %</h3>
        </div>

        <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '14px', padding: '20px' }}>
          <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Durée Moyenne Session</p>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>3m 42s</h3>
        </div>

      </div>

      {/* CARTE GÉOGRAPHIQUE VISUELLE DES RÉGIONS ACTIVES */}
      <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '16px', padding: '25px' }}>
        <h3 style={{ fontSize: '11px', color: '#ff6b35', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '20px', textTransform: 'uppercase' }}>
          🗺️ Carte Mondiale & Régions les plus Actives
        </h3>
        
        <div style={{ background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '12px', padding: '30px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', alignItems: 'center' }}>
          
          {/* Simulation visuelle d'une carte radar / hotspots mondiaux */}
          <div style={{ height: '260px', background: '#171513', borderRadius: '10px', border: '1px solid #26221f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: '180px', height: '180px', borderRadius: '50%', border: '1px dashed rgba(255,107,53,0.3)' }}></div>
            <div style={{ position: 'absolute', width: '90px', height: '90px', borderRadius: '50%', border: '1px solid rgba(255,107,53,0.5)' }}></div>
            
            {/* Points chauds clignotants */}
            <div style={{ position: 'absolute', top: '55%', left: '48%', width: '12px', height: '12px', background: '#ff6b35', borderRadius: '50%', boxShadow: '0 0 15px #ff6b35' }}></div>
            <div style={{ position: 'absolute', top: '35%', left: '52%', width: '8px', height: '8px', background: '#38bdf8', borderRadius: '50%', boxShadow: '0 0 10px #38bdf8' }}></div>
            <div style={{ position: 'absolute', top: '60%', left: '55%', width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' }}></div>

            <p style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold', zIndex: 2, marginTop: '180px', background: 'rgba(0,0,0,0.7)', padding: '6px 14px', borderRadius: '20px', border: '1px solid #26221f' }}>
              📍 3 Hotspots actifs détectés (Afrique de l'Ouest & Europe)
            </p>
          </div>

          {/* Barres de progression des régions clés */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#fff' }}>Bénin (Littoral / Cotonou)</span>
                <span style={{ color: '#ff6b35', fontWeight: 'bold' }}>45%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#171513', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '45%', height: '100%', background: '#ff6b35', borderRadius: '3px' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#fff' }}>France (Île-de-France / Paris)</span>
                <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>25%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#171513', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '25%', height: '100%', background: '#38bdf8', borderRadius: '3px' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#fff' }}>Côte d'Ivoire (Lagunes / Abidjan)</span>
                <span style={{ color: '#22c55e', fontWeight: 'bold' }}>15%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#171513', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '15%', height: '100%', background: '#22c55e', borderRadius: '3px' }}></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION DES TOPS & CLASSEMENTS DÉTAILLÉS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        
        {/* Top Beats */}
        <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '16px', padding: '25px' }}>
          <h4 style={{ fontSize: '11px', color: '#ff6b35', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '15px', textTransform: 'uppercase' }}>🔥 Top Beats</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0f0e0d', borderRadius: '8px' }}><span>1. OBSIDIAN (Dark Trap)</span> <b style={{ color: '#ff6b35' }}>1,420 écoutes</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0f0e0d', borderRadius: '8px' }}><span>2. PHANTOM (Melodic Drill)</span> <b style={{ color: '#ff6b35' }}>980 écoutes</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0f0e0d', borderRadius: '8px' }}><span>3. TOKYO NIGHTS (Boom Bap)</span> <b style={{ color: '#ff6b35' }}>750 écoutes</b></div>
          </div>
        </div>

        {/* Top Licences */}
        <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '16px', padding: '25px' }}>
          <h4 style={{ fontSize: '11px', color: '#ff6b35', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '15px', textTransform: 'uppercase' }}>📜 Top Licences</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0f0e0d', borderRadius: '8px' }}><span>MP3 Lease (29,99 $)</span> <b style={{ color: '#ff6b35' }}>22 ventes</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0f0e0d', borderRadius: '8px' }}><span>WAV Premium (49,99 $)</span> <b style={{ color: '#ff6b35' }}>11 ventes</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0f0e0d', borderRadius: '8px' }}><span>Trackout / Stems (149 $)</span> <b style={{ color: '#ff6b35' }}>5 ventes</b></div>
          </div>
        </div>

        {/* Top Pays, Régions & Villes */}
        <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '16px', padding: '25px' }}>
          <h4 style={{ fontSize: '11px', color: '#ff6b35', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '15px', textTransform: 'uppercase' }}>🌍 Top Pays & Régions</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0f0e0d', borderRadius: '8px' }}><span>Bénin (Littoral / Cotonou)</span> <b style={{ color: '#fff' }}>45%</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0f0e0d', borderRadius: '8px' }}><span>France (Île-de-France / Paris)</span> <b style={{ color: '#fff' }}>25%</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0f0e0d', borderRadius: '8px' }}><span>Côte d'Ivoire (Lagunes / Abidjan)</span> <b style={{ color: '#fff' }}>15%</b></div>
          </div>
        </div>

        {/* Appareils, Navigateurs & Sources */}
        <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '16px', padding: '25px' }}>
          <h4 style={{ fontSize: '11px', color: '#ff6b35', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '15px', textTransform: 'uppercase' }}>📱 Appareils, Navigateurs & Sources</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#0f0e0d', borderRadius: '8px' }}><span style={{ color: '#888' }}>Appareils :</span> <b>Mobile (68%) / Desktop (32%)</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#0f0e0d', borderRadius: '8px' }}><span style={{ color: '#888' }}>Navigateurs :</span> <b>Chrome / Safari / Firefox</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#0f0e0d', borderRadius: '8px' }}><span style={{ color: '#888' }}>Sources trafic :</span> <b>Instagram / YouTube / Direct</b></div>
          </div>
        </div>

      </div>

    </div>
  );
}