'use client';

import { useState, useEffect } from 'react';
import { Users, Trash2, Mail, Calendar, Shield } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-5 h-5 text-[#ff6b35]" /> Utilisateurs
          </h2>
          <p className="text-xs text-gray-400 mt-1">Gérez les comptes utilisateurs du site.</p>
        </div>
      </div>

      <div className="bg-[#171513] border border-[#26221f] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Chargement...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Aucun utilisateur trouvé.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#26221f] text-gray-400 text-xs uppercase">
                <th className="p-4">Nom</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rôle</th>
                <th className="p-4">Inscription</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26221f] text-sm">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#201d1a] transition-colors">
                  <td className="p-4 text-white font-medium flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#ff6b35]/20 flex items-center justify-center text-xs font-bold text-[#ff6b35]">
                      {(u.name || 'U')[0].toUpperCase()}
                    </div>
                    {u.name || 'Sans nom'}
                  </td>
                  <td className="p-4 text-gray-300 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gray-500" /> {u.email}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-[#ff6b35]/20 text-[#ff6b35]' : 'bg-blue-500/20 text-blue-400'}`}>
                      <Shield className="w-3 h-3" /> {u.role || 'CUSTOMER'}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr') : '-'}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(u.id)} className="p-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors">
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
