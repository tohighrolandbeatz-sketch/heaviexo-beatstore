import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PRESETS_DIR = path.join(DATA_DIR, "presets");
const DESIGN_FILE = path.join(DATA_DIR, "design.json");

export interface SpotifyProject {
  title: string;
  url: string;
}

export interface DesignConfig {
  version: number;
  branding: {
    siteName: string;
    subtitle: string;
    logoUrl: string;
    footerLogoUrl: string;
    faviconUrl: string;
    footerText: string;
    copyright: string;
    socials: { instagram: string; youtube: string; telegram: string };
    whatsapp: string;
    email: string;
  };
  header: {
    layout: "default" | "centered" | "minimal";
    showSearch: boolean;
    showCart: boolean;
    sticky: boolean;
    glassEffect: boolean;
    navLinks: { label: string; href: string }[];
  };
  footer: {
    style: "detailed" | "minimal";
    showNewsletter: boolean;
    columnsCount: number;
    socialIcons: boolean;
    customHtml: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    cardBackground: string;
    buttonBackground: string;
    buttonHover: string;
    priceColor: string;
    textColor: string;
    iconColor: string;
    waveformColor: string;
  };
  interface: {
    borderRadius: number;
    blur: number;
    shadows: number;
    spacing: number;
    maxWidth: number;
    opacity: number;
  };
  spotify: {
    mainEmbedUrl: string;
    projects: SpotifyProject[];
  };
  artists: string[];
  theme: "dark" | "light" | "auto";
}

export const DEFAULT_DESIGN: DesignConfig = {
  version: 2,
  branding: {
    siteName: "HEAVIEX'O BEATS",
    subtitle: "Future Sound Architecture",
    logoUrl: "/LOGO-BEAT.png",
    footerLogoUrl: "/LOGO-BEAT.png",
    faviconUrl: "/favicon.ico",
    footerText: "Studio de production musicale haute définition. Beats originaux, Sound Kits professionnels & ingénierie sonore sur-mesure.",
    copyright: "© 2026 HEAVIEXO BEATS. Tous droits réservés.",
    socials: { instagram: "https://instagram.com", youtube: "https://youtube.com", telegram: "https://t.me" },
    whatsapp: "2290156646409",
    email: "contact@heaviexobeats.com"
  },
  header: {
    layout: "default",
    showSearch: true,
    showCart: true,
    sticky: true,
    glassEffect: true,
    navLinks: [
      { label: "Beats", href: "#beats" },
      { label: "Sound Kits", href: "#kits" },
      { label: "Licences", href: "#licenses" },
      { label: "Contact", href: "#contact" }
    ]
  },
  footer: {
    style: "detailed",
    showNewsletter: true,
    columnsCount: 3,
    socialIcons: true,
    customHtml: ""
  },
  colors: {
    primary: "#10b981",
    secondary: "#047857",
    accent: "#34d399",
    background: "#000000",
    cardBackground: "#09090b",
    buttonBackground: "#10b981",
    buttonHover: "#059669",
    priceColor: "#34d399",
    textColor: "#ffffff",
    iconColor: "#10b981",
    waveformColor: "#10b981"
  },
  interface: {
    borderRadius: 24,
    blur: 20,
    shadows: 30,
    spacing: 24,
    maxWidth: 1280,
    opacity: 0.95
  },
  spotify: {
    mainEmbedUrl: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
    projects: []
  },
  artists: [
    "Guen", "Amron", "Wedy", "Kiko", "Ghetto Mike", "Mic Flammez", "Speezy", "Kollins",
    "Prince Mo", "Cyanogène", "CCC", "Blaaz", "Jay Killah", "Stanley Enow", "Maalox",
    "Dove'N D", "Biz Ice", "Sonya Blade"
  ],
  theme: "dark"
};

// --- PRESETS DE THÈMES PRÉDÉFINIS ---
const PRESETS: Record<string, Partial<DesignConfig>> = {
  Modern: { ...DEFAULT_DESIGN },
  Luxury: {
    ...DEFAULT_DESIGN,
    colors: {
      primary: "#d4af37",
      secondary: "#aa8c2c",
      accent: "#f3e5ab",
      background: "#050505",
      cardBackground: "#0f0f0f",
      buttonBackground: "#d4af37",
      buttonHover: "#aa8c2c",
      priceColor: "#f3e5ab",
      textColor: "#ffffff",
      iconColor: "#d4af37",
      waveformColor: "#d4af37"
    }
  },
  Noir: {
    ...DEFAULT_DESIGN,
    colors: {
      primary: "#ffffff",
      secondary: "#a1a1aa",
      accent: "#e4e4e7",
      background: "#000000",
      cardBackground: "#121212",
      buttonBackground: "#ffffff",
      buttonHover: "#e4e4e7",
      priceColor: "#ffffff",
      textColor: "#ffffff",
      iconColor: "#ffffff",
      waveformColor: "#ffffff"
    }
  },
  Spotify: {
    ...DEFAULT_DESIGN,
    colors: {
      primary: "#1db954",
      secondary: "#121212",
      accent: "#1ed760",
      background: "#121212",
      cardBackground: "#181818",
      buttonBackground: "#1db954",
      buttonHover: "#1ed760",
      priceColor: "#1ed760",
      textColor: "#ffffff",
      iconColor: "#1db954",
      waveformColor: "#1db954"
    }
  },
  BeatStars: {
    ...DEFAULT_DESIGN,
    colors: {
      primary: "#3b82f6",
      secondary: "#1d4ed8",
      accent: "#60a5fa",
      background: "#090d16",
      cardBackground: "#111827",
      buttonBackground: "#3b82f6",
      buttonHover: "#2563eb",
      priceColor: "#60a5fa",
      textColor: "#ffffff",
      iconColor: "#3b82f6",
      waveformColor: "#3b82f6"
    }
  }
};

function ensureFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(PRESETS_DIR)) fs.mkdirSync(PRESETS_DIR, { recursive: true });
  if (!fs.existsSync(DESIGN_FILE)) {
    fs.writeFileSync(DESIGN_FILE, JSON.stringify(DEFAULT_DESIGN, null, 2), "utf-8");
  }
}

function deepMerge(target: any, source: any): any {
  const output = { ...target };
  if (target && typeof target === "object" && source && typeof source === "object") {
    Object.keys(source).forEach((key) => {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
}

export function getDesign(): DesignConfig {
  ensureFiles();
  try {
    const raw = fs.readFileSync(DESIGN_FILE, "utf-8");
    return deepMerge(DEFAULT_DESIGN, JSON.parse(raw));
  } catch {
    return DEFAULT_DESIGN;
  }
}

export function saveDesign(config: DesignConfig): void {
  ensureFiles();
  fs.writeFileSync(DESIGN_FILE, JSON.stringify(config, null, 2), "utf-8");
}

export function resetDesign(): DesignConfig {
  saveDesign(DEFAULT_DESIGN);
  return DEFAULT_DESIGN;
}

export function applyPreset(presetName: string): DesignConfig {
  const preset = PRESETS[presetName] || DEFAULT_DESIGN;
  const updated = deepMerge(DEFAULT_DESIGN, preset);
  saveDesign(updated);
  return updated;
}