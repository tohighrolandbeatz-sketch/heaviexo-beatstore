'use client';

import { useState, useEffect } from 'react';
import { FileAudio, Save, DollarSign } from 'lucide-react';

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

  const updatePrice = (id: string, price: number) => {
    setLicenses(prev => prev.map(l => l.id === id ? { ...l, price } : l));
  };

  const updateName = (id: string, name: string) => {
    setLicenses(prev => prev.map(l => l.id === id ? { ...l, name } : l));
  };

  const handleSave = async () => {
    // Pour l'instant, on sauvegarde en localStorage admin (pas d'API PATCH sur licenses)
    // TODO: Créer une API PATCH pour les licences
    localStorage.setItem('admin_licenses', JSON.stringify(licenses));
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
          <p className="text-xs text-gray-400 mt-1">Gérez les types de licences et leurs prix.</p>
        </div>
        <button onClick={handleSave} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-[#ff6b35] text-white hover:bg-[#e05a2b]'}`}>
          {saved ? '✓ Sauvegardé' : 'Sauvegarder'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {licenses.map((lic) => (
          <div key={lic.id} className="bg-[#171513] border border-[#26221f] rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Nom de la licence</label>
              <input type="text" value={lic.name || ''} onChange={(e) => updateName(lic.id, e.target.value)}
                className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#ff6b35]" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Prix ($)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
                <input type="number" value={lic.price || 0} onChange={(e) => updatePrice(lic.id, Number(e.target.value))}
                  className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#ff6b35]" />
              </div>
            </div>
            <div className="text-[10px] text-gray-500 space-y-1">
              {lic.features && JSON.parse(lic.features || '[]').map((f: string, i: number) => (
                <div key={i} className="flex items-center gap-2"><span className="text-[#ff6b35]">✓</span> {f}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
