import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DESIGN_FILE = path.join(DATA_DIR, "design.json");

export interface DesignConfig {
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
    borderRadius: string;
    blur: string;
    shadows: string;
    spacing: string;
    maxWidth: string;
    cardWidth: string;
    opacity: string;
    borderStyle: string;
  };
  hero: {
    bgImage: string;
    bgVideo: string;
    overlayColor: string;
    overlayOpacity: string;
    title: string;
    subtitle: string;
    buttonText: string;
    textPosition: "center" | "left" | "right";
  };
  beatCards: {
    style: "modern" | "classic" | "minimal";
    borderRadius: string;
    shadow: string;
    hoverGlow: boolean;
    imageSize: string;
    textSize: string;
    showLicenses: boolean;
    showBpm: boolean;
    showKey: boolean;
  };
  player: {
    position: "bottom" | "floating";
    size: "compact" | "full";
    waveformStyle: "bars" | "wave";
    showVolume: boolean;
  };
  shop: {
    buyButtonText: string;
    cartButtonText: string;
    badgeStyle: string;
  };
  animations: {
    duration: string;
    speed: string;
    hoverScale: string;
    glowEffect: boolean;
  };
  theme: "dark" | "light" | "auto";
}

export const DEFAULT_DESIGN: DesignConfig = {
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
    borderRadius: "1.5rem",
    blur: "backdrop-blur-xl",
    shadows: "shadow-2xl",
    spacing: "1.5rem",
    maxWidth: "80rem",
    cardWidth: "100%",
    opacity: "0.95",
    borderStyle: "1px solid rgba(255, 255, 255, 0.1)"
  },
  hero: {
    bgImage: "",
    bgVideo: "",
    overlayColor: "#000000",
    overlayOpacity: "0.6",
    title: "Chaque beat raconte une histoire.",
    subtitle: "Productions cinématographiques, dark trap et mélodies sur-mesure pour artistes exigeants.",
    buttonText: "Explorer le Catalogue",
    textPosition: "center"
  },
  beatCards: {
    style: "modern",
    borderRadius: "1rem",
    shadow: "lg",
    hoverGlow: true,
    imageSize: "4rem",
    textSize: "sm",
    showLicenses: true,
    showBpm: true,
    showKey: true
  },
  player: {
    position: "bottom",
    size: "full",
    waveformStyle: "bars",
    showVolume: true
  },
  shop: {
    buyButtonText: "Licence",
    cartButtonText: "Ajouter au Panier",
    badgeStyle: "pill"
  },
  animations: {
    duration: "0.3s",
    speed: "normal",
    hoverScale: "scale-105",
    glowEffect: true
  },
  theme: "dark"
};

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DESIGN_FILE)) {
    fs.writeFileSync(DESIGN_FILE, JSON.stringify(DEFAULT_DESIGN, null, 2), "utf-8");
  }
}

export function getDesign(): DesignConfig {
  ensureFile();
  try {
    const raw = fs.readFileSync(DESIGN_FILE, "utf-8");
    return { ...DEFAULT_DESIGN, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_DESIGN;
  }
}

export function saveDesign(config: DesignConfig): void {
  ensureFile();
  fs.writeFileSync(DESIGN_FILE, JSON.stringify(config, null, 2), "utf-8");
}

export function updateDesign(partial: Partial<DesignConfig>): DesignConfig {
  const current = getDesign();
  const updated = { ...current, ...partial };
  saveDesign(updated);
  return updated;
}

export function resetDesign(): DesignConfig {
  saveDesign(DEFAULT_DESIGN);
  return DEFAULT_DESIGN;
}