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

export type RepeatMode = "off" | "all" | "one";

type PlayerContextType = {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  reorderTracks: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  stop: () => void;
  playNext: () => void; // Plays next in sequence
  playPrev: () => void;
  playlist: Track[];
  setPlaylist: (tracks: Track[]) => void;
  removeTrack: (trackId: number) => void;
  addToQueue: (tracks: Track[]) => void; // Appends to end
  playNextInQueue: (track: Track) => void; // Inserts right after current
};

const STORAGE_KEY = "artist_portfolio_player_state_v1";

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [shuffledPlaylist, setShuffledPlaylist] = useState<Track[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.volume !== undefined) setVolume(parsed.volume);
        if (parsed.shuffle !== undefined) setShuffle(parsed.shuffle);
        if (parsed.repeat !== undefined) setRepeat(parsed.repeat);
        if (parsed.playlist) setPlaylist(parsed.playlist);
        // Don't auto-play, but restore current track
        if (parsed.currentTrack) setCurrentTrack(parsed.currentTrack);
      }
    } catch (e) {
      console.error("Failed to load player state:", e);
    }
    setIsInitialized(true);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const stateToSave = {
        volume,
        shuffle,
        repeat,
        playlist,
        currentTrack,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Failed to save player state:", e);
    }
  }, [volume, shuffle, repeat, playlist, currentTrack, isInitialized]);

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

  const toggleShuffle = () => {
    setShuffle((prev) => {
      const newShuffleState = !prev;
      if (newShuffleState) {
        // Enable shuffle - create shuffled copy
        // Use Fisher-Yates shuffle
        const shuffled = [...playlist];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setShuffledPlaylist(shuffled);
      } else {
        // Disable shuffle - clear shuffled list
        setShuffledPlaylist([]);
      }
      return newShuffleState;
    });
  };

  const toggleRepeat = () => {
    setRepeat((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  };

  const playNext = () => {
    if (!currentTrack || playlist.length === 0) return;

    const activePlaylist =
      shuffle && shuffledPlaylist.length > 0 ? shuffledPlaylist : playlist;
    const currentIndex = activePlaylist.findIndex(
      (t) => t.id === currentTrack.id
    );

    if (repeat === "one") {
      // Repeat current track
      playTrack(currentTrack);
      return;
    }

    if (currentIndex === -1 || currentIndex === activePlaylist.length - 1) {
      // End of playlist
      if (repeat === "all") {
        // Loop back to start
        playTrack(activePlaylist[0]);
      }
      return;
    }

    const nextIndex = currentIndex + 1;
    playTrack(activePlaylist[nextIndex]);
  };

  const playPrev = () => {
    if (!currentTrack || playlist.length === 0) return;

    const activePlaylist =
      shuffle && shuffledPlaylist.length > 0 ? shuffledPlaylist : playlist;
    const currentIndex = activePlaylist.findIndex(
      (t) => t.id === currentTrack.id
    );

    if (repeat === "one") {
      // Repeat current track
      playTrack(currentTrack);
      return;
    }

    if (currentIndex <= 0) {
      // Start of playlist
      if (repeat === "all") {
        // Loop to end
        playTrack(activePlaylist[activePlaylist.length - 1]);
      }
      return;
    }

    const prevIndex = currentIndex - 1;
    playTrack(activePlaylist[prevIndex]);
  };

  // Update shuffled playlist when playlist changes
  // Update shuffled playlist when playlist changes (add/remove tracks)
  useEffect(() => {
    if (shuffle && playlist.length > 0) {
      // Only re-shuffle if the playlist length or content actually changed
      // For now, we just re-shuffle to keep it simple and consistent
      const shuffled = [...playlist];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledPlaylist(shuffled);
    }
  }, [playlist]); // Removed 'shuffle' from dependencies to avoid double-shuffle on toggle

  const removeTrack = (trackId: number) => {
    // Don't remove the currently playing track
    if (currentTrack?.id === trackId) return;

    setPlaylist(playlist.filter((t) => t.id !== trackId));
  };

  const reorderTracks = (fromIndex: number, toIndex: number) => {
    setPlaylist((prev) => {
      const newPlaylist = [...prev];
      const [removed] = newPlaylist.splice(fromIndex, 1);
      newPlaylist.splice(toIndex, 0, removed);
      return newPlaylist;
    });
  };

  const playNextInQueue = (track: Track) => {
    setPlaylist((prev) => {
      if (!currentTrack) return [...prev, track];

      const currentIndex = prev.findIndex((t) => t.id === currentTrack.id);
      if (currentIndex === -1) return [...prev, track];

      const newPlaylist = [...prev];
      newPlaylist.splice(currentIndex + 1, 0, track);
      return newPlaylist;
    });
  };

  const addToQueue = (tracksToAdd: Track[]) => {
    setPlaylist((prev) => {
      const existingIds = new Set(prev.map((t) => t.id));
      const newTracks = tracksToAdd.filter((t) => !existingIds.has(t.id));
      return [...prev, ...newTracks];
    });
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
        shuffle,
        repeat,
        playTrack,
        togglePlay,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        playNext,
        playPrev,
        playlist,
        setPlaylist,
        addToQueue,
        playNextInQueue,
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
