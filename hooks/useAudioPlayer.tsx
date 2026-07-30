'use client';

import { useState, useRef, useEffect } from "react";
import { Beat } from "@/types";

export function useAudioPlayer() {
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tagAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current && currentBeat?.previewMp3) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentBeat]);

  const togglePlay = (beat: Beat) => {
    if (!beat.previewMp3) return;
    if (currentBeat?.id === beat.id) {
      setIsPlaying(!isPlaying);
    } else { 
      setCurrentBeat(beat); 
      setIsPlaying(true); 
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const formatTime = (time: number) => {
    if (!time || !isFinite(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const AudioElements = () => (
    <>
      {currentBeat?.previewMp3 && (
        <audio 
          ref={audioRef} 
          src={currentBeat.previewMp3} 
          onTimeUpdate={handleTimeUpdate} 
          onEnded={() => setIsPlaying(false)} 
        />
      )}
      <audio ref={tagAudioRef} src="/tag.wav" />
    </>
  );

  return {
    currentBeat,
    isPlaying,
    currentTime,
    duration,
    volume,
    AudioElements,
    togglePlay,
    setVolume,
    formatTime
  };
}
