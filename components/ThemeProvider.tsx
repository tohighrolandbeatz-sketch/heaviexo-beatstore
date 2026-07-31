'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const DEFAULT_THEME = {
  primary: '#C66B3D',
  secondary: '#1A1311',
  bg: '#0F0D0C',
  text: '#F4F0EB',
  muted: '#888888',
  accent: '#FF8C5A',
};

const DEFAULT_BRANDING = {
  siteName: 'HEAVIEXO BEATS',
  logo: '/LOGO-BEAT.png',
  showFooterLogo: true,
  social: {},
};

interface BrandingContextValue {
  branding: any;
  theme: typeof DEFAULT_THEME;
  loading: boolean;
}

const BrandingContext = createContext<BrandingContextValue>({
  branding: DEFAULT_BRANDING,
  theme: DEFAULT_THEME,
  loading: true,
});

export function useBranding() {
  return useContext(BrandingContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<any>(DEFAULT_BRANDING);
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/design', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const b = d?.branding || {};
        const resolvedTheme = b?.theme?.custom || b?.theme || DEFAULT_THEME;

        setBranding({ ...DEFAULT_BRANDING, ...b });
        setTheme({ ...DEFAULT_THEME, ...resolvedTheme });
        setLoading(false);

        const root = document.documentElement;
        Object.entries({ ...DEFAULT_THEME, ...resolvedTheme }).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value as string);
        });

        if (b?.favicon) {
          const link: HTMLLinkElement =
            document.querySelector("link[rel~='icon']") ||
            document.createElement('link');
          link.rel = 'icon';
          link.href = b.favicon;
          document.head.appendChild(link);
        }

        if (b?.siteName) {
          document.title = b.siteName;
        }
      })
      .catch((err) => {
        console.error('ThemeProvider fetch error:', err);
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <BrandingContext.Provider value={{ branding, theme, loading }}>
      {children}
    </BrandingContext.Provider>
  );
}
