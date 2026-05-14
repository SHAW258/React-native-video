import React from 'react';
import { View, TouchableWithoutFeedback, ActivityIndicator, Text, StyleSheet } from 'react-native';        
import { TopBar, CenterControls, BottomBar, LoadingOverlay } from './VideoPlayerComponents';
import { SettingsModal } from './SettingsModal';
import { playerStyles as styles } from './VideoPlayerStyles';

export const FullscreenPlayerView = ({
  player,
  video,
  onNext,
  onPrevious,
  iconOpacity,
  width,
  height,
}: any) => (
  <View style={[StyleSheet.absoluteFill, { width, height }]}>
    <View style={[styles.videoWrapper, StyleSheet.absoluteFill]}>
      {/* Backdrop for toggling controls */}
      {!player.isPip && (
        <TouchableWithoutFeedback onPress={player.handleMainPress}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      )}

      <LoadingOverlay visible={(player.loading || player.hasError) && !player.isPip} thumbnailUrl={video.thumbnailUrl} />

      {(player.loading || player.isBuffering || !player.isConnected) && !player.hasError && !player.isPip && (
        <View style={styles.centerOverlay} pointerEvents="none">
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size={80} color="#fff" />
            {!player.isConnected && <Text style={styles.offlineText}>No internet connection</Text>}        
          </View>
        </View>
      )}

      {player.showControls && !player.isPip && (
        <View pointerEvents="box-none" style={styles.controlsOverlay}>
          <TopBar
              title={video.title} isFullscreen={true}
              isAutoplay={player.isAutoplay} setIsAutoplay={player.setIsAutoplay}
              toggleSettings={player.toggleSettings} onPipPress={player.togglePip}
              opacity={iconOpacity}
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
              isFullscreen={true} loading={player.loading}
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
