'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Music, Package, Tags, Settings, CreditCard, BarChart3, Globe, ListMusic, MessageSquare, Users, Layers } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Tableau de Bord', href: '/admin', icon: LayoutDashboard },
    { name: 'Catalogue', href: '/admin/beats', icon: Music },
    { name: 'Sound Kits', href: '/admin/kits', icon: Package },
    { name: 'Licences & Prix', href: '/admin/licenses', icon: Tags },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Liens & Paiements', href: '/admin/sales', icon: CreditCard },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Promo & SEO', href: '/admin/promo', icon: Globe },
    { name: 'Playlist Spotify', href: '/admin/playlist', icon: ListMusic },
    { name: 'Commentaires', href: '/admin/comments', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#0f0e0d] text-white font-sans">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
        
        {/* En-tête */}
        <div className="mb-6">
          <span className="text-[10px] text-gray-500 tracking-[1.5px] uppercase">
            ESPACE PRIVÉ - HEAVIEX'O
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-wide text-white uppercase mt-1">
            Control Center
          </h1>
        </div>

        {/* Navigation */}
        <nav className="bg-[#171513] p-4 rounded-2xl border border-[#26221f] mb-8 flex gap-2 overflow-x-auto items-center whitespace-nowrap scrollbar-none">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
                  isActive 
                    ? 'bg-[#ff6b35] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-[#201d1a]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Contenu */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}