'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Percent, DollarSign } from 'lucide-react';

export default function AdminPromoPage() {
  const [promos, setPromos] = useState<any[]>([]);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newType, setNewType] = useState<'percent' | 'fixed'>('percent');
  const [message, setMessage] = useState('');

  const fetchPromos = async () => {
    // L'API promo actuelle ne supporte pas GET, on utilise la liste en dur de l'API
    setPromos([
      { code: 'WELCOME10', discount: 10, type: 'percent' },
      { code: 'HEAVIEXO20', discount: 20, type: 'percent' },
      { code: 'BEAT5', discount: 5, type: 'fixed' },
      { code: 'ARTIST', discount: 15, type: 'percent' },
    ]);
  };

  useEffect(() => { fetchPromos(); }, []);

  const handleAdd = () => {
    if (!newCode || !newDiscount) return;
    setPromos([...promos, { code: newCode.toUpperCase(), discount: Number(newDiscount), type: newType }]);
    setNewCode('');
    setNewDiscount('');
    setMessage('Code ajouté (redéploiement nécessaire pour production)');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRemove = (code: string) => {
    setPromos(promos.filter(p => p.code !== code));
    setMessage('Code supprimé (redéploiement nécessaire pour production)');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#ff6b35]" /> Codes Promo
        </h2>
        <p className="text-xs text-gray-400 mt-1">Gérez les codes de réduction. Redéployez pour appliquer les changements.</p>
      </div>

      {message && <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-400">{message}</div>}

      <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Code</label>
            <input type="text" placeholder="ex: SUMMER20" value={newCode} onChange={(e) => setNewCode(e.target.value)}
              className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Valeur</label>
            <input type="number" placeholder="ex: 15" value={newDiscount} onChange={(e) => setNewDiscount(e.target.value)}
              className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Type</label>
            <div className="flex gap-2">
              <button onClick={() => setNewType('percent')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${newType === 'percent' ? 'bg-[#ff6b35] text-white' : 'bg-[#201d1a] text-gray-400'}`}>
                <Percent className="w-3 h-3 inline mr-1" />%
              </button>
              <button onClick={() => setNewType('fixed')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${newType === 'fixed' ? 'bg-[#ff6b35] text-white' : 'bg-[#201d1a] text-gray-400'}`}>
                <DollarSign className="w-3 h-3 inline mr-1" />$
              </button>
            </div>
          </div>
          <button onClick={handleAdd} className="bg-[#ff6b35] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#e05a2b] flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>
      </div>

      <div className="bg-[#171513] border border-[#26221f] rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#26221f] text-gray-400 text-xs uppercase">
              <th className="p-4">Code</th>
              <th className="p-4">Remise</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#26221f] text-sm">
            {promos.map((p) => (
              <tr key={p.code} className="hover:bg-[#201d1a]">
                <td className="p-4 text-white font-bold">{p.code}</td>
                <td className="p-4 text-[#ff6b35] font-bold">{p.type === 'percent' ? `-${p.discount}%` : `-$${p.discount}`}</td>
                <td className="p-4 text-gray-400 text-xs">{p.type === 'percent' ? 'Pourcentage' : 'Montant fixe'}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleRemove(p.code)} className="p-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
