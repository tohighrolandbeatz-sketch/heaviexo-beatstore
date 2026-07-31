'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'heaviexo2026') {
      document.cookie = 'admin_auth=heaviexo2026; path=/; max-age=604800';
      router.push('/admin');
      router.refresh();
    } else {
      setError('Mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-black text-white text-center uppercase">Espace Admin</h1>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#1A1311] border border-white/10 rounded-xl px-4 py-3 text-white text-center focus:outline-none focus:border-[#C66B3D] pr-12"
            autoFocus
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {error && <p className="text-xs text-red-400 text-center">{error}</p>}
        <button type="submit" className="w-full bg-[#C66B3D] text-white font-bold py-3 rounded-xl uppercase tracking-wider hover:bg-[#FF8C5A] transition-colors">
          Accéder
        </button>
      </form>
    </div>
  );
}
