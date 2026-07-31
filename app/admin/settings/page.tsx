'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, Palette, Globe, Image, Type, Star, Upload, Eye, EyeOff } from 'lucide-react';
import { upload } from '@vercel/blob/client';

const PRESETS = [
  { id: 'MODERN', name: 'Modern', primary: '#C66B3D', secondary: '#1A1311', bg: '#0F0D0C', text: '#F4F0EB', muted: '#888', accent: '#FF8C5A' },
  { id: 'LUXURY', name: 'Luxury', primary: '#D4AF37', secondary: '#1A1A1A', bg: '#0A0A0A', text: '#F5F5F5', muted: '#999', accent: '#FFD700' },
  { id: 'NOIR', name: 'Noir', primary: '#FFFFFF', secondary: '#111111', bg: '#000000', text: '#CCCCCC', muted: '#666', accent: '#333333' },
  { id: 'CYBER', name: 'Cyber', primary: '#00FF41', secondary: '#0D1117', bg: '#010409', text: '#C9D1D9', muted: '#8B949E', accent: '#00FF41' },
  { id: 'CUSTOM', name: 'Custom', primary: '#C66B3D', secondary: '#1A1311', bg: '#0F0D0C', text: '#F4F0EB', muted: '#888', accent: '#FF8C5A' },
];

