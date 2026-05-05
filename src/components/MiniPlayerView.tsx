import React from 'react';
import { View, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { playerStyles as styles } from './VideoPlayerStyles';

export const MiniPlayerView = ({ 
  player, 
  onExpand, 
  onClose, 
  onPrevious, 
  onNext, 
  iconOpacity 
}: any) => (
  <View style={styles.miniContentInner}>
    {/* Tapping mini-player expands it */}
    <Pressable onPress={onExpand} style={StyleSheet.absoluteFill} />
    
    {/* Centered Controls Overlay */}
    <View style={styles.miniControlsOverlay} pointerEvents="box-none">
      <Pressable onPress={(e) => { e.stopPropagation(); onPrevious(); }} style={styles.miniIconButton}>
        <Icon name="skip-previous" size={24} color="#fff" style={{opacity: iconOpacity}} />
      </Pressable>

      <View style={{ justifyContent: 'center', alignItems: 'center' }} pointerEvents="box-none">
          {(player.loading || player.isBuffering) && (
              <ActivityIndicator size="small" color="#fff" style={{ position: 'absolute' }} />
          )}
          <Pressable onPress={(e) => { e.stopPropagation(); player.setPaused(!player.paused); }} style={styles.miniIconButton}>
              <Icon name={player.paused ? 'play-arrow' : 'pause'} size={32} color="#fff" style={{opacity: iconOpacity}} />
          </Pressable>
      </View>

      <Pressable onPress={(e) => { e.stopPropagation(); onNext(); }} style={styles.miniIconButton}>
        <Icon name="skip-next" size={24} color="#fff" style={{opacity: iconOpacity}} />
      </Pressable>
    </View>

    <View style={[styles.miniProgressBar, { width: `${(player.currentTime / player.duration) * 100 || 0}%` }]} />

    {/* Close Button - Top Right */}
    <Pressable onPress={onClose} style={styles.miniCloseButton}>
      <Icon name="close" size={20} color="#fff" />
    </Pressable>
  </View>
);
