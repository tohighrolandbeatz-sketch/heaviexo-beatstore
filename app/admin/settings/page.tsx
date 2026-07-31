'use client';

import { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
  const [branding, setBranding] = useState<any>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/design')
      .then(r => r.json())
      .then(d => {
        if (d?.branding) setBranding(d.branding);
        else if (d?.data?.branding) setBranding(d.data.branding);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    await fetch('/api/design', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branding }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (key: string, value: string) => {
    setBranding((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setBranding((prev: any) => ({
      ...prev,
      social: { ...(prev.social || {}), [platform]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Paramètres du Site</h2>
          <p className="text-xs text-gray-400 mt-1">Logo, footer, réseaux sociaux, WhatsApp.</p>
        </div>
        <button onClick={handleSave}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-[#ff6b35] text-white hover:bg-[#e05a2b]'}`}>
          {saved ? '✓ Sauvegardé' : 'Sauvegarder'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo + Footer */}
        <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">📋 Branding</h3>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">URL du Logo</label>
            <input type="text" value={branding?.logo || ''} onChange={(e) => handleChange('logo', e.target.value)}
              className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Texte du Footer</label>
            <input type="text" value={branding?.footerText || ''} onChange={(e) => handleChange('footerText', e.target.value)}
              className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Copyright</label>
            <input type="text" value={branding?.copyright || ''} onChange={(e) => handleChange('copyright', e.target.value)}
              className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Numéro WhatsApp</label>
            <input type="text" value={branding?.whatsapp || ''} onChange={(e) => handleChange('whatsapp', e.target.value)}
              className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">🌐 Réseaux Sociaux</h3>
          
          {['instagram', 'youtube', 'tiktok', 'discord', 'telegram', 'twitter'].map(platform => (
            <div key={platform}>
              <label className="block text-xs text-gray-400 mb-1 capitalize">{platform} URL</label>
              <input type="text" value={branding?.social?.[platform] || ''} onChange={(e) => handleSocialChange(platform, e.target.value)}
                className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
