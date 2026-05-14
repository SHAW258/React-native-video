import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSongPlayer} from '../hooks/useSongPlayer';
import type {SongItem} from '../types';
import {SongSettingsModal} from './SongSettingsModal';
import {songStyles as styles} from './SongPlayerStyles';

interface SongPlayerProps {
  song: SongItem;
  onNext: () => void;
  onPrevious: () => void;
  isMinimized?: boolean;
  onExpand?: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function StatChip({children}: {children: React.ReactNode}) {
  return <Text style={styles.chip}>{children}</Text>;
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
        <Pressable onPress={onExpand} style={styles.miniInner}>
          <Image source={{uri: song.thumbnailUrl}} style={styles.miniArtwork} />
          <View style={styles.miniText}>
            <Text style={styles.miniTitle} numberOfLines={1}>
              {song.title}
            </Text>
            <Text style={styles.miniArtist} numberOfLines={1}>
              {song.artist || song.category || 'MediaApp'}
            </Text>
          </View>
          <Pressable
            onPress={event => {
              event.stopPropagation();
              player.togglePlay();
            }}
            style={styles.iconButton}>
            <Icon
              name={player.isPlaying ? 'pause' : 'play-arrow'}
              size={32}
              color="#fff"
              style={{opacity: iconOpacity}}
            />
          </Pressable>
          <Pressable
            onPress={event => {
              event.stopPropagation();
              onClose?.();
            }}
            style={styles.iconButton}>
            <Icon name="close" size={22} color="#fff" />
          </Pressable>
        </Pressable>
        <View style={[styles.miniProgress, {width: `${progressPercent}%`}]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.normalContainer]}>
      <Image source={{uri: song.thumbnailUrl}} style={styles.artwork} />
      <TouchableWithoutFeedback
        onPress={() => player.setShowControls(!player.showControls)}>
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <View style={styles.titleGroup}>
              <Text style={styles.category}>
                {song.category || song.mediaType || 'Song'}
              </Text>
              <Text style={styles.title} numberOfLines={1}>
                {song.title}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {song.artist || 'MediaApp'}
              </Text>
            </View>
            <Pressable onPress={onMinimize} style={styles.iconButton}>
              <Icon name="keyboard-arrow-down" size={30} color="#fff" />
            </Pressable>
            <Pressable
              onPress={() => player.setIsAutoplay(!player.isAutoplay)}
              style={styles.iconButton}>
              <Icon
                name={player.isAutoplay ? 'toggle-on' : 'toggle-off'}
                size={34}
                color={player.isAutoplay ? '#3EA6FF' : '#fff'}
              />
            </Pressable>
            <Pressable
              onPress={() => player.setShowSettings(true)}
              style={styles.iconButton}>
              <Icon name="settings" size={24} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.center}>
            <Pressable onPress={onPrevious} style={styles.iconButton}>
              <Icon
                name="skip-previous"
                size={42}
                color="#fff"
                style={{opacity: iconOpacity}}
              />
            </Pressable>
            <Pressable
              onPress={player.togglePlay}
              style={styles.playButton}
              disabled={!player.canUseControls || player.isBusy}>
              {player.isBusy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Icon
                  name={player.isPlaying ? 'pause' : 'play-arrow'}
                  size={44}
                  color="#fff"
                  style={{opacity: iconOpacity}}
                />
              )}
            </Pressable>
            <Pressable onPress={onNext} style={styles.iconButton}>
              <Icon
                name="skip-next"
                size={42}
                color="#fff"
                style={{opacity: iconOpacity}}
              />
            </Pressable>
          </View>

          <View style={styles.bottom}>
            {song.description ? (
              <Text style={styles.description} numberOfLines={2}>
                {song.description}
              </Text>
            ) : null}
            <View style={styles.metaRow}>
              {song.format ? <StatChip>{song.format.toUpperCase()}</StatChip> : null}
              {song.duration ? <StatChip>{song.duration}</StatChip> : null}
              {typeof song.views === 'number' ? (
                <StatChip>{song.views} views</StatChip>
              ) : null}
              {typeof song.likes === 'number' ? (
                <StatChip>{song.likes} likes</StatChip>
              ) : null}
              <StatChip>{song.isPremium ? 'Premium' : 'Free'}</StatChip>
            </View>
            <View style={styles.sliderRow}>
              <Text style={styles.timeText}>{formatTime(player.currentTime)}</Text>
              <Slider
                style={styles.slider}
                value={player.currentTime}
                minimumValue={0}
                maximumValue={player.duration > 0 ? player.duration : 1}
                onSlidingComplete={player.handleSeek}
                minimumTrackTintColor="#3EA6FF"
                maximumTrackTintColor="rgba(255,255,255,0.3)"
                thumbTintColor="#3EA6FF"
              />
              <Text style={styles.timeText}>{formatTime(player.duration)}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <SongSettingsModal
        visible={player.showSettings}
        onClose={() => player.setShowSettings(false)}
        showSpeedMenu={player.showSpeedMenu}
        setShowSpeedMenu={player.setShowSpeedMenu}
        playbackRate={player.playbackRate}
        setPlaybackRate={player.setPlaybackRate}
      />
    </View>
  );
}
