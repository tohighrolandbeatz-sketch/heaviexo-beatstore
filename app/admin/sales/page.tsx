'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Link, Save, Check } from 'lucide-react';

type LicenseKey = 'mp3' | 'wav' | 'stems' | 'exclusive';

export default function AdminSalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paypalLinks, setPaypalLinks] = useState<Record<LicenseKey, { url: string; price: string; label: string }>>({
    mp3: { url: 'https://www.paypal.com/ncp/payment/ZSS69K9VHU59C', price: '29.99', label: 'MP3 Lease' },
    wav: { url: 'https://www.paypal.com/ncp/payment/8ATGLJLD9WVBC', price: '49.99', label: 'WAV Premium' },
    stems: { url: 'https://www.paypal.com/ncp/payment/WG64S2QL5RUNL', price: '149.00', label: 'Trackout / Stems' },
    exclusive: { url: 'https://www.paypal.com/ncp/payment/XU9GSXMKN2HKL', price: 'Sur devis', label: 'Exclusive Rights' },
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/sales')
      .then(r => r.json())
      .then(d => { setSales(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
    const savedLinks = localStorage.getItem('paypal_links');
    if (savedLinks) {
      try { setPaypalLinks(JSON.parse(savedLinks)); } catch {}
    }
  }, []);

  const updateField = (key: LicenseKey, field: string, value: string) => {
    setPaypalLinks(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const handleSaveLinks = () => {
    localStorage.setItem('paypal_links', JSON.stringify(paypalLinks));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const linkKeys: LicenseKey[] = ['mp3', 'wav', 'stems', 'exclusive'];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Link className="w-5 h-5 text-[#ff6b35]" /> Liens de Paiement PayPal
          </h2>
          <button onClick={handleSaveLinks} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-[#ff6b35] text-white hover:bg-[#e05a2b]'}`}>
            {saved ? <><Check className="w-4 h-4 inline mr-1" /> Sauvegardé</> : 'Sauvegarder'}
          </button>
        </div>
        <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6 space-y-4">
          <p className="text-xs text-gray-400">Liens PayPal et tarifs pour chaque licence. Modifiez les prix et URLs, puis sauvegardez.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {linkKeys.map((key) => {
              const val = paypalLinks[key];
              return (
                <div key={key} className="bg-[#201d1a] rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <input type="text" value={val.label} onChange={(e) => updateField(key, 'label', e.target.value)} placeholder="Nom" className="flex-1 bg-black/50 border border-[#332e2a] rounded-lg px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-[#ff6b35]" />
                    <input type="text" value={val.price} onChange={(e) => updateField(key, 'price', e.target.value)} placeholder="Prix" className="w-24 bg-black/50 border border-[#332e2a] rounded-lg px-3 py-2 text-[#ff6b35] text-xs font-bold focus:outline-none focus:border-[#ff6b35]" />
                  </div>
                  <input type="text" value={val.url} onChange={(e) => updateField(key, 'url', e.target.value)} placeholder="Lien PayPal" className="w-full bg-black/50 border border-[#332e2a] rounded-lg px-3 py-2 text-white text-[10px] focus:outline-none focus:border-[#ff6b35]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
          <ShoppingCart className="w-5 h-5 text-[#ff6b35]" /> Ventes & Commandes
        </h2>
        <div className="bg-[#171513] border border-[#26221f] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Chargement...</div>
          ) : sales.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Aucune vente enregistrée.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#26221f] text-gray-400 text-xs uppercase">
                  <th className="p-4">Beat</th><th className="p-4">Licence</th><th className="p-4">Prix</th><th className="p-4">Statut</th><th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26221f] text-sm">
                {sales.map((s) => (
                  <tr key={s.id} className="hover:bg-[#201d1a]">
                    <td className="p-4 text-white">{s.beatId?.slice(-8) || 'N/A'}</td>
                    <td className="p-4 text-gray-400">{s.licenseId || 'N/A'}</td>
                    <td className="p-4 text-[#ff6b35] font-bold">${s.amount || 0}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${s.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{s.status || 'PENDING'}</span></td>
                    <td className="p-4 text-gray-500 text-xs">{s.createdAt ? new Date(s.createdAt).toLocaleDateString('fr') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
