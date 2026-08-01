import { useCallback } from 'react';
import { useSyncExternalStore } from 'react';

export interface PlayerBeat {
  id: string;
  title: string;
  cover?: string;
  previewMp3?: string;
  type?: string;
}

export interface PlayerState {
  beat: PlayerBeat | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

// Élément audio GLOBAL partagé, jamais détruit
let globalAudio: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') {
  globalAudio = new Audio();
  globalAudio.volume = 0.8;
}

// État GLOBAL partagé entre TOUS les composants qui appellent usePlayer()
let store: PlayerState = {
  beat: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
};

const listeners = new Set<() => void>();

function setStore(patch: Partial<PlayerState>) {
  store = { ...store, ...patch };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): PlayerState {
  return store;
}

function getServerSnapshot(): PlayerState {
  return { beat: null, isPlaying: false, currentTime: 0, duration: 0 };
}

// Callback "fin de lecture" — géré globalement (un seul actif à la fois)
let onEndCallback: (() => void) | null = null;

// Écouteurs attachés une seule fois sur l'élément audio global
let listenersAttached = false;
function attachAudioListeners() {
  if (listenersAttached || !globalAudio) return;
  listenersAttached = true;
  const audio = globalAudio;

  audio.addEventListener('timeupdate', () => setStore({ currentTime: audio.currentTime }));
  audio.addEventListener('loadedmetadata', () => setStore({ duration: audio.duration }));
  audio.addEventListener('ended', () => {
    setStore({ isPlaying: false });
    if (onEndCallback) onEndCallback();
  });
}
attachAudioListeners();

export function usePlayer() {
  // useSyncExternalStore garantit que TOUS les composants voient le même état
  // et se re-rendent quand il change, où qu'ils soient dans l'arbre React.
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const play = useCallback((beat: PlayerBeat) => {
    const audio = globalAudio;
    if (!audio || !beat?.previewMp3) return;

    if (store.beat?.id === beat.id) {
      // Même beat : toggle play/pause (continue au lieu de relancer)
      if (audio.paused) {
        audio.play();
        setStore({ isPlaying: true });
      } else {
        audio.pause();
        setStore({ isPlaying: false });
      }
    } else {
      // Nouveau beat : stop l'ancien d'abord
      audio.pause();
      audio.currentTime = 0;
      audio.src = beat.previewMp3;
      audio.play().catch(() => {});
      setStore({ beat, isPlaying: true, currentTime: 0, duration: 0 });
    }
  }, []);

  const togglePlay = useCallback((beat?: PlayerBeat) => {
    if (beat) {
      play(beat);
      return;
    }
    const audio = globalAudio;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setStore({ isPlaying: true });
    } else {
      audio.pause();
      setStore({ isPlaying: false });
    }
  }, [play]);

  const pause = useCallback(() => {
    globalAudio?.pause();
    setStore({ isPlaying: false });
  }, []);

  const seek = useCallback((time: number) => {
    if (globalAudio) {
      globalAudio.currentTime = time;
      setStore({ currentTime: time });
    }
  }, []);

  const setOnEnd = useCallback((cb: (() => void) | null) => {
    onEndCallback = cb;
  }, []);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const AudioElements = () => null;

  return {
    currentBeat: state.beat,
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    AudioElements,
    togglePlay,
    play,
    pause,
    seek,
    formatTime,
    setOnEnd,
  };
}