'use client';

import { useState, useEffect } from 'react';
import { FileAudio, Save, DollarSign, Check } from 'lucide-react';

export default function AdminLicensesPage() {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/licenses')
      .then(r => r.json())
      .then(d => { setLicenses(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateField = (id: string, field: string, value: any) => {
    setLicenses(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleSave = async () => {
    for (const lic of licenses) {
      await fetch('/api/licenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: lic.id,
          name: lic.name,
          price: lic.price,
          description: lic.description || '',
          features: Array.isArray(lic.features) ? JSON.stringify(lic.features) : (lic.features || '[]'),
        }),
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Chargement...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileAudio className="w-5 h-5 text-[#ff6b35]" /> Licences & Prix
          </h2>
          <p className="text-xs text-gray-400 mt-1">Modifiez tout et sauvegardez. Les changements s'appliquent immédiatement sur le site.</p>
        </div>
        <button onClick={handleSave} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-[#ff6b35] text-white hover:bg-[#e05a2b]'}`}>
          {saved ? <><Check className="w-4 h-4 inline mr-1" /> Sauvegardé</> : 'Sauvegarder tout'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {licenses.map((lic) => (
          <div key={lic.id} className="bg-[#171513] border border-[#26221f] rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Nom de la licence</label>
              <input type="text" value={lic.name || ''} onChange={(e) => updateField(lic.id, 'name', e.target.value)}
                className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#ff6b35]" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Prix ($)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
                <input type="number" step="0.01" value={lic.price || 0} onChange={(e) => updateField(lic.id, 'price', parseFloat(e.target.value))}
                  className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#ff6b35]" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <textarea value={lic.description || ''} onChange={(e) => updateField(lic.id, 'description', e.target.value)}
                className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#ff6b35] h-20" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Caractéristiques (une par ligne)</label>
              <textarea
                value={Array.isArray(lic.features) ? lic.features.join('\n') : (typeof lic.features === 'string' ? (() => { try { return JSON.parse(lic.features).join('\n'); } catch { return lic.features; } })() : '')}
                onChange={(e) => updateField(lic.id, 'features', e.target.value.split('\n').filter((f: string) => f.trim()))}
                className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#ff6b35] h-28"
                placeholder="Une caractéristique par ligne"
              />
            </div>
          </div>
        ))}
        {licenses.length === 0 && (
          <div className="col-span-2 text-center py-10 text-gray-500">Aucune licence trouvée. Ajoutez-les via le SQL Editor.</div>
        )}
      </div>
    </div>
  );
}
