'use client';

import { usePlayer } from '@/hooks/usePlayer';
import { Play, Pause } from 'lucide-react';

const fakeBeats = [
  { id: '1', title: 'Beat Dark Trap', type: 'Trap', previewMp3: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '2', title: 'Beat Melodic Drill', type: 'Drill', previewMp3: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: '3', title: 'Beat Boom Bap', type: 'Boom Bap', previewMp3: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function PlayerTest() {
  const { beat, isPlaying, currentTime, duration, play, seek, formatTime } = usePlayer();

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl font-bold mb-6">🎵 Test du Player</h1>

      {fakeBeats.map((b) => (
        <div key={b.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5">
          <button onClick={() => play(b)} className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            {beat?.id === b.id && isPlaying ? <Pause className="w-4 h-4 text-black" /> : <Play className="w-4 h-4 text-black ml-0.5" />}
          </button>
          <span>{b.title}</span>
        </div>
      ))}

      {/* Progress bar */}
      {beat && (
        <div className="mt-8 p-4 bg-white/5 rounded-xl">
          <p className="font-bold">{beat.title}</p>
          <input type="range" min={0} max={duration || 1} value={currentTime} onChange={(e) => seek(Number(e.target.value))} className="w-full mt-2" />
          <p className="text-xs">{formatTime(currentTime)} / {formatTime(duration)}</p>
        </div>
      )}
    </div>
  );
}