'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError('Mot de passe incorrect');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#C66B3D]/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-[#C66B3D]" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">Espace Admin</h1>
          <p className="text-xs text-[#888]">Accès réservé à HeavieXo</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1A1311] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#888] focus:outline-none focus:border-[#C66B3D] transition-colors text-center"
              autoFocus
              required
            />
          </div>
          {error && <p className="text-xs text-red-400 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C66B3D] text-white font-bold py-3 rounded-xl text-sm uppercase tracking-wider hover:bg-[#FF8C5A] transition-colors disabled:opacity-50"
          >
            {loading ? 'Vérification...' : 'Accéder'}
          </button>
        </form>
      </div>
    </div>
  );
}
