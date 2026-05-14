import React from 'react';
import { View, TouchableWithoutFeedback, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { TopBar, CenterControls, BottomBar, LoadingOverlay } from './VideoPlayerComponents';
import { SettingsModal } from './SettingsModal';
import { playerStyles as styles } from './VideoPlayerStyles';

export const NormalPlayerView = ({
  player,
  video,
  onNext,
  onPrevious,
  onMinimize,
  iconOpacity,
}: any) => (
  <View style={styles.normalContainer}>
    <View style={styles.videoWrapper}>
      {/* Backdrop for toggling controls */}
      {!player.isPip && (
        <TouchableWithoutFeedback onPress={player.handleMainPress}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      )}

      <LoadingOverlay visible={(player.loading || player.hasError) && !player.isPip} thumbnailUrl={video.thumbnailUrl} />

      {(player.loading || player.isBuffering) && !player.hasError && !player.isPip && (
        <View style={styles.centerOverlay} pointerEvents="none">
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size={80} color="#fff" />
          </View>
        </View>
      )}

      {player.showControls && !player.isPip && (
        <View pointerEvents="box-none" style={styles.controlsOverlay}>
          <TopBar 
              title={video.title} isFullscreen={false} 
              isAutoplay={player.isAutoplay} setIsAutoplay={player.setIsAutoplay} 
              toggleSettings={player.toggleSettings} onPipPress={player.togglePip}
              onMinimize={onMinimize} opacity={iconOpacity} 
          />
          <CenterControls 
              onPrevious={onPrevious} onNext={onNext} 
              paused={player.paused} setPaused={player.setPaused} 
              loading={player.loading} isBuffering={player.isBuffering} 
              opacity={iconOpacity} isConnected={player.isConnected}
          />
          <BottomBar 
              currentTime={player.currentTime} duration={player.duration} 
              handleSeek={player.handleSeek} toggleFullscreen={player.toggleFullscreen} 
              isFullscreen={false} loading={player.loading} 
              opacity={iconOpacity} 
          />
        </View>
      )}

      <SettingsModal
        visible={player.showSettings && !player.isPip}
        onClose={() => player.setShowSettings(false)}
        showSpeedMenu={player.showSpeedMenu}
        setShowSpeedMenu={player.setShowSpeedMenu}
        showQualityMenu={player.showQualityMenu}
        setShowQualityMenu={player.setShowQualityMenu}
        showPreferenceMenu={player.showPreferenceMenu}
        setShowPreferenceMenu={player.setShowPreferenceMenu}
        playbackRate={player.playbackRate}
        setPlaybackRate={player.setPlaybackRate}
        quality={player.quality}
        setQuality={player.setQuality}
        qualityProfile={player.qualityProfile}
        setQualityProfile={player.setQualityProfile}
      />
    </View>
  </View>
);
