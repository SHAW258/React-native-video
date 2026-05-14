import {useCallback, useEffect, useMemo, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import type {SongItem} from '../types';

interface UseSongPlayerProps {
  song: SongItem;
  onNext: () => void;
}

function parseDuration(duration?: string) {
  if (!duration) {
    return undefined;
  }

  const parts = duration.split(':').map(Number);
  if (parts.some(Number.isNaN)) {
    return undefined;
  }

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  return undefined;
}

export function useSongPlayer({song, onNext}: UseSongPlayerProps) {
  const playbackState = usePlaybackState();
  const progress = useProgress(250);
  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function setupSong() {
      setIsReady(false);
      setHasError(false);

      try {
        await TrackPlayer.setupPlayer({
          autoHandleInterruptions: true,
        });
      } catch (setupError) {
        const code = (setupError as {code?: string}).code;
        if (code !== 'player_already_initialized') {
          throw setupError;
        }
      }

      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
          Capability.SeekTo,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
        notificationCapabilities: [Capability.Play, Capability.Pause],
        progressUpdateEventInterval: 1,
      });

      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: String(song.id),
        url: song.mediaUrl,
        title: song.title,
        artist: song.artist || song.category || 'MediaApp',
        artwork: song.thumbnailUrl,
        duration: parseDuration(song.duration),
      });
      await TrackPlayer.setRate(playbackRate);

      if (isMounted) {
        setIsReady(true);
      }
    }

    setupSong().catch(error => {
      console.error('Song setup error:', error);
      if (isMounted) {
        setHasError(true);
        setIsReady(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [playbackRate, song]);

  const state = playbackState.state;
  const isPlaying = state === State.Playing;
  const isBusy = state === State.Loading || state === State.Buffering;
  const duration = progress.duration || parseDuration(song.duration) || 0;
  const canUseControls = isReady && isConnected && !hasError;

  const togglePlay = useCallback(async () => {
    if (!canUseControls || isBusy) {
      return;
    }

    if (isPlaying) {
      await TrackPlayer.pause();
      return;
    }

    if (state === State.Ended) {
      await TrackPlayer.seekTo(0);
    }

    await TrackPlayer.play();
  }, [canUseControls, isBusy, isPlaying, state]);

  const handleSeek = useCallback(
    async (seconds: number) => {
      if (canUseControls) {
        await TrackPlayer.seekTo(seconds);
      }
    },
    [canUseControls],
  );

  const setPlaybackRate = useCallback(async (rate: number) => {
    setPlaybackRateState(rate);
    await TrackPlayer.setRate(rate);
  }, []);

  useEffect(() => {
    if (state === State.Ended && isAutoplay) {
      onNext();
    }
  }, [isAutoplay, onNext, state]);

  return useMemo(
    () => ({
      isPlaying,
      isBusy,
      isReady,
      isConnected,
      hasError,
      canUseControls,
      currentTime: progress.position,
      duration,
      showControls,
      setShowControls,
      showSettings,
      setShowSettings,
      showSpeedMenu,
      setShowSpeedMenu,
      playbackRate,
      setPlaybackRate,
      isAutoplay,
      setIsAutoplay,
      togglePlay,
      handleSeek,
      status: state ?? 'initializing',
    }),
    [
      canUseControls,
      duration,
      handleSeek,
      hasError,
      isAutoplay,
      isBusy,
      isConnected,
      isPlaying,
      isReady,
      playbackRate,
      progress.position,
      setPlaybackRate,
      showControls,
      showSettings,
      showSpeedMenu,
      state,
      togglePlay,
    ],
  );
}
