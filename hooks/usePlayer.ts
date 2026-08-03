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

// Élément audio principal, GLOBAL, jamais détruit
let globalAudio: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') {
  globalAudio = new Audio();
  globalAudio.volume = 0.8;
}

// Élément audio du TAG (joué en overlay par-dessus la preview), GLOBAL lui aussi
let tagAudio: HTMLAudioElement | null = null;
let tagAudioUrl: string | null = null;
let tagIntervalId: ReturnType<typeof setInterval> | null = null;
const TAG_INTERVAL_MS = 20000; // le tag revient toutes les 20 secondes

function ensureTagAudio() {
  if (typeof window === 'undefined' || !tagAudioUrl) return;
  if (!tagAudio) {
    tagAudio = new Audio(tagAudioUrl);
    tagAudio.volume = 0.55;
  } else if (tagAudio.src !== tagAudioUrl) {
    tagAudio.src = tagAudioUrl;
  }
}

// Appelé une fois la config chargée (voir app/beatstore/page.tsx)
export function setTagAudioUrl(url: string) {
  if (!url || url === tagAudioUrl) return;
  tagAudioUrl = url;
  ensureTagAudio();
}

function startTagLoop() {
  if (!tagAudioUrl) return;
  ensureTagAudio();
  stopTagLoop();
  // Le premier tag attend le premier intervalle complet — il ne joue jamais
  // avant que l'audio principal soit confirmé "playing" (voir l'event ci-dessous).
  tagIntervalId = setInterval(() => {
    if (!tagAudio || globalAudio?.paused) return;
    tagAudio.currentTime = 0;
    tagAudio.play().catch(() => {});
  }, TAG_INTERVAL_MS);
}

function stopTagLoop() {
  if (tagIntervalId) {
    clearInterval(tagIntervalId);
    tagIntervalId = null;
  }
  tagAudio?.pause();
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

let onEndCallback: (() => void) | null = null;

let listenersAttached = false;
function attachAudioListeners() {
  if (listenersAttached || !globalAudio) return;
  listenersAttached = true;
  const audio = globalAudio;

  audio.addEventListener('timeupdate', () => setStore({ currentTime: audio.currentTime }));
  audio.addEventListener('loadedmetadata', () => setStore({ duration: audio.duration }));

  // Ne démarre la boucle du tag QUE quand l'audio principal joue vraiment
  // (chargement réseau terminé et son audible) — évite le tag qui joue
  // "dans le vide" pendant que le fichier charge encore.
  audio.addEventListener('playing', () => startTagLoop());
  audio.addEventListener('pause', () => stopTagLoop());
  audio.addEventListener('waiting', () => stopTagLoop()); // rebuffering

  audio.addEventListener('ended', () => {
    setStore({ isPlaying: false });
    stopTagLoop();
    if (onEndCallback) onEndCallback();
  });
}
attachAudioListeners();

export function usePlayer() {
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