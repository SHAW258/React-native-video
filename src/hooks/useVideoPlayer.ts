import {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, StatusBar, PanResponder, GestureResponderEvent} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import NavigationBar from 'react-native-system-navigation-bar';
import NetInfo from '@react-native-community/netinfo';
import {handleMediaError} from '../services/ErrorService';
import {VideoItem} from '../components/VideoPlayer';

interface UseVideoPlayerProps {
  onFullscreenChange: (isFullscreen: boolean) => void;
  video: VideoItem;
  onMinimize?: () => void;
  onExpand?: () => void;
  isMinimized?: boolean;
}

export function useVideoPlayer({
  onFullscreenChange,
  video,
  onMinimize,
  onExpand,
  isMinimized = false,
}: UseVideoPlayerProps) {
  // Playback State
  const [paused, setPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Settings & Preferences
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [quality, setQuality] = useState('Auto');
  const [qualityProfile, setQualityProfile] = useState<'auto' | 'high' | 'saver'>('auto');
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isPip, setIsPip] = useState(false);

  // Refs for Gesture Handler
  const isFullscreenRef = useRef(false);
  const isMinimizedRef = useRef(false);

  useEffect(() => { isFullscreenRef.current = isFullscreen; }, [isFullscreen]);
  useEffect(() => { isMinimizedRef.current = isMinimized; }, [isMinimized]);

  // UI State (Menus)
  const [showSettings, setShowSettings] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showPreferenceMenu, setShowPreferenceMenu] = useState(false);

  const [bufferConfig] = useState({
    minBufferMs: 15000, maxBufferMs: 50000,
    bufferForPlaybackMs: 2500, bufferForPlaybackAfterRebufferMs: 5000,
  });

  const [skipType, setSkipType] = useState<'back' | 'forward' | null>(null);
  const skipAnim = useRef(new Animated.Value(0)).current;
  const lastTap = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<Video>(null);

  // Reset on video change
  useEffect(() => {
    setLoading(true); setHasError(false);
    setCurrentTime(0); setDuration(0);
    setPaused(false); setShowControls(true); 
    setIsPip(false); setShowSettings(false);
  }, [video.id]);

  // Network Monitoring
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const startAutoHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (isPip || isMinimized) return;
    hideTimer.current = setTimeout(() => setShowControls(false), 3500);
  };

  useEffect(() => {
    if (showControls && !paused && !isPip && !isMinimized) startAutoHide();
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [showControls, paused, isPip, isMinimized]);

  useEffect(() => {
    if (isFullscreen) {
      StatusBar.setHidden(true, 'fade');
      NavigationBar.navigationHide();
    } else {
      StatusBar.setHidden(false, 'fade');
      NavigationBar.navigationShow();
    }
  }, [isFullscreen]);

  useEffect(() => {
    return () => {
      Orientation.lockToPortrait();
      StatusBar.setHidden(false);
      NavigationBar.navigationShow();
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const toggleFullscreen = () => {
    if (isFullscreen) {
      Orientation.lockToPortrait();
      setIsFullscreen(false);
      onFullscreenChange(false);
    } else {
      Orientation.lockToLandscape();
      setIsFullscreen(true);
      onFullscreenChange(true);
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    setIsBuffering(true);
    videoRef.current?.seek(time);
  };

  const showSkipEffect = (type: 'back' | 'forward') => {
    setSkipType(type);
    skipAnim.setValue(0);
    Animated.sequence([
      Animated.timing(skipAnim, {toValue: 1, duration: 200, useNativeDriver: true}),
      Animated.delay(400),
      Animated.timing(skipAnim, {toValue: 0, duration: 200, useNativeDriver: true}),
    ]).start(() => setSkipType(null));
  };

  const toggleSettings = () => {
    setShowSettings(prev => !prev);
    setShowSpeedMenu(false);
    setShowQualityMenu(false);
    setShowPreferenceMenu(false);
  };

  const onVideoError = (e: any) => {
    handleMediaError(e);
    setHasError(true); setLoading(false); setIsBuffering(false);
  };

  const onVideoLoad = (d: {duration: number}) => {
    setHasError(false); setDuration(d.duration); setLoading(false);
  };

  const handleMainPress = (evt: GestureResponderEvent) => {
    if (isPip) return;
    if (isMinimizedRef.current) {
        onExpand?.();
        return;
    }

    const now = Date.now();
    const {locationX} = evt.nativeEvent;
    const {width: sw} = Dimensions.get('window');

    if (lastTap.current && now - lastTap.current < 300) {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (locationX < sw * 0.4) {
        handleSeek(Math.max(0, currentTime - 10));
        showSkipEffect('back');
      } else if (locationX > sw * 0.6) {
        handleSeek(Math.min(duration, currentTime + 10));
        showSkipEffect('forward');
      }
    } else {
      setShowControls(prev => !prev);
    }
    lastTap.current = now;
  };

  // PAN RESPONDER
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => {
        return Math.abs(gs.dx) > 10 || Math.abs(gs.dy) > 10;
      },
      onPanResponderRelease: (evt, gs) => {
        const now = Date.now();
        // 1. SWIPE DOWN TO MINIMIZE
        if (!isMinimizedRef.current && gs.dy > 60 && Math.abs(gs.dx) < 60 && onMinimize) {
            onMinimize();
        } 
        // 2. SWIPE UP TO EXPAND
        else if (isMinimizedRef.current && (gs.dy < -60 || Math.abs(gs.dx) < 10) && onExpand) {
            onExpand();
        } 
        // 3. TAP DETECTION
        else if (Math.abs(gs.dx) < 10 && Math.abs(gs.dy) < 10) {
            handleMainPress(evt);
        }
      },
    })
  ).current;

  return {
    paused, setPaused,
    isFullscreen, toggleFullscreen,
    isPip, setIsPip, onPictureInPictureStatusChanged: (e: any) => setIsPip(e.isActive),
    showControls, setShowControls,
    currentTime, duration,
    skipType, skipAnim,
    videoRef,
    loading, setLoading,
    isBuffering, setIsBuffering,
    isConnected, hasError,
    playbackRate, setPlaybackRate,
    quality, setQuality,
    qualityProfile, setQualityProfile,
    bufferConfig,
    isAutoplay, setIsAutoplay,
    showSettings, setShowSettings,
    showSpeedMenu, setShowSpeedMenu,
    showQualityMenu, setShowQualityMenu,
    showPreferenceMenu, setShowPreferenceMenu,
    toggleSettings,
    handleSeek,
    onVideoError,
    onVideoLoad,
    panResponder,
    handleMainPress,
    onProgress: (data: {currentTime: number}) => { if (isConnected) setCurrentTime(data.currentTime); },
  };
}
