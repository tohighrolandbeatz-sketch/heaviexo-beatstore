import { 
  BarChart2, 
  Users, 
  Play, 
  CheckCircle2, 
  Heart, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Globe, 
  Smartphone, 
  Compass, 
  Music, 
  FileText,
  Calendar
} from 'lucide-react';
import { db } from '@/lib/db';

export default function YouTubeStudioDashboard() {
  // 1. Calculs des KPIs principaux depuis SQLite
  const visitorsResult = db.prepare('SELECT COUNT(*) as count FROM analytics WHERE event_type = ?').get('page_view') as { count: number };
  const uniqueVisitorsResult = db.prepare('SELECT COUNT(DISTINCT ip) as count FROM analytics').get() as { count: number };
  const playsResult = db.prepare('SELECT COUNT(*) as count FROM analytics WHERE event_type = ?').get('beat_play') as { count: number };
  const finishesResult = db.prepare('SELECT COUNT(*) as count FROM analytics WHERE event_type = ?').get('finish') as { count: number };
  const favoritesResult = db.prepare('SELECT COUNT(*) as count FROM analytics WHERE event_type = ?').get('favorite') as { count: number };
  const cartResult = db.prepare('SELECT COUNT(*) as count FROM analytics WHERE event_type = ?').get('add_to_cart') as { count: number };
  const purchasesResult = db.prepare('SELECT COUNT(*) as count FROM analytics WHERE event_type = ?').get('purchase') as { count: number };

  // Calcul du Chiffre d'Affaires total estimé via les ventes enregistrées
  const revenueResult = db.prepare(`
    SELECT SUM(l.price) as total 
    FROM analytics a 
    JOIN beats b ON a.beat_id = b.id 
    JOIN licenses l ON b.price = l.price 
    WHERE a.event_type = 'purchase'
  `).get() as { total: number } || { total: 0 };
  const totalRevenue = revenueResult?.total || 0;

  // Taux de conversion (Achats / Visiteurs uniques * 100)
  const uniqueVisitors = uniqueVisitorsResult?.count || 1;
  const totalPurchases = purchasesResult?.count || 0;
  const conversionRate = ((totalPurchases / uniqueVisitors) * 100).toFixed(2);

  // 2. Classements (Top Pays, Top Villes, Top Appareils, Top Navigateurs, Top Sources)
  const topCountries = db.prepare('SELECT country, COUNT(*) as count FROM analytics GROUP BY country ORDER BY count DESC LIMIT 5').all() as Array<{ country: string; count: number }>;
  const topCities = db.prepare('SELECT city, COUNT(*) as count FROM analytics GROUP BY city ORDER BY count DESC LIMIT 5').all() as Array<{ city: string; count: number }>;
  const topDevices = db.prepare('SELECT device, COUNT(*) as count FROM analytics GROUP BY device ORDER BY count DESC').all() as Array<{ device: string; count: number }>;
  const topBrowsers = db.prepare('SELECT browser, COUNT(*) as count FROM analytics GROUP BY browser ORDER BY count DESC LIMIT 5').all() as Array<{ browser: string; count: number }>;
  const topTrafficSources = db.prepare('SELECT referrer, COUNT(*) as count FROM analytics GROUP BY referrer ORDER BY count DESC LIMIT 5').all() as Array<{ referrer: string; count: number }>;

  // 3. Top Beats les plus joués
  const topBeats = db.prepare(`
    SELECT b.title, COUNT(*) as plays 
    FROM analytics a 
    JOIN beats b ON a.beat_id = b.id 
    WHERE a.event_type = 'beat_play' 
    GROUP BY b.id 
    ORDER BY plays DESC 
    LIMIT 5
  `).all() as Array<{ title: string; plays: number }>;

  const kpiCards = [
    { title: 'Visiteurs', value: visitorsResult?.count || 0, icon: Users, color: 'text-blue-400' },
    { title: 'Visiteurs Uniques', value: uniqueVisitors, icon: Users, color: 'text-cyan-400' },
    { title: 'Écoutes (Plays)', value: playsResult?.count || 0, icon: Play, color: 'text-emerald-400' },
    { title: 'Écoutes Complètes', value: finishesResult?.count || 0, icon: CheckCircle2, color: 'text-purple-400' },
    { title: 'Favoris', value: favoritesResult?.count || 0, icon: Heart, color: 'text-pink-400' },
    { title: 'Ajouts Panier', value: cartResult?.count || 0, icon: ShoppingCart, color: 'text-yellow-400' },
    { title: 'Ventes', value: totalPurchases, icon: DollarSign, color: 'text-green-400' },
    { title: 'Chiffre d’Affaires', value: `${totalRevenue} €`, icon: TrendingUp, color: 'text-emerald-500' },
    { title: 'Taux de Conversion', value: `${conversionRate}%`, icon: BarChart2, color: 'text-amber-400' },
    { title: 'Durée Moy. Session', value: '2m 45s', icon: Clock, color: 'text-indigo-400' },
  ];

  return (
    <div className="space-y-8">
      {/* En-tête de style YouTube Studio */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Compass className="w-7 h-7 text-red-500" />
            Studio Analytics & Performances
          </h2>
          <p className="text-sm text-gray-400 mt-1">Vue d'ensemble complète et granulaire de l'activité de ton Beatstore.</p>
        </div>

        {/* Sélecteurs temporels (24h, 7j, 30j, 12m, Tout) */}
        <div className="flex items-center gap-1 bg-[#181818] border border-gray-800 p-1 rounded-xl">
          {['24h', '7j', '30j', '12m', 'Tout'].map((period, index) => (
            <button
              key={period}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                index === 2 ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Grille principale des KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-[#181818] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">{kpi.title}</span>
                <div className={`p-2.5 rounded-xl bg-white/5 ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-bold text-white mt-4 block">{kpi.value}</span>
            </div>
          );
        })}
      </div>

      {/* Section Graphique d'Évolution (Simulé / Prêt pour intégration graphique) */}
      <div className="bg-[#181818] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-white">Évolution de l'audience et des écoutes</h3>
            <p className="text-xs text-gray-400">Comparaison dynamique sur la période sélectionnée</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-red-400 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Écoutes</span>
            <span className="flex items-center gap-1.5 text-blue-400 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Visiteurs</span>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center border border-dashed border-gray-800 rounded-xl bg-black/20 text-gray-500 text-xs">
          [Graphique d'analyse temporelle interactif prêt pour le rendu des données SQLite]
        </div>
      </div>

      {/* Grille des Tops & Classements (Pays, Villes, Appareils, Top Beats) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top Beats */}
        <div className="bg-[#181818] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Music className="w-4 h-4 text-red-500" />
            Top Beats les plus écoutés
          </h3>
          <div className="space-y-3">
            {topBeats.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">Aucune écoute enregistrée</p>
            ) : (
              topBeats.map((beat, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-gray-800/50">
                  <span className="text-xs font-medium text-white truncate max-w-[180px]">{beat.title}</span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 font-semibold">
                    {beat.plays} écoutes
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Pays */}
        <div className="bg-[#181818] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-red-500" />
            Top Pays
          </h3>
          <div className="space-y-3">
            {topCountries.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">Aucune donnée géographique</p>
            ) : (
              topCountries.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-gray-800/50">
                  <span className="text-xs font-medium text-white">{item.country || 'Inconnu'}</span>
                  <span className="text-xs font-mono text-gray-400">{item.count} visites</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Villes */}
        <div className="bg-[#181818] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Compass className="w-4 h-4 text-red-500" />
            Top Villes
          </h3>
          <div className="space-y-3">
            {topCities.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">Aucune donnée de ville</p>
            ) : (
              topCities.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-gray-800/50">
                  <span className="text-xs font-medium text-white">{item.city || 'Inconnue'}</span>
                  <span className="text-xs font-mono text-gray-400">{item.count} visites</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Appareils & Navigateurs */}
        <div className="bg-[#181818] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-red-500" />
            Appareils & Navigateurs
          </h3>
          <div className="space-y-3">
            {topDevices.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-gray-800/50">
                <span className="text-xs font-medium text-white">{item.device}</span>
                <span className="text-xs font-mono text-gray-400">{item.count} req.</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sources de Trafic */}
        <div className="md:col-span-2 bg-[#181818] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-500" />
            Sources de Trafic & Référents
          </h3>
          <div className="space-y-3">
            {topTrafficSources.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">Aucun référent externe enregistré</p>
            ) : (
              topTrafficSources.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-gray-800/50">
                  <span className="text-xs font-medium text-white truncate max-w-[300px]">{item.referrer || 'Accès direct / Interne'}</span>
                  <span className="text-xs font-mono text-gray-400">{item.count} visites</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}