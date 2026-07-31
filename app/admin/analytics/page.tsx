'use client';

import { useState, useEffect } from 'react';
import { BarChart2, Users, Play, ShoppingCart, DollarSign, Globe, Music, TrendingUp, Activity } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#ff6b35] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-gray-400 text-center py-20">Aucune donnée disponible.</p>;
  }

  const { kpis, topBeats, topCountries, topReferrers, recentEvents } = data;

  const kpiCards = [
    { label: 'Visites totales', value: kpis.totalVisits, icon: Users, color: 'text-blue-400' },
    { label: 'Visiteurs uniques', value: kpis.uniqueIps, icon: Activity, color: 'text-cyan-400' },
    { label: 'Écoutes', value: kpis.beatPlays, icon: Play, color: 'text-emerald-400' },
    { label: 'Ajouts panier', value: kpis.addToCart, icon: ShoppingCart, color: 'text-yellow-400' },
    { label: 'Achats', value: kpis.purchases, icon: DollarSign, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Analytics</h2>
        <p className="text-xs text-gray-400">Statistiques en temps réel de votre Beatstore.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {kpiCards.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-[#171513] border border-[#26221f] rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Beats */}
        <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Music className="w-4 h-4 text-[#ff6b35]" /> Top Beats
          </h3>
          <div className="space-y-3">
            {topBeats?.map((b: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-gray-300 truncate">{b.title || 'Inconnu'}</span>
                <span className="text-xs text-[#ff6b35] font-bold">{b.count} écoutes</span>
              </div>
            ))}
            {(!topBeats || topBeats.length === 0) && <p className="text-xs text-gray-500">Aucune écoute</p>}
          </div>
        </div>

        {/* Top Pays */}
        <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-[#ff6b35]" /> Top Pays
          </h3>
          <div className="space-y-3">
            {topCountries?.map((c: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-gray-300">{c.country || 'Inconnu'}</span>
                <span className="text-xs text-[#ff6b35] font-bold">{c.count}</span>
              </div>
            ))}
            {(!topCountries || topCountries.length === 0) && <p className="text-xs text-gray-500">Aucune donnée</p>}
          </div>
        </div>

        {/* Top Sources */}
        <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#ff6b35]" /> Sources de trafic
          </h3>
          <div className="space-y-3">
            {topReferrers?.map((r: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-gray-300 truncate">{r.referrer || 'Direct'}</span>
                <span className="text-xs text-[#ff6b35] font-bold">{r.count}</span>
              </div>
            ))}
            {(!topReferrers || topReferrers.length === 0) && <p className="text-xs text-gray-500">Aucune donnée</p>}
          </div>
        </div>

        {/* Événements récents */}
        <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#ff6b35]" /> Activité récente
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentEvents?.map((e: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-[#26221f]">
                <span className="text-gray-400">{e.eventType} {e.beatId ? `• ${e.beatId.slice(-8)}` : ''}</span>
                <span className="text-gray-500">{new Date(e.createdAt).toLocaleString('fr')}</span>
              </div>
            ))}
            {(!recentEvents || recentEvents.length === 0) && <p className="text-xs text-gray-500">Aucune activité</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