export default function AdminSettingsPage() {
  const [branding, setBranding] = useState<any>({});
  const [theme, setTheme] = useState<any>(PRESETS[0]);
  const [activePreset, setActivePreset] = useState('MODERN');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/design')
      .then(r => r.json())
      .then(d => {
        const b = d?.branding || d?.data?.branding || {};
        setBranding(b);
        if (b.theme?.preset) {
          const preset = PRESETS.find(p => p.id === b.theme.preset) || PRESETS[0];
          setActivePreset(b.theme.preset);
          setTheme(b.theme.custom || preset);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePresetChange = (presetId: string) => {
    setActivePreset(presetId);
    if (presetId !== 'CUSTOM') {
      const preset = PRESETS.find(p => p.id === presetId);
      if (preset) setTheme(preset);
    }
  };

  const handleSave = async () => {
    await fetch('/api/design', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branding,
        theme: { preset: activePreset, custom: activePreset === 'CUSTOM' ? theme : null },
      }),
    });
    setSaved(true);
  const res = await fetch('/api/design');
  const d = await res.json();
  const b = d?.branding || {};
  setBranding(b);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateBranding = (key: string, value: any) => {
    setBranding((prev: any) => ({ ...prev, [key]: value }));
  };

  const updateSocial = (platform: string, value: string) => {
    setBranding((prev: any) => ({
      ...prev,
      social: { ...(prev.social || {}), [platform]: value },
    }));
  };

  const updateTheme = (key: string, value: string) => {
    setTheme((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const blob = await upload(`branding/logo-${Date.now()}.${file.name.split('.').pop()}`, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      updateBranding('logo', blob.url);
    } catch (err) {
      alert('Erreur upload logo');
    }
    setUploadingLogo(false);
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFavicon(true);
    try {
      const blob = await upload(`branding/favicon-${Date.now()}.${file.name.split('.').pop()}`, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      updateBranding('favicon', blob.url);
    } catch (err) {
      alert('Erreur upload favicon');
    }
    setUploadingFavicon(false);
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Paramètres du Site</h2>
          <p className="text-xs text-gray-400 mt-1">Personnalisez l'apparence et le contenu de votre Beatstore.</p>
        </div>
        <button onClick={handleSave}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-[#ff6b35] text-white hover:bg-[#e05a2b]'}`}>
          {saved ? <><Check className="w-4 h-4 inline mr-1" /> Sauvegardé</> : 'Sauvegarder tout'}
        </button>
      </div>

      {/* SECTION 1 : BRANDING */}
      <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2"><Image className="w-4 h-4 text-[#ff6b35]" /> Branding</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Nom du site</label>
            <input type="text" value={branding?.siteName || ''} onChange={(e) => updateBranding('siteName', e.target.value)}
              className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Description SEO</label>
            <input type="text" value={branding?.description || ''} onChange={(e) => updateBranding('description', e.target.value)}
              className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Logo</label>
            <div className="flex items-center gap-3">
              <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              <button onClick={() => logoInputRef.current?.click()} disabled={uploadingLogo}
                className="px-4 py-2 bg-[#201d1a] border border-[#332e2a] rounded-xl text-xs text-white hover:border-[#ff6b35] disabled:opacity-50 flex items-center gap-2">
                <Upload className="w-3 h-3" /> {uploadingLogo ? 'Upload...' : 'Uploader'}
              </button>
              {branding?.logo && <img src={branding.logo} alt="Logo" className="h-8 w-auto object-contain" />}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Favicon</label>
            <div className="flex items-center gap-3">
              <input ref={faviconInputRef} type="file" accept="image/*" onChange={handleFaviconUpload} className="hidden" />
              <button onClick={() => faviconInputRef.current?.click()} disabled={uploadingFavicon}
                className="px-4 py-2 bg-[#201d1a] border border-[#332e2a] rounded-xl text-xs text-white hover:border-[#ff6b35] disabled:opacity-50 flex items-center gap-2">
                <Upload className="w-3 h-3" /> {uploadingFavicon ? 'Upload...' : 'Uploader'}
              </button>
              {branding?.favicon && <img src={branding.favicon} alt="Favicon" className="h-6 w-6 object-contain" />}
            </div>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={branding?.showFooterLogo !== false} onChange={(e) => updateBranding('showFooterLogo', e.target.checked)}
              className="w-4 h-4 rounded accent-[#ff6b35]" />
            <span className="text-xs text-gray-300">Afficher le logo dans le footer</span>
          </label>
        </div>
      </div>

      {/* SECTION 2 : FOOTER */}
      <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2"><Type className="w-4 h-4 text-[#ff6b35]" /> Footer & Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Description sous le logo</label>
            <textarea value={branding?.footerText || ''} onChange={(e) => updateBranding('footerText', e.target.value)}
              className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35] h-20" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Copyright (tout en bas)</label>
            <input type="text" value={branding?.copyright || ''} onChange={(e) => updateBranding('copyright', e.target.value)}
              className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Numéro WhatsApp (paiement Mobile Money)</label>
            <input type="text" value={branding?.whatsapp || ''} onChange={(e) => updateBranding('whatsapp', e.target.value)}
              className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Email de contact</label>
            <input type="text" value={branding?.email || ''} onChange={(e) => updateBranding('email', e.target.value)}
              className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
          </div>
        </div>

        <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-2">Réseaux sociaux (URLs complètes)</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['instagram', 'youtube', 'tiktok', 'discord', 'telegram', 'twitter'].map(platform => (
            <div key={platform}>
              <label className="block text-[10px] text-gray-400 mb-1 capitalize">{platform}</label>
              <input type="text" value={branding?.social?.[platform] || ''} onChange={(e) => updateSocial(platform, e.target.value)}
                placeholder={`https://${platform}.com/heaviexo`}
                className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-3 py-2 text-white text-[10px] focus:outline-none focus:border-[#ff6b35] placeholder:text-gray-600" />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3 : THÈMES */}
      <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2"><Palette className="w-4 h-4 text-[#ff6b35]" /> Thème</h3>
        
        <div className="flex flex-wrap gap-2">
          {PRESETS.filter(p => p.id !== 'CUSTOM').map(preset => (
            <button key={preset.id} onClick={() => handlePresetChange(preset.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activePreset === preset.id ? 'bg-[#ff6b35] text-white' : 'bg-[#201d1a] text-gray-400 hover:text-white'}`}
              style={activePreset === preset.id ? {} : { borderLeft: `3px solid ${preset.primary}` }}>
              {preset.name}
            </button>
          ))}
          <button onClick={() => handlePresetChange('CUSTOM')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activePreset === 'CUSTOM' ? 'bg-[#ff6b35] text-white' : 'bg-[#201d1a] text-gray-400 hover:text-white'}`}>
            Custom
          </button>
        </div>

        {activePreset === 'CUSTOM' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {[
              { key: 'primary', label: 'Principale (boutons, liens)' },
              { key: 'secondary', label: 'Secondaire (cartes, header)' },
              { key: 'bg', label: 'Fond de page' },
              { key: 'text', label: 'Texte principal' },
              { key: 'muted', label: 'Texte secondaire' },
              { key: 'accent', label: 'Accent (hover, focus)' },
            ].map(c => (
              <div key={c.key}>
                <label className="block text-[10px] text-gray-400 mb-1">{c.label}</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={theme?.[c.key] || '#000'} onChange={(e) => updateTheme(c.key, e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0" />
                  <input type="text" value={theme?.[c.key] || ''} onChange={(e) => updateTheme(c.key, e.target.value)}
                    className="flex-1 bg-[#201d1a] border border-[#332e2a] rounded-xl px-3 py-1.5 text-white text-[10px] focus:outline-none focus:border-[#ff6b35]" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 p-4 rounded-xl border border-[#332e2a]" style={{ background: theme?.bg || '#0F0D0C' }}>
          <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: theme?.muted }}>Aperçu</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg" style={{ background: theme?.primary }} />
            <span className="font-bold" style={{ color: theme?.text }}>Titre exemple</span>
          </div>
          <p className="text-xs mt-1" style={{ color: theme?.muted }}>Ceci est un aperçu du thème sélectionné.</p>
          <button className="mt-2 px-3 py-1 rounded-lg text-[10px] font-bold" style={{ background: theme?.primary, color: '#fff' }}>Bouton</button>
        </div>
      </div>

      {/* SECTION 4 : HERO */}
      <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2"><Star className="w-4 h-4 text-[#ff6b35]" /> Page d'accueil (Hero Banner)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Badge</label>
            <input type="text" value={branding?.heroBadge || ''} onChange={(e) => updateBranding('heroBadge', e.target.value)}
              className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Titre</label>
            <input type="text" value={branding?.heroTitle || ''} onChange={(e) => updateBranding('heroTitle', e.target.value)}
              className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Sous-titre</label>
            <input type="text" value={branding?.heroSubtitle || ''} onChange={(e) => updateBranding('heroSubtitle', e.target.value)}
              className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
          </div>
        </div>
      </div>
    </div>
  );
}
