'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, Palette, Image, Type, Star, Upload, Wrench, Plus, Trash2, Eye, EyeOff, X } from 'lucide-react';
import { upload } from '@vercel/blob/client';
import { THEME_PRESETS, DEFAULT_THEME, type ThemePresetId } from '@/constants/themes';

const PRESETS = (Object.keys(THEME_PRESETS) as ThemePresetId[]).map((id) => ({ id, name: id.charAt(0) + id.slice(1).toLowerCase(), ...THEME_PRESETS[id] }));
const DEFAULT_CUSTOM = DEFAULT_THEME;

function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width, h = img.height;
      if (w > maxWidth) { h = (h * maxWidth) / w; w = maxWidth; }
      if (h > maxHeight) { w = (w * maxHeight) / h; h = maxHeight; }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        resolve(new File([blob!], file.name, { type: 'image/webp' }));
      }, 'image/webp', 0.95);
    };
    img.src = URL.createObjectURL(file);
  });
}

export default function AdminSettingsPage() {
  const [branding, setBranding] = useState<any>({});
  const [theme, setTheme] = useState<any>(PRESETS[0]);
  const [activePreset, setActivePreset] = useState('MODERN');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingHeroBg, setUploadingHeroBg] = useState(false);
  const [heroBgMsg, setHeroBgMsg] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const heroBgInputRef = useRef<HTMLInputElement>(null);

  const loadDesign = async () => {
    const res = await fetch('/api/design', { cache: 'no-store' });
    const d = await res.json();
    const b = d?.branding || {};
    setBranding(b);
    if (b.theme?.preset) { const preset = PRESETS.find((p) => p.id === b.theme.preset) || PRESETS[0]; setActivePreset(b.theme.preset); setTheme(b.theme.custom || preset); }
    else if (b.theme?.custom) { setActivePreset('CUSTOM'); setTheme(b.theme.custom); }
    return b;
  };

  useEffect(() => { loadDesign().catch(() => {}).finally(() => setLoading(false)); }, []);

  const handlePresetChange = (presetId: string) => { setActivePreset(presetId); if (presetId !== 'CUSTOM') { const preset = PRESETS.find((p) => p.id === presetId); if (preset) setTheme(preset); } };

  const handleSave = async () => {
    setSaving(true); setSaveError(null);
    try {
      await fetch('/api/design', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ branding, theme: { preset: activePreset, custom: activePreset === 'CUSTOM' ? theme : null } }), cache: 'no-store' });
      await loadDesign();
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (e: any) { setSaveError(e.message); }
    finally { setSaving(false); }
  };

  const updateBranding = (key: string, value: any) => { setBranding((prev: any) => ({ ...prev, [key]: value })); };
  const updateSocial = (platform: string, value: string) => { setBranding((prev: any) => ({ ...prev, social: { ...(prev.social || {}), [platform]: value } })); };
  const updateTheme = (key: string, value: string) => { setTheme((prev: any) => ({ ...prev, [key]: value })); };
  const updateServicesConfig = (serviceKey: string, field: string, value: any) => { setBranding((prev: any) => ({ ...prev, servicesConfig: { ...(prev.servicesConfig || {}), [serviceKey]: { ...(prev.servicesConfig?.[serviceKey] || {}), [field]: value } } })); };
  const addFaqItem = () => { setBranding((prev: any) => ({ ...prev, servicesConfig: { ...(prev.servicesConfig || {}), faq: [...(prev.servicesConfig?.faq || []), { q: '', a: '' }] } })); };
  const updateFaqItem = (index: number, field: 'q' | 'a', value: string) => { setBranding((prev: any) => { const faq = [...(prev.servicesConfig?.faq || [])]; faq[index] = { ...faq[index], [field]: value }; return { ...prev, servicesConfig: { ...(prev.servicesConfig || {}), faq } }; }); };
  const removeFaqItem = (index: number) => { setBranding((prev: any) => { const faq = (prev.servicesConfig?.faq || []).filter((_: any, i: number) => i !== index); return { ...prev, servicesConfig: { ...(prev.servicesConfig || {}), faq } }; }); };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; setUploadingLogo(true); try { const blob = await upload(`branding/logo-${Date.now()}.webp`, file, { access: 'public', handleUploadUrl: '/api/upload' }); updateBranding('logo', blob.url); } catch { alert('Erreur'); } setUploadingLogo(false); };
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; setUploadingFavicon(true); try { const blob = await upload(`branding/favicon-${Date.now()}.ico`, file, { access: 'public', handleUploadUrl: '/api/upload' }); updateBranding('favicon', blob.url); } catch { alert('Erreur'); } setUploadingFavicon(false); };

  const handleHeroBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { alert('❌ Image trop lourde (max 1 MB).'); return; }
    setUploadingHeroBg(true);
    setHeroBgMsg('');
    try {
      // Supprime l'ancienne image du Blob storage avant d'uploader la nouvelle
      if (branding?.heroBg) {
        try {
          await fetch('/api/blob/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: branding.heroBg }),
          });
        } catch {
          // Si la suppression échoue, on continue quand même l'upload de la nouvelle image
        }
      }

      // Pas de redimensionnement pour le Hero — qualité originale préservée
      const blob = await upload(`branding/hero-bg-${Date.now()}.${file.name.split('.').pop() || 'webp'}`, file, { access: 'public', handleUploadUrl: '/api/upload' });
      updateBranding('heroBg', blob.url);
      setHeroBgMsg('✅ Uploadé ! Cliquez "Sauvegarder tout" pour appliquer.');
    } catch { setHeroBgMsg('❌ Erreur upload'); }
    setUploadingHeroBg(false);
  };

  const handleRemoveHeroBg = async () => {
    if (branding?.heroBg) {
      try {
        await fetch('/api/blob/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: branding.heroBg }),
        });
      } catch {
        // Si la suppression échoue côté Blob, on vide quand même la référence en base
      }
    }
    updateBranding('heroBg', '');
    setHeroBgMsg('🗑️ Image supprimée. Sauvegardez pour confirmer.');
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Chargement...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white uppercase tracking-wider">Paramètres du Site</h2><p className="text-xs text-gray-400 mt-1">Personnalisez l'apparence de votre Beatstore.</p></div>
        <div className="flex flex-col items-end gap-1">
          <button onClick={handleSave} disabled={saving} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-60 ${saved ? 'bg-emerald-500 text-white' : 'bg-[#ff6b35] text-white hover:bg-[#e05a2b]'}`}>{saving ? 'Sauvegarde...' : saved ? <><Check className="w-4 h-4 inline mr-1" /> Sauvegardé</> : 'Sauvegarder tout'}</button>
          {saveError && <p className="text-[10px] text-red-400">{saveError}</p>}
        </div>
      </div>

      {/* BRANDING */}
      <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2"><Image className="w-4 h-4 text-[#ff6b35]" /> Branding</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-xs text-gray-400 mb-1">Nom du site</label><input type="text" value={branding?.siteName || ''} onChange={(e) => updateBranding('siteName', e.target.value)} className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" /></div>
          <div><label className="block text-xs text-gray-400 mb-1">Description SEO</label><input type="text" value={branding?.description || ''} onChange={(e) => updateBranding('description', e.target.value)} className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-xs text-gray-400 mb-1">Logo</label><div className="flex items-center gap-3"><input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" /><button onClick={() => logoInputRef.current?.click()} disabled={uploadingLogo} className="px-4 py-2 bg-[#201d1a] border border-[#332e2a] rounded-xl text-xs text-white hover:border-[#ff6b35] disabled:opacity-50 flex items-center gap-2"><Upload className="w-3 h-3" /> {uploadingLogo ? 'Upload...' : 'Uploader'}</button>{branding?.logo && <img src={branding.logo} alt="Logo" className="h-8 w-auto object-contain" />}</div></div>
          <div><label className="block text-xs text-gray-400 mb-1">Favicon</label><div className="flex items-center gap-3"><input ref={faviconInputRef} type="file" accept="image/*" onChange={handleFaviconUpload} className="hidden" /><button onClick={() => faviconInputRef.current?.click()} disabled={uploadingFavicon} className="px-4 py-2 bg-[#201d1a] border border-[#332e2a] rounded-xl text-xs text-white hover:border-[#ff6b35] disabled:opacity-50 flex items-center gap-2"><Upload className="w-3 h-3" /> {uploadingFavicon ? 'Upload...' : 'Uploader'}</button>{branding?.favicon && <img src={branding.favicon} alt="Favicon" className="h-6 w-6 object-contain" />}</div></div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Hero Background (max 1 MB)</label>
            <div className="flex items-center gap-3">
              <input ref={heroBgInputRef} type="file" accept="image/*" onChange={handleHeroBgUpload} className="hidden" />
              <button onClick={() => heroBgInputRef.current?.click()} disabled={uploadingHeroBg} className="px-4 py-2 bg-[#201d1a] border border-[#332e2a] rounded-xl text-xs text-white hover:border-[#ff6b35] disabled:opacity-50 flex items-center gap-2"><Upload className="w-3 h-3" /> {uploadingHeroBg ? 'Upload...' : 'Uploader'}</button>
              {branding?.heroBg && (
                <div className="flex items-center gap-2">
                  <img src={branding.heroBg} alt="Hero" className="h-8 w-auto object-contain" />
                  <button onClick={handleRemoveHeroBg} className="text-red-400 hover:text-red-300"><X className="w-4 h-4" /></button>
                </div>
              )}
            </div>
            {heroBgMsg && <p className={`text-[10px] mt-1 ${heroBgMsg.includes('✅') ? 'text-emerald-400' : heroBgMsg.includes('🗑️') ? 'text-yellow-400' : 'text-red-400'}`}>{heroBgMsg}</p>}
            <p className="text-[10px] text-gray-500 mt-1">Qualité originale préservée. Formats acceptés : JPG, PNG, WebP. Max 1 MB.</p>
          </div>
        </div>
        <div><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={branding?.showFooterLogo !== false} onChange={(e) => updateBranding('showFooterLogo', e.target.checked)} className="w-4 h-4 rounded accent-[#ff6b35]" /><span className="text-xs text-gray-300">Afficher le logo dans le footer</span></label></div>
      </div>

      {/* FOOTER */}
      <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2"><Type className="w-4 h-4 text-[#ff6b35]" /> Footer & Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-xs text-gray-400 mb-1">Description sous le logo</label><textarea value={branding?.footerText || ''} onChange={(e) => updateBranding('footerText', e.target.value)} className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35] h-20" /></div>
          <div><label className="block text-xs text-gray-400 mb-1">Copyright</label><input type="text" value={branding?.copyright || ''} onChange={(e) => updateBranding('copyright', e.target.value)} className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" /></div>
          <div><label className="block text-xs text-gray-400 mb-1">WhatsApp</label><input type="text" value={branding?.whatsapp || ''} onChange={(e) => updateBranding('whatsapp', e.target.value)} className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" /></div>
          <div><label className="block text-xs text-gray-400 mb-1">Email</label><input type="text" value={branding?.email || ''} onChange={(e) => updateBranding('email', e.target.value)} className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" /></div>
        </div>

        <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-2">Réseaux sociaux — œil pour afficher/masquer</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['instagram', 'youtube', 'tiktok', 'spotify', 'discord', 'telegram', 'twitter'].map(platform => {
            const val = branding?.social?.[platform] || '';
            const hidden = val === '__HIDDEN__';
            return (
              <div key={platform}>
                <div className="flex items-center gap-2 mb-1">
                  <button type="button" onClick={() => updateSocial(platform, hidden ? '' : '__HIDDEN__')} className="text-[#888] hover:text-white">
                    {hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                  <label className="text-[10px] text-gray-400 capitalize">{platform}</label>
                </div>
                <input type="text" value={hidden ? '' : val} onChange={(e) => updateSocial(platform, e.target.value)} placeholder={`https://${platform}.com/heaviexo`} className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-3 py-2 text-white text-[10px] focus:outline-none focus:border-[#ff6b35] placeholder:text-gray-600" />
              </div>
            );
          })}
        </div>
      </div>

      {/* THÈMES */}
      <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2"><Palette className="w-4 h-4 text-[#ff6b35]" /> Thème</h3>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (<button type="button" key={preset.id} onClick={() => handlePresetChange(preset.id)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activePreset === preset.id ? 'bg-[#ff6b35] text-white' : 'bg-[#201d1a] text-gray-400 hover:text-white'}`} style={activePreset === preset.id ? {} : { borderLeft: `3px solid ${preset.primary}` }}>{preset.name}</button>))}
          <button type="button" onClick={() => { setActivePreset('CUSTOM'); if (activePreset !== 'CUSTOM') setTheme(DEFAULT_CUSTOM); }} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activePreset === 'CUSTOM' ? 'bg-[#ff6b35] text-white' : 'bg-[#201d1a] text-gray-400 hover:text-white'}`}>Custom</button>
        </div>
        {activePreset === 'CUSTOM' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {[{ key: 'primary', label: 'Principale' },{ key: 'secondary', label: 'Secondaire' },{ key: 'bg', label: 'Fond' },{ key: 'text', label: 'Texte' },{ key: 'muted', label: 'Texte secondaire' },{ key: 'accent', label: 'Accent' }].map(c => (
              <div key={c.key}><label className="block text-[10px] text-gray-400 mb-1">{c.label}</label><div className="flex items-center gap-2"><input type="color" value={theme?.[c.key] || '#000'} onChange={(e) => updateTheme(c.key, e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" /><input type="text" value={theme?.[c.key] || ''} onChange={(e) => updateTheme(c.key, e.target.value)} className="flex-1 bg-[#201d1a] border border-[#332e2a] rounded-xl px-3 py-1.5 text-white text-[10px] focus:outline-none focus:border-[#ff6b35]" /></div></div>
            ))}
          </div>
        )}
        <div className="mt-4 p-4 rounded-xl border border-[#332e2a]" style={{ background: theme?.bg || '#0F0D0C' }}>
          <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: theme?.muted }}>Aperçu</p>
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg" style={{ background: theme?.primary }} /><span className="font-bold" style={{ color: theme?.text }}>Titre exemple</span></div>
          <p className="text-xs mt-1" style={{ color: theme?.muted }}>Ceci est un aperçu du thème sélectionné.</p>
          <button type="button" className="mt-2 px-3 py-1 rounded-lg text-[10px] font-bold" style={{ background: theme?.primary, color: '#fff' }}>Bouton</button>
        </div>
      </div>

      {/* HERO */}
      <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2"><Star className="w-4 h-4 text-[#ff6b35]" /> Hero Banner</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-xs text-gray-400 mb-1">Badge</label><input type="text" value={branding?.heroBadge || ''} onChange={(e) => updateBranding('heroBadge', e.target.value)} className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" /></div>
          <div><label className="block text-xs text-gray-400 mb-1">Titre</label><input type="text" value={branding?.heroTitle || ''} onChange={(e) => updateBranding('heroTitle', e.target.value)} className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" /></div>
          <div><label className="block text-xs text-gray-400 mb-1">Sous-titre</label><input type="text" value={branding?.heroSubtitle || ''} onChange={(e) => updateBranding('heroSubtitle', e.target.value)} className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" /></div>
          <div><label className="block text-xs text-gray-400 mb-1">URL Spotify</label><input type="text" value={branding?.spotifyPlaylist || ''} onChange={(e) => updateBranding('spotifyPlaylist', e.target.value)} placeholder="https://open.spotify.com/playlist/..." className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" /></div>
        </div>
      </div>

      {/* SERVICES */}
      <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6 space-y-6">
        <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2"><Wrench className="w-4 h-4 text-[#ff6b35]" /> Services</h3>
        {['ep', 'album', 'custom', 'mixmaster'].map((key) => (
          <div key={key} className="bg-[#201d1a] rounded-xl p-4 space-y-3">
            <span className="text-[10px] font-bold text-[#ff6b35] uppercase">{key === 'mixmaster' ? 'Mix & Master' : key.toUpperCase()}</span>
            <div className="grid grid-cols-3 gap-2">
              <input type="text" value={branding?.servicesConfig?.[key]?.title || ''} onChange={(e) => updateServicesConfig(key, 'title', e.target.value)} placeholder="Titre" className="bg-black/50 border border-[#332e2a] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
              <input type="text" value={branding?.servicesConfig?.[key]?.subtitle || ''} onChange={(e) => updateServicesConfig(key, 'subtitle', e.target.value)} placeholder="Sous-titre" className="bg-black/50 border border-[#332e2a] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
              <input type="text" value={branding?.servicesConfig?.[key]?.price || ''} onChange={(e) => updateServicesConfig(key, 'price', e.target.value)} placeholder="Prix" className="bg-black/50 border border-[#332e2a] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 mb-1 block">Features</label>
              {(branding?.servicesConfig?.[key]?.features || ['']).map((feat: string, i: number) => (
                <div key={i} className="flex gap-2 mb-1">
                  <input type="text" value={feat} onChange={(e) => { const feats = [...(branding?.servicesConfig?.[key]?.features || [''])]; feats[i] = e.target.value; updateServicesConfig(key, 'features', feats); }} placeholder={`Feature ${i + 1}`} className="flex-1 bg-black/50 border border-[#332e2a] rounded-lg px-3 py-1.5 text-white text-[10px] focus:outline-none focus:border-[#ff6b35]" />
                  {i > 0 && (<button type="button" onClick={() => { const feats = (branding?.servicesConfig?.[key]?.features || ['']).filter((_: any, idx: number) => idx !== i); updateServicesConfig(key, 'features', feats.length === 0 ? [''] : feats); }} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-3 h-3" /></button>)}
                </div>
              ))}
              <button type="button" onClick={() => { const feats = [...(branding?.servicesConfig?.[key]?.features || ['']), '']; updateServicesConfig(key, 'features', feats); }} className="text-[10px] text-[#ff6b35] hover:text-[#FF8C5A] flex items-center gap-1 mt-1"><Plus className="w-3 h-3" /> Ajouter</button>
            </div>
          </div>
        ))}
        <div className="bg-[#201d1a] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-[#ff6b35] uppercase">FAQ</span><button type="button" onClick={addFaqItem} className="text-[10px] text-[#ff6b35] hover:text-[#FF8C5A] flex items-center gap-1"><Plus className="w-3 h-3" /> Ajouter</button></div>
          {(branding?.servicesConfig?.faq || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1 space-y-1">
                <input type="text" value={item.q || ''} onChange={(e) => updateFaqItem(i, 'q', e.target.value)} placeholder="Question" className="w-full bg-black/50 border border-[#332e2a] rounded-lg px-3 py-1.5 text-white text-[10px] focus:outline-none focus:border-[#ff6b35]" />
                <textarea value={item.a || ''} onChange={(e) => updateFaqItem(i, 'a', e.target.value)} placeholder="Réponse" rows={2} className="w-full bg-black/50 border border-[#332e2a] rounded-lg px-3 py-1.5 text-white text-[10px] focus:outline-none focus:border-[#ff6b35]" />
              </div>
              <button type="button" onClick={() => removeFaqItem(i)} className="text-red-400 hover:text-red-300 p-1 mt-1"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}