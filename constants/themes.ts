export const THEME_PRESETS: Record<string, { primary: string; secondary: string; bg: string; text: string; muted: string; accent: string }> = {
  MODERN: { primary: '#C66B3D', secondary: '#1A1311', bg: '#0F0D0C', text: '#F4F0EB', muted: '#888888', accent: '#FF8C5A' },
  LUXURY: { primary: '#D4AF37', secondary: '#1A1A1A', bg: '#0A0A0A', text: '#F5F5F5', muted: '#999999', accent: '#FFD700' },
  NOIR:   { primary: '#FFFFFF', secondary: '#111111', bg: '#000000', text: '#CCCCCC', muted: '#666666', accent: '#333333' },
  CYBER:  { primary: '#00FF41', secondary: '#0D1117', bg: '#010409', text: '#C9D1D9', muted: '#8B949E', accent: '#00FF41' },
};

export type ThemePresetId = keyof typeof THEME_PRESETS;
export const DEFAULT_THEME = THEME_PRESETS.MODERN;
export type ThemeColors = typeof DEFAULT_THEME;

export function resolveTheme(themeField: any): ThemeColors {
  if (!themeField) return DEFAULT_THEME;
  if (themeField.custom && typeof themeField.custom === 'object') {
    return { ...DEFAULT_THEME, ...themeField.custom };
  }
  const presetId = themeField.preset as ThemePresetId | undefined;
  if (presetId && THEME_PRESETS[presetId]) {
    return THEME_PRESETS[presetId] as ThemeColors;
  }
  return DEFAULT_THEME;
}
