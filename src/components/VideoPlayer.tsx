import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Video from 'react-native-video';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import { playerStyles as styles } from './VideoPlayerStyles';

import { MiniPlayerView } from './MiniPlayerView';
import { NormalPlayerView } from './NormalPlayerView';
import { FullscreenPlayerView } from './FullscreenPlayerView';

export interface VideoItem {
  id: string | number;
  title: string;
  thumbnailUrl: string;
  mediaUrl: string;
  format?: string;
  artist?: string;
}

interface VideoPlayerProps {
  video: VideoItem;
  onNext: () => void;
  onPrevious: () => void;
  onFullscreenChange: (isFullscreen: boolean) => void;
  isMinimized?: boolean;
  onExpand?: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
}

const getMimeType = (url: string, format?: string) => {
  const ext = format || url.split('.').pop()?.split('?')[0].toLowerCase();
  switch (ext) {
    case 'm3u8': return 'm3u8';
    case 'mpd': return 'mpd';
    case 'mp4': return 'mp4';
    case 'mp3': return 'mp3';
    default: return undefined;
  }
};

export default function VideoPlayer({ 
  video, 
  onNext, 
  onPrevious, 
  onFullscreenChange,
  isMinimized = false,
  onExpand,
  onClose,
  onMinimize
}: VideoPlayerProps) {
  const { width, height } = useWindowDimensions();
  
  const player = useVideoPlayer({ 
    onFullscreenChange, 
    video,
    onMinimize,
    onExpand,
    isMinimized
  });

  const iconOpacity = (player.loading || player.isBuffering || !player.isConnected || player.hasError) ? 0.4 : 1;

  return (
    <View 
      style={[
        styles.container, 
        player.isFullscreen ? { width, height, position: 'absolute', zIndex: 9999, top: 0, left: 0 } : 
        isMinimized ? {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'transparent',
          zIndex: 9999,
          elevation: 9999,
        } : 
        styles.normalContainer
      ]}
      pointerEvents={isMinimized ? "box-none" : "auto"}
    >
      <View 
        style={isMinimized ? styles.miniContainer : styles.videoWrapper}
        {...player.panResponder.panHandlers}
      >
        <Video
          ref={player.videoRef}
          source={{
            uri: video.mediaUrl,
            type: getMimeType(video.mediaUrl, video.format),
            metadata: {
              title: video.title,
              artist: video.artist || 'MediaApp',
              imageUri: video.thumbnailUrl,
            },
          }}
          style={styles.video}
          paused={player.paused || !player.isConnected || player.hasError}
          rate={player.playbackRate}
          resizeMode={isMinimized ? "cover" : "contain"}
          useTextureView={true}
          bufferConfig={player.bufferConfig}
          playInBackground={true}
          playWhenInactive={true}
          pictureInPicture={player.isPip}
          enterPictureInPictureOnLeave={true}
          ignoreSilentSwitch="ignore"
          mixWithOthers="mix"
          showNotificationControls={true}
          onProgress={player.onProgress}
          onLoad={player.onVideoLoad}
          onError={player.onVideoError}
          onBuffer={({ isBuffering }) => player.setIsBuffering(isBuffering)}
          onEnd={onNext}
          onPictureInPictureStatusChanged={player.onPictureInPictureStatusChanged}
        />

        {isMinimized ? (
          <MiniPlayerView 
            player={player}
            onExpand={onExpand}
            onClose={onClose}
            onPrevious={onPrevious}
            onNext={onNext}
            iconOpacity={iconOpacity}
          />
        ) : player.isFullscreen ? (
          <FullscreenPlayerView 
            player={player}
            video={video}
            onNext={onNext}
            onPrevious={onPrevious}
            iconOpacity={iconOpacity}
            width={width}
            height={height}
          />
        ) : (
          <NormalPlayerView 
            player={player}
            video={video}
            onNext={onNext}
            onPrevious={onPrevious}
            onMinimize={onMinimize}
            iconOpacity={iconOpacity}
          />
        )}
      </View>
    </View>
  );
}
