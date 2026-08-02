'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface Sale {
  id: string;
  user_id?: string;
  beat_id: string;
  license_id: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function AdminSalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [beatsMap, setBeatsMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [salesRes, beatsRes] = await Promise.all([
        fetch('/api/sales'),
        fetch('/api/beats'),
      ]);
      const salesData = await salesRes.json();
      const beatsData = await beatsRes.json();
      setSales(Array.isArray(salesData) ? salesData : []);
      const map: Record<string, string> = {};
      (Array.isArray(beatsData) ? beatsData : []).forEach((b: any) => { map[b.id] = b.title; });
      setBeatsMap(map);
    } catch {
      setSales([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function confirmSale(id: string) {
    setActioningId(id);
    try {
      await fetch(`/api/sales/${id}/confirm`, { method: 'PATCH' });
    } finally {
      await load();
      setActioningId(null);
    }
  }

  async function rejectSale(id: string) {
    if (!confirm('Rejeter cette vente ? Le client ne recevra pas de lien de téléchargement.')) return;
    setActioningId(id);
    try {
      await fetch(`/api/sales/${id}/reject`, { method: 'PATCH' });
    } finally {
      await load();
      setActioningId(null);
    }
  }

  const statusBadge = (status: string) => {
    if (status === 'CONFIRMED') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Confirmée
        </span>
      );
    }
    if (status === 'REJECTED') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
          <XCircle className="w-3 h-3" /> Rejetée
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
        <Clock className="w-3 h-3" /> En attente
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Ventes</h2>
        <p className="text-xs text-gray-400 mt-1">
          Confirmez un paiement reçu (WhatsApp/PayPal) pour envoyer automatiquement les liens de téléchargement sécurisés au client.
        </p>
      </div>

      <div className="bg-[#171513] border border-[#26221f] rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#26221f] text-gray-400 text-xs uppercase">
              <th className="p-4">Beat</th>
              <th className="p-4">Licence</th>
              <th className="p-4">Montant</th>
              <th className="p-4">Statut</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#26221f] text-sm">
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">Chargement...</td></tr>
            ) : sales.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">Aucune vente pour le moment.</td></tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-[#201d1a] transition-colors">
                  <td className="p-4 text-white font-semibold">{beatsMap[sale.beat_id] || sale.beat_id}</td>
                  <td className="p-4 text-gray-300 text-xs uppercase">{sale.license_id}</td>
                  <td className="p-4 text-white">{sale.amount} $</td>
                  <td className="p-4">{statusBadge(sale.status)}</td>
                  <td className="p-4 text-gray-400 text-xs">{new Date(sale.created_at).toLocaleString('fr-FR')}</td>
                  <td className="p-4 text-right space-x-2">
                    {sale.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => confirmSale(sale.id)}
                          disabled={actioningId === sale.id}
                          className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-600/40 rounded-lg text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50"
                        >
                          {actioningId === sale.id ? '...' : 'Confirmer'}
                        </button>
                        <button
                          onClick={() => rejectSale(sale.id)}
                          disabled={actioningId === sale.id}
                          className="px-3 py-1.5 bg-red-600/10 text-red-400 border border-red-600/30 rounded-lg text-xs font-semibold hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                        >
                          Rejeter
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}