import React from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { playerStyles as styles } from './VideoPlayerStyles';

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

/**
 * TopBar: Shows video title and quick settings icons
 */
export const TopBar = ({ title, isFullscreen, isAutoplay, setIsAutoplay, toggleSettings, onPipPress, onMinimize, opacity }: any) => (
  <View style={[styles.topBar, isFullscreen && {paddingTop: 15}]} pointerEvents="box-none">
    <View style={styles.topBarLeft}>
      {/* Minimize Button */}
      <Pressable onPress={onMinimize} style={styles.topIconButton}>
        <Icon name="keyboard-arrow-down" size={30} color="#fff" style={{opacity}} />
      </Pressable>
      <Text style={[styles.videoTitle, {opacity, flex: 1}]} numberOfLines={1}>{title}</Text>
    </View>
    <View style={styles.topBarRight} pointerEvents="box-none">
      {/* Floating Window (PiP) Button */}
      <Pressable onPress={onPipPress} style={styles.topIconButton}>
        <Icon name="picture-in-picture-alt" size={24} color="#fff" style={{opacity}} />
      </Pressable>
      <Pressable onPress={() => setIsAutoplay(!isAutoplay)} style={styles.topIconButton}>
        <Icon name={isAutoplay ? 'toggle-on' : 'toggle-off'} size={32} color={isAutoplay ? '#3EA6FF' : '#fff'} style={{opacity}} />
      </Pressable>
      <Pressable onPress={toggleSettings} style={styles.topIconButton}>
        <Icon name="settings" size={24} color="#fff" style={{opacity}} />
      </Pressable>
    </View>
  </View>
);

/**
 * CenterControls: Play/Pause and Next/Previous buttons
 */
export const CenterControls = ({ onPrevious, onNext, paused, setPaused, loading, opacity, isConnected }: any) => (
  <View style={styles.centerControls} pointerEvents="box-none">
    <Pressable onPress={onPrevious} style={styles.iconButton} pointerEvents="auto">
      <Icon name="skip-previous" size={40} color="#fff" style={{opacity}} />
    </Pressable>
    
    <View style={styles.playButtonWrapper} pointerEvents="box-none">
      <Pressable 
        onPress={() => setPaused(!paused)} 
        style={styles.playButton} 
        pointerEvents={(loading || !isConnected) ? "none" : "auto"}
      >
        <Icon name={paused ? 'play-arrow' : 'pause'} size={40} color="#fff" style={{opacity}} />
      </Pressable>
    </View>

    <Pressable onPress={onNext} style={styles.iconButton} pointerEvents="auto">
      <Icon name="skip-next" size={40} color="#fff" style={{opacity}} />
    </Pressable>
  </View>
);

/**
 * BottomBar: Progress Slider and Fullscreen Toggle
 */
export const BottomBar = ({ currentTime, duration, handleSeek, toggleFullscreen, isFullscreen, loading, opacity }: any) => (
  <View style={styles.bottomBar} pointerEvents="box-none">
    <View style={styles.sliderRow} pointerEvents="box-none">
      <Text style={[styles.timeText, {opacity}]}>{formatTime(loading ? 0 : currentTime)}</Text>
      <Slider
        style={[styles.slider, {opacity}]}
        value={loading ? 0 : currentTime}
        minimumValue={0}
        maximumValue={duration > 0 ? duration : 1}
        onSlidingComplete={handleSeek}
        minimumTrackTintColor="#FF0000"
        maximumTrackTintColor="rgba(255,255,255,0.3)"
        thumbTintColor="#FF0000"
      />
      <Text style={[styles.timeText, {opacity}]}>{formatTime(duration)}</Text>
      <Pressable onPress={toggleFullscreen} style={styles.fullscreenButton}>
        <Icon name={isFullscreen ? 'fullscreen-exit' : 'fullscreen'} size={28} color="#fff" style={{opacity}} />
      </Pressable>
    </View>
  </View>
);

/**
 * LoadingOverlay: Holds the thumbnail during initial load
 */
export const LoadingOverlay = ({ visible, thumbnailUrl }: any) => {
  if (!visible) return null;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Image source={{uri: thumbnailUrl}} style={StyleSheet.absoluteFill} resizeMode="cover" />
    </View>
  );
};
