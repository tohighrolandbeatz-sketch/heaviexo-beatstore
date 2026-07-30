import { useState, useRef, useCallback, useEffect } from 'react';

export interface PlayerState {
  beat: { id: string; title: string; cover?: string; previewMp3?: string; type?: string } | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export function usePlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>({
    beat: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });
  const onEndRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.8;
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ''; };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setState(s => ({ ...s, currentTime: audio.currentTime }));
    const onLoadedMetadata = () => setState(s => ({ ...s, duration: audio.duration }));
    const onEnded = () => {
      setState(s => ({ ...s, isPlaying: false }));
      if (onEndRef.current) onEndRef.current();
    };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const play = useCallback((beat: PlayerState['beat']) => {
    const audio = audioRef.current;
    if (!audio || !beat?.previewMp3) return;
    if (state.beat?.id === beat.id) {
      if (audio.paused) { audio.play(); setState(s => ({ ...s, isPlaying: true })); }
      else { audio.pause(); setState(s => ({ ...s, isPlaying: false })); }
    } else {
      audio.pause(); audio.src = beat.previewMp3;
      audio.play();
      setState({ beat, isPlaying: true, currentTime: 0, duration: 0 });
    }
  }, [state.beat?.id]);

  const togglePlay = useCallback((beat?: PlayerState['beat']) => {
    if (beat) play(beat);
    else if (audioRef.current?.paused) { audioRef.current?.play(); setState(s => ({ ...s, isPlaying: true })); }
    else { audioRef.current?.pause(); setState(s => ({ ...s, isPlaying: false })); }
  }, [play]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setState(s => ({ ...s, isPlaying: false }));
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) { audioRef.current.currentTime = time; setState(s => ({ ...s, currentTime: time })); }
  }, []);

  const setOnEnd = useCallback((cb: (() => void) | null) => {
    onEndRef.current = cb;
  }, []);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const AudioElements = () => null;

  return { currentBeat: state.beat, isPlaying: state.isPlaying, currentTime: state.currentTime, duration: state.duration, AudioElements, togglePlay, play, pause, seek, formatTime, setOnEnd };
}
