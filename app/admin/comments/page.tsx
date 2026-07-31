'use client';

import { useState, useEffect } from 'react';
import { Trash2, MessageCircle, RefreshCw } from 'lucide-react';

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/comments');
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Erreur chargement commentaires', e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchComments(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    setDeleting(id);
    await fetch(`/api/comments/${id}`, { method: 'DELETE' });
    fetchComments();
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#ff6b35]" /> Commentaires
          </h2>
          <p className="text-xs text-gray-400 mt-1">Gérez tous les commentaires du site.</p>
        </div>
        <button onClick={fetchComments} className="flex items-center gap-2 bg-[#201d1a] text-gray-300 px-4 py-2 rounded-xl text-xs hover:bg-[#332e2a] transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualiser
        </button>
      </div>

      <div className="bg-[#171513] border border-[#26221f] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Chargement...</div>
        ) : comments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Aucun commentaire trouvé.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#26221f] text-gray-400 text-xs uppercase">
                <th className="p-4">Auteur</th>
                <th className="p-4">Commentaire</th>
                <th className="p-4">Beat</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26221f] text-sm">
              {comments.map((c) => (
                <tr key={c.id} className="hover:bg-[#201d1a] transition-colors">
                  <td className="p-4 text-white font-medium">{c.user_id || 'Anonyme'}</td>
                  <td className="p-4 text-gray-300 max-w-xs truncate">{c.content}</td>
                  <td className="p-4 text-xs text-gray-400">{c.beat_id?.slice(-8) || 'N/A'}</td>
                  <td className="p-4 text-xs text-gray-400">{c.created_at ? new Date(c.created_at).toLocaleDateString('fr') : '-'}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                      className="p-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
