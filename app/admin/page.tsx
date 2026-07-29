import { Music, ShoppingCart, DollarSign, TrendingUp, Users, Headphones } from 'lucide-react';
import { db } from '@/lib/db';

export default function AdminDashboardPage() {
  // Récupération des statistiques réelles depuis SQLite sans polluer les composants
  const beatCount = (db.prepare('SELECT COUNT(*) as count FROM beats').get() as { count: number }).count;
  const saleCount = (db.prepare('SELECT COUNT(*) as count FROM sales').get() as { count: number }).count;
  const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
  
  const totalRevenueResult = db.prepare('SELECT SUM(amount) as total FROM sales').get() as { total: number | null };
  const totalRevenue = totalRevenueResult?.total || 0;

  const stats = [
    { name: 'Revenu Total', value: `${totalRevenue.toLocaleString()} €`, icon: DollarSign, change: '+12.5%', trend: 'up' },
    { name: 'Ventes Totales', value: saleCount.toString(), icon: ShoppingCart, change: '+4.2%', trend: 'up' },
    { name: 'Beats Actifs', value: beatCount.toString(), icon: Music, change: 'Catalogue', trend: 'neutral' },
    { name: 'Utilisateurs', value: userCount.toString(), icon: Users, change: '+18.1%', trend: 'up' },
  ];

  return (
    <div className="space-y-8">
      {/* En-tête de bienvenue */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Vue d'ensemble</h2>
        <p className="text-sm text-gray-400 mt-1">Bienvenue dans ton espace de pilotage artistique et commercial.</p>
      </div>

      {/* Grille des cartes statistiques inspirée de YouTube Studio / Spotify for Artists */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.name}
              className="bg-[#181818] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:border-gray-700 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">{stat.name}</span>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-300 group-hover:text-red-500 group-hover:bg-red-500/10 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-bold text-white tracking-tight">{stat.value}</span>
                <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section Activité Récente / Accès Rapide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#181818] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performances Récentes</h3>
          <div className="h-64 flex flex-col items-center justify-center border border-dashed border-gray-800 rounded-xl text-gray-500 text-sm">
            <Headphones className="w-8 h-8 mb-2 opacity-40" />
            Graphiques d'écoute et tendances en cours de chargement...
          </div>
        </div>

        <div className="bg-[#181818] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Actions Rapides</h3>
            <p className="text-xs text-gray-400 mb-6">Gère ton catalogue et tes publications en un clic.</p>
            
            <div className="space-y-3">
              <a 
                href="/admin/beats" 
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition-colors"
              >
                <span>Uploader un nouveau beat</span>
                <Music className="w-4 h-4 text-red-500" />
              </a>
              <a 
                href="/admin/licenses" 
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition-colors"
              >
                <span>Configurer les licences</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </a>
            </div>
          </div>
          <div className="text-xs text-gray-500 pt-4 border-t border-gray-800">
            HeavieX'O Beatstore Engine v2.0
          </div>
        </div>
      </div>
    </div>
  );
}