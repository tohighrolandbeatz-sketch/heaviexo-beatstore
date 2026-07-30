'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl md:text-6xl font-black text-white tracking-wider uppercase text-center">
        Welcome,<br/>please enter
      </h1>
      <button
        onClick={() => router.push('/beatstore')}
        className="px-8 py-4 bg-[#C66B3D] text-white font-bold text-lg rounded-full hover:bg-[#FF8C5A] transition-all hover:scale-105 shadow-lg shadow-[#C66B3D]/20 animate-pulse"
      >
        ENTRER
      </button>
    </div>
  );
}
