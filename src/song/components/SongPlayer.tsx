import React from 'react';
import {
  Image,
  Pressable,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSongPlayer} from '../hooks/useSongPlayer';
import type {SongItem} from '../types';
import {SongSettingsModal} from './SongSettingsModal';
import {songStyles as styles} from './SongPlayerStyles';
import { TopBar, CenterControls, BottomBar } from '../../components/VideoPlayerComponents';

interface SongPlayerProps {
  song: SongItem;
  onNext: () => void;
  onPrevious: () => void;
  isMinimized?: boolean;
  onExpand?: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
}

export function SongPlayer({
  song,
  onNext,
  onPrevious,
  isMinimized = false,
  onExpand,
  onClose,
  onMinimize,
}: SongPlayerProps) {
  const player = useSongPlayer({song, onNext});
  const iconOpacity =
    player.isBusy || !player.canUseControls || player.hasError ? 0.45 : 1;
  
  const progressPercent =
    player.duration > 0
      ? Math.min((player.currentTime / player.duration) * 100, 100)
      : 0;

  if (isMinimized) {
    return (
      <View style={styles.miniContainer}>
        <Pressable onPress={onExpand} style={styles.miniContentInner}>
          <Image source={{uri: song.thumbnailUrl}} style={styles.miniArtwork} />
          <View style={styles.miniControlsOverlay}>
            <Pressable
              onPress={event => {
                event.stopPropagation();
                player.togglePlay();
              }}
              style={styles.miniIconButton}>
              <Icon
                name={player.isPlaying ? 'pause' : 'play-arrow'}
                size={32}
                color="#fff"
                style={{opacity: iconOpacity}}
              />
            </Pressable>
          </View>
          <Pressable
            onPress={event => {
              event.stopPropagation();
              onClose?.();
            }}
            style={styles.miniCloseButton}>
            <Icon name="close" size={18} color="#fff" />
          </Pressable>
          <View style={[styles.miniProgressBar, {width: `${progressPercent}%`}]} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.normalContainer]}>
      <View style={styles.videoWrapper}>
        <Image source={{uri: song.thumbnailUrl}} style={styles.artwork} resizeMode="cover" />
        
        <TouchableWithoutFeedback
            onPress={() => player.setShowControls(!player.showControls)}>
            <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        {player.showControls && (
            <View pointerEvents="box-none" style={styles.controlsOverlay}>
                <TopBar 
                    title={song.title} 
                    isFullscreen={false} 
                    isAutoplay={player.isAutoplay} 
                    setIsAutoplay={player.setIsAutoplay} 
                    toggleSettings={() => player.setShowSettings(true)} 
                    onPipPress={player.togglePip}
                    onMinimize={onMinimize} 
                    opacity={iconOpacity} 
                />
                <CenterControls 
                    onPrevious={onPrevious} 
                    onNext={onNext} 
                    paused={!player.isPlaying} 
                    setPaused={player.togglePlay} 
                    loading={player.isBusy} 
                    opacity={iconOpacity} 
                    isConnected={player.isConnected}
                />
                <BottomBar 
                    currentTime={player.currentTime} 
                    duration={player.duration} 
                    handleSeek={player.handleSeek} 
                    toggleFullscreen={() => {}} // No fullscreen for song
                    isFullscreen={false} 
                    loading={player.isBusy} 
                    opacity={iconOpacity} 
                />
            </View>
        )}

        <SongSettingsModal
            visible={player.showSettings}
            onClose={() => player.setShowSettings(false)}
            showSpeedMenu={player.showSpeedMenu}
            setShowSpeedMenu={player.setShowSpeedMenu}
            playbackRate={player.playbackRate}
            setPlaybackRate={player.setPlaybackRate}
        />
      </View>
    </View>
  );
}
