import { Metadata } from 'next';
import { beatRepository } from '@/lib/repositories/beatRepository';
import BeatPageClient from './BeatPageClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const beat = await beatRepository.findById(id);

  if (!beat) {
    return { title: 'Beat introuvable - HEAVIEXO BEATS' };
  }

  return {
    title: `${beat.title} - HEAVIEXO BEATS`,
    description: `${beat.genre} • ${beat.bpm} BPM • ${beat.musical_key} • Produit par HeavieXo`,
    openGraph: {
      title: `${beat.title} - HEAVIEXO BEATS`,
      description: `${beat.genre} • ${beat.bpm} BPM • ${beat.musical_key}`,
      images: [beat.cover_url || '/LOGO-BEAT.png'],
      audio: beat.preview_url || undefined,
      type: 'music.song',
    },
    twitter: {
      card: 'player',
      title: `${beat.title} - HEAVIEXO BEATS`,
      description: `${beat.genre} • ${beat.bpm} BPM`,
      images: [beat.cover_url || '/LOGO-BEAT.png'],
      players: beat.preview_url ? [{ playerUrl: `${process.env.NEXT_PUBLIC_URL}/beat/${id}`, streamUrl: beat.preview_url, width: 480, height: 480 }] : undefined,
    },
    other: {
      'og:audio': beat.preview_url || '',
      'og:audio:type': 'audio/mpeg',
    },
  };
}

export default async function BeatPage({ params }: Props) {
  const { id } = await params;
  const beat = await beatRepository.findById(id);

  if (!beat) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Beat introuvable.</p>
      </div>
    );
  }

  return <BeatPageClient beat={beat} />;
}
