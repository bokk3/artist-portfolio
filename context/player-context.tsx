"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

type Track = {
  id: number;
  title: string;
  artist: string;
  audioUrl: string;
  coverImageUrl?: string;
  waveformData?: string; // JSON string
};

type PlayerContextType = {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  playNext: () => void;
  playPrev: () => void;
  playlist: Track[];
  setPlaylist: (tracks: Track[]) => void;
  removeTrack: (trackId: number) => void;
  reorderTracks: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  stop: () => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [playlist, setPlaylist] = useState<Track[]>([]);

  const stop = () => {
    setIsPlaying(false);
    // Note: The actual WaveSurfer instance cleanup is handled in the Player component
  };

  const playTrack = (track: Track) => {
    // Stop current track before playing a new one
    if (currentTrack && currentTrack.id !== track.id) {
      stop();
    }
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const playNext = () => {
    if (!currentTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playTrack(playlist[nextIndex]);
  };

  const playPrev = () => {
    if (!currentTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playTrack(playlist[prevIndex]);
  };

  const removeTrack = (trackId: number) => {
    // Don't remove the currently playing track
    if (currentTrack?.id === trackId) return;
    
    setPlaylist(playlist.filter((t) => t.id !== trackId));
  };

  const reorderTracks = (fromIndex: number, toIndex: number) => {
    const newPlaylist = [...playlist];
    const [removed] = newPlaylist.splice(fromIndex, 1);
    newPlaylist.splice(toIndex, 0, removed);
    setPlaylist(newPlaylist);
  };

  const clearQueue = () => {
    // Keep the current track playing, just clear the rest of the queue
    if (currentTrack) {
      setPlaylist([currentTrack]);
    } else {
      setPlaylist([]);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        playTrack,
        togglePlay,
        setVolume,
        playNext,
        playPrev,
        playlist,
        setPlaylist,
        removeTrack,
        reorderTracks,
        clearQueue,
        stop,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
