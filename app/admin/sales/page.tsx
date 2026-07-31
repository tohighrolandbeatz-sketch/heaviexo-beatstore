'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, DollarSign, User, Calendar } from 'lucide-react';

export default function AdminSalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sales')
      .then(r => r.json())
      .then(d => { setSales(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Chargement...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-[#ff6b35]" /> Ventes & Commandes
        </h2>
        <p className="text-xs text-gray-400 mt-1">Historique des ventes et commandes.</p>
      </div>

      <div className="bg-[#171513] border border-[#26221f] rounded-2xl overflow-hidden">
        {sales.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Aucune vente enregistrée.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#26221f] text-gray-400 text-xs uppercase">
                <th className="p-4">Beat</th>
                <th className="p-4">Licence</th>
                <th className="p-4">Prix</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26221f] text-sm">
              {sales.map((s) => (
                <tr key={s.id} className="hover:bg-[#201d1a]">
                  <td className="p-4 text-white">{s.beatId?.slice(-8) || 'N/A'}</td>
                  <td className="p-4 text-gray-400">{s.licenseId || 'N/A'}</td>
                  <td className="p-4 text-[#ff6b35] font-bold">${s.amount || 0}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${s.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {s.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">
                    {s.createdAt ? new Date(s.createdAt).toLocaleDateString('fr') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
