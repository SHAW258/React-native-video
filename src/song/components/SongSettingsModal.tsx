import React from 'react';
import {Modal, Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {songStyles as styles} from './SongPlayerStyles';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function SongSettingsModal({
  visible,
  onClose,
  showSpeedMenu,
  setShowSpeedMenu,
  playbackRate,
  setPlaybackRate,
}: any) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.settingsContent}>
          <SafeAreaView edges={['bottom']}>
            {!showSpeedMenu ? (
              <>
                <View style={styles.settingsHeader}>
                  <Text style={styles.settingsHeaderText}>Song Settings</Text>
                </View>
                <Pressable
                  style={styles.settingsItem}
                  onPress={() => setShowSpeedMenu(true)}>
                  <View>
                    <Text style={styles.settingsText}>Playback speed</Text>
                    <Text style={styles.settingsSubText}>
                      {playbackRate === 1 ? 'Normal' : `${playbackRate}x`}
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={24} color="#fff" />
                </Pressable>
              </>
            ) : (
              <>
                <View style={styles.settingsHeader}>
                  <Pressable
                    onPress={() => setShowSpeedMenu(false)}
                    style={{padding: 5}}>
                    <Icon name="arrow-back" size={24} color="#fff" />
                  </Pressable>
                  <Text style={styles.settingsHeaderText}>Playback speed</Text>
                </View>
                <ScrollView style={{maxHeight: 350}}>
                  {SPEEDS.map(speed => (
                    <Pressable
                      key={speed}
                      style={styles.settingsItem}
                      onPress={() => {
                        setPlaybackRate(speed);
                        onClose();
                      }}>
                      <Text
                        style={[
                          styles.settingsText,
                          playbackRate === speed && {color: '#3EA6FF'},
                        ]}>
                        {speed === 1 ? 'Normal' : `${speed}x`}
                      </Text>
                      {playbackRate === speed && (
                        <Icon name="check" size={24} color="#3EA6FF" />
                      )}
                    </Pressable>
                  ))}
                </ScrollView>
              </>
            )}
          </SafeAreaView>
        </View>
      </Pressable>
    </Modal>
  );
}
