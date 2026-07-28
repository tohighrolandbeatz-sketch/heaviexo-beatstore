"use client";

import React, { useEffect, useState } from "react";
import AdminDashboard from "@/components/AdminDashboard";
import { Lock, Send, KeyRound } from "lucide-react";

export default function AdminPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [beatsList, setBeatsList] = useState<any[]>([]);
  const [kitsList, setKitsList] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleSendCode = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send" })
      });
      const data = await res.json();
      if (data.success) {
        setCodeSent(true);
      } else {
        setAuthError("Impossible de générer le code. Réessaie.");
      }
    } catch (err) {
      setAuthError("Erreur de connexion au serveur.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", code: enteredCode })
      });
      const data = await res.json();
      if (data.success) {
        setIsVerified(true);
      } else {
        setAuthError("Code incorrect. Vérifie le terminal du serveur pour le code actif.");
      }
    } catch (err) {
      setAuthError("Erreur de connexion au serveur.");
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    if (!isVerified) return;

    const loadAll = async () => {
      try {
        const [beatsRes, kitsRes, licensesRes] = await Promise.all([
          fetch("/api/beats", { cache: "no-store" }),
          fetch("/api/kits", { cache: "no-store" }),
          fetch("/api/licenses", { cache: "no-store" })
        ]);
        const beats = await beatsRes.json();
        const kits = await kitsRes.json();
        const savedLicenses = await licensesRes.json();

        setBeatsList(beats);
        setKitsList(kits);
        setLicenses(savedLicenses);
      } catch (err) {
        console.error("Erreur de chargement des données admin :", err);
      } finally {
        setDataLoaded(true);
      }
    };

    loadAll();
  }, [isVerified]);

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-tight">Accès Sécurisé</h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Un code de vérification est requis pour accéder au Control Center HEAVIEX'O.
            </p>
          </div>

          {!codeSent ? (
            <button
              onClick={handleSendCode}
              disabled={authLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{authLoading ? "Génération..." : "Générer le code d'accès"}</span>
            </button>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <p className="text-[11px] text-zinc-400 text-center">
                Code généré. Regarde le terminal de ton serveur (VS Code) pour voir le code à 6 chiffres, puis saisis-le ci-dessous.
              </p>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Code à 6 chiffres"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white text-center tracking-widest font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {authError && (
                <p className="text-xs text-red-400 text-center">{authError}</p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 disabled:opacity-50 text-black font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                {authLoading ? "Vérification..." : "Valider et Entrer"}
              </button>

              <button
                type="button"
                onClick={handleSendCode}
                className="w-full text-[11px] text-zinc-500 hover:text-emerald-400 transition-colors"
              >
                Renvoyer un nouveau code
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-sm text-zinc-400">
        Chargement du Control Center...
      </div>
    );
  }

  return (
    <AdminDashboard
      beatsList={beatsList}
      setBeatsList={setBeatsList}
      kitsList={kitsList}
      setKitsList={setKitsList}
      licenses={licenses}
      setLicenses={setLicenses}
    />
  );
}