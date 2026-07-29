'use client';

import { useState, useEffect } from 'react';

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7j');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const ranges = [
    { id: '24h', label: '24h' },
    { id: '7j', label: '7 jours' },
    { id: '30j', label: '30 jours' },
    { id: '12m', label: '12 mois' },
    { id: 'all', label: 'Tout' },
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?range=${timeRange}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [timeRange]);

  if (loading || !data) {
    return <div style={{ color: '#888', padding: '40px' }}>Chargement des analytics...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '16px', padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: '#ff6b35', textTransform: 'uppercase' }}>
          📊 Analytics & Tracking en Temps Réel
        </h2>
        <div style={{ display: 'flex', gap: '8px', background: '#0f0e0d', padding: '5px', borderRadius: '10px', border: '1px solid #26221f' }}>
          {ranges.map((r) => (
            <button key={r.id} onClick={() => setTimeRange(r.id)} style={{
              background: timeRange === r.id ? '#ff6b35' : 'transparent',
              color: timeRange === r.id ? '#fff' : '#888',
              border: 'none', borderRadius: '8px', padding: '8px 14px',
              fontWeight: 'bold', fontSize: '11px', cursor: 'pointer',
            }}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <Metric label="Chiffre d'Affaires (CA)" value={`${data.ca} $`} color="#ff6b35" />
        <Metric label="Ventes (purchase)" value={data.ventes} />
        <Metric label="Visiteurs (page_view)" value={data.visiteurs} />
        <Metric label="Visiteurs Uniques" value={data.visiteursUniques} />
        <Metric label="Écoutes (beat_play)" value={data.ecoutes} />
        <Metric label="Écoutes Complètes (finish)" value={data.ecoutesCompletes} />
        <Metric label="Likes / Favoris" value={data.likes} />
        <Metric label="Ajouts Panier (add_to_cart)" value={data.ajoutsPanier} />
        <Metric label="Taux de Conversion" value={`${data.tauxConversion} %`} color="#22c55e" />
      </div>

      <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '16px', padding: '25px' }}>
        <h3 style={{ fontSize: '11px', color: '#ff6b35', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>
          🌍 Top Pays & Régions
        </h3>
        {data.topCountries.length === 0 && <p style={{ color: '#888', fontSize: '13px' }}>Aucune donnée pour cette période.</p>}
        {data.topCountries.map((c: any) => (
          <div key={c.country} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: '#fff' }}>{c.country}</span>
              <span style={{ color: '#ff6b35', fontWeight: 'bold' }}>{c.pct}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#0f0e0d', borderRadius: '3px' }}>
              <div style={{ width: `${c.pct}%`, height: '100%', background: '#ff6b35', borderRadius: '3px' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value, color = '#fff' }: { label: string; value: any; color?: string }) {
  return (
    <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '14px', padding: '20px' }}>
      <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</p>
      <h3 style={{ fontSize: '22px', fontWeight: 'bold', color }}>{value}</h3>
    </div>
  );
}