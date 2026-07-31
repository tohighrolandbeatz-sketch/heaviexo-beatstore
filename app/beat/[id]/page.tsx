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
    description: `${beat.title} - ${beat.genre} ${beat.bpm}BPM ${beat.musical_key}. ${beat.description || 'Beat exclusif par HeavieXo.'}`.substring(0, 200),
    openGraph: {
      title: `${beat.title} - HEAVIEXO BEATS`,
      description: `${beat.genre} • ${beat.bpm} BPM • ${beat.musical_key}`,
      images: [beat.cover_url || '/LOGO-BEAT.png'],
      type: 'music.song',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${beat.title} - HEAVIEXO BEATS`,
      description: `${beat.genre} • ${beat.bpm} BPM`,
      images: [beat.cover_url || '/LOGO-BEAT.png'],
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
