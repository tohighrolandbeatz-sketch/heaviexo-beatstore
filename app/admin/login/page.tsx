'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, CheckCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStep('otp');
    } else {
      const data = await res.json();
      setError(data.error || 'Erreur lors de l\'envoi');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    if (res.ok) {
      setStep('success');
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1500);
    } else {
      const data = await res.json();
      setError(data.error || 'Code incorrect');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#C66B3D]/20 flex items-center justify-center">
              {step === 'success' ? <CheckCircle className="w-8 h-8 text-emerald-400" /> : <Lock className="w-8 h-8 text-[#C66B3D]" />}
            </div>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">Espace Admin</h1>
          <p className="text-xs text-[#888]">
            {step === 'email' && 'Entrez votre email pour recevoir un code'}
            {step === 'otp' && 'Entrez le code reçu par email'}
            {step === 'success' && 'Connexion réussie !'}
          </p>
        </div>

        {step === 'email' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1A1311] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-[#888] focus:outline-none focus:border-[#C66B3D] transition-colors"
                autoFocus
                required
              />
            </div>
            {error && <p className="text-xs text-red-400 text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C66B3D] text-white font-bold py-3 rounded-xl text-sm uppercase tracking-wider hover:bg-[#FF8C5A] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Envoi...' : 'Recevoir le code'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <p className="text-xs text-[#888] text-center">Code envoyé à <span className="text-white">{email}</span></p>
            <div>
              <input
                type="text"
                placeholder="Code à 6 chiffres"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full bg-[#1A1311] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#888] focus:outline-none focus:border-[#C66B3D] transition-colors text-center tracking-[0.5em] text-2xl"
                autoFocus
                required
                maxLength={6}
              />
            </div>
            {error && <p className="text-xs text-red-400 text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-[#C66B3D] text-white font-bold py-3 rounded-xl text-sm uppercase tracking-wider hover:bg-[#FF8C5A] transition-colors disabled:opacity-50"
            >
              {loading ? 'Vérification...' : 'Vérifier'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('email'); setError(''); setOtp(''); }}
              className="w-full text-xs text-[#888] hover:text-white transition-colors"
            >
              ← Changer d'email
            </button>
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