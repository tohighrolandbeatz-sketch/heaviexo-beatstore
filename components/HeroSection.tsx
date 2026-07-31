"use client";

import { useDesign } from "@/contexts/DesignContext";

export default function HeroSection() {
  const { design, loading } = useDesign();
  const { hero, branding } = design;

  if (loading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-b from-[var(--surface)] to-[var(--background)] py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/3 mx-auto"></div>
            <div className="h-16 bg-gray-700 rounded w-2/3 mx-auto"></div>
            <div className="h-6 bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[var(--surface)] to-[var(--background)] py-20">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 text-center">
        {hero.badge && (
          <span className="inline-block px-4 py-2 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium mb-6">
            {hero.badge}
          </span>
        )}
        
        <h1 className="text-5xl md:text-7xl font-bold text-[var(--text)] mb-6">
          {hero.title || "Des sons qui font la différence"}
        </h1>
        
        <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
          {hero.subtitle || "Beats professionnels pour artistes exigeants"}
        </p>
      </div>
    </div>
  );
}
