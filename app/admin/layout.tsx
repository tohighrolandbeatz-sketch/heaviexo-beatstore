'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Catalogue', href: '/admin/beats' },
    { name: 'Sound Kits', href: '/admin/kits' },
    { name: 'Licences & Prix', href: '/admin/licenses' },
    { name: 'Settings', href: '/admin/settings' },
    { name: 'Liens & Paiements', href: '/admin/sales' },
    { name: 'Analytics', href: '/admin/analytics' },
    { name: 'Promo & SEO', href: '/admin/promo' }, // Assure-toi d'avoir un dossier /admin/promo si tu veux y mettre les codes promo, ou garde /admin/analytics pour les promos et un autre pour les stats
    { name: 'Playlist Spotify', href: '/admin/playlist' },
    { name: 'Commentaires', href: '/admin/comments' },
    { name: 'Utilisateurs', href: '/admin/users' },
  ];

  return (
    <div style={{ padding: '30px', color: '#fff', background: '#0f0e0d', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* En-tête ESPACE PRIVÉ / CONTROL CENTER */}
        <div style={{ marginBottom: '15px' }}>
          <span style={{ fontSize: '10px', color: '#888', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            ESPACE PRIVÉ - HEAVIEX'O
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '1px', color: '#fff', textTransform: 'uppercase', marginTop: '2px' }}>
            CONTROL CENTER
          </h1>
        </div>

        {/* Barre de navigation principale */}
        <div style={{ 
          background: '#171513', 
          padding: '15px 20px', 
          borderRadius: '16px', 
          border: '1px solid #26221f', 
          marginBottom: '35px', 
          display: 'flex', 
          gap: '20px', 
          overflowX: 'auto', 
          alignItems: 'center',
          whiteSpace: 'nowrap'
        }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                style={{ 
                  color: isActive ? '#fff' : '#888', 
                  fontSize: '13px', 
                  textDecoration: 'none',
                  fontWeight: isActive ? '600' : 'normal',
                  background: isActive ? '#ff6b35' : 'transparent',
                  padding: isActive ? '8px 16px' : '0',
                  borderRadius: isActive ? '20px' : '0',
                  transition: 'all 0.2s ease'
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Contenu de la sous-page active */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}