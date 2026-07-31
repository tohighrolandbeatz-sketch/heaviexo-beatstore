'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, CheckCircle, Key, Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 'success'>(1);
  const [identifier1, setIdentifier1] = useState('');
  const [identifier2, setIdentifier2] = useState('');
  const [displayCode, setDisplayCode] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step: 1, identifier: identifier1 }),
    });
    const data = await res.json();
    if (res.ok && data.code) { setDisplayCode(data.code); setStep(2); }
    else { setError(data.error || 'Identifiant incorrect'); }
    setLoading(false);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step: 2, identifier: identifier2, code: otp }),
    });
    const data = await res.json();
    if (res.ok) {
      setStep('success');
      setTimeout(() => { router.push('/admin'); router.refresh(); }, 1500);
    } else { setError(data.error || 'Échec'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#C66B3D]/20 flex items-center justify-center">
              {step === 'success' ? <CheckCircle className="w-8 h-8 text-emerald-400" /> : <Shield className="w-8 h-8 text-[#C66B3D]" />}
            </div>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">Espace Admin</h1>
          <p className="text-xs text-[#888]">
            {step === 1 && 'Étape 1 : Identifiant secret'}
            {step === 2 && 'Étape 2 : Code + Second identifiant'}
            {step === 'success' && 'Accès autorisé !'}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
              <input type={show1 ? 'text' : 'password'} placeholder="Identifiant secret" value={identifier1}
                onChange={(e) => setIdentifier1(e.target.value)}
                className="w-full bg-[#1A1311] border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white text-sm placeholder-[#888] focus:outline-none focus:border-[#C66B3D]" autoFocus required />
              <button type="button" onClick={() => setShow1(!show1)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-white">
                {show1 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-red-400 text-center">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-[#C66B3D] text-white font-bold py-3 rounded-xl text-sm uppercase tracking-wider hover:bg-[#FF8C5A] disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? 'Vérification...' : 'Continuer'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-4">
            {displayCode && (
              <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-xl p-3 text-center">
                <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">Code de vérification</p>
                <p className="text-2xl font-black text-emerald-400 tracking-[0.3em]">{displayCode}</p>
              </div>
            )}
            <input type="text" placeholder="Code à 6 chiffres" value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full bg-[#1A1311] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#888] focus:outline-none focus:border-[#C66B3D] text-center tracking-[0.5em] text-2xl" autoFocus required maxLength={6} />
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
              <input type={show2 ? 'text' : 'password'} placeholder="Second identifiant" value={identifier2}
                onChange={(e) => setIdentifier2(e.target.value)}
                className="w-full bg-[#1A1311] border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white text-sm placeholder-[#888] focus:outline-none focus:border-[#C66B3D]" required />
              <button type="button" onClick={() => setShow2(!show2)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-white">
                {show2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-red-400 text-center">{error}</p>}
            <button type="submit" disabled={loading || otp.length !== 6}
              className="w-full bg-[#C66B3D] text-white font-bold py-3 rounded-xl text-sm uppercase tracking-wider hover:bg-[#FF8C5A] disabled:opacity-50">
              {loading ? 'Vérification...' : 'Déverrouiller'}
            </button>
            <button type="button" onClick={() => { setStep(1); setError(''); setOtp(''); setDisplayCode(''); }}
              className="w-full text-xs text-[#888] hover:text-white transition-colors">← Recommencer</button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center space-y-2">
            <p className="text-emerald-400 text-sm font-bold">Redirection vers l'admin...</p>
          </div>
        )}
      </div>
    </div>
  );
}
