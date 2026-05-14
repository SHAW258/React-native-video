import React from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { playerStyles as styles } from './VideoPlayerStyles';

const SPEEDS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
const QUALITIES = ['1080p', '720p', '480p', '360p', '240p', '144p'];

export const SettingsModal = ({
  visible,
  onClose,
  showSpeedMenu,
  setShowSpeedMenu,
  showQualityMenu,
  setShowQualityMenu,
  showPreferenceMenu,
  setShowPreferenceMenu,
  playbackRate,
  setPlaybackRate,
  quality,
  setQuality,
  qualityProfile,
  setQualityProfile,
}: any) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.settingsContent}>
          <SafeAreaView edges={['bottom']}>
            {!showSpeedMenu && !showQualityMenu && !showPreferenceMenu ? (
              <>
                <View style={styles.settingsHeader}><Text style={styles.settingsHeaderText}>Settings</Text></View>
                <Pressable style={styles.settingsItem} onPress={() => setShowPreferenceMenu(true)}>        
                  <Icon name="tune" size={24} color="#fff" />
                  <View style={styles.settingsTextContent}>
                    <Text style={styles.settingsText}>Quality Preference</Text>
                    <Text style={styles.settingsSubText}>
                      {qualityProfile === 'auto' ? 'Auto' : qualityProfile === 'high' ? 'Higher picture quality' : 'Data saver'}
                    </Text>
                  </View>
                </Pressable>
                <Pressable style={styles.settingsItem} onPress={() => setShowQualityMenu(true)}>
                  <Icon name="high-quality" size={24} color="#fff" />
                  <View style={styles.settingsTextContent}>
                    <Text style={styles.settingsText}>Manual Quality</Text>
                    <Text style={styles.settingsSubText}>{quality}</Text>
                  </View>
                </Pressable>
                <Pressable style={styles.settingsItem} onPress={() => setShowSpeedMenu(true)}>
                  <Icon name="slow-motion-video" size={24} color="#fff" />
                  <View style={styles.settingsTextContent}>
                    <Text style={styles.settingsText}>Playback speed</Text>
                    <Text style={styles.settingsSubText}>{playbackRate === 1 ? 'Normal' : `${playbackRate}x`}</Text>
                  </View>
                </Pressable>
              </>
            ) : showPreferenceMenu ? (
              <>
                <View style={styles.menuHeader}>
                  <Pressable onPress={() => setShowPreferenceMenu(false)} style={{padding: 5}}><Icon name="arrow-back" size={24} color="#fff" /></Pressable>
                  <Text style={styles.menuTitle}>Quality Preference</Text>
                </View>
                <ScrollView style={{maxHeight: 350}}>
                  {[
                    {id: 'auto', label: 'Auto (Recommended)', sub: 'Adjusts for your current network speed'},
                    {id: 'high', label: 'Higher picture quality', sub: 'Uses more data'},
                    {id: 'saver', label: 'Data saver', sub: 'Lower picture quality'},
                  ].map(item => (
                    <Pressable key={item.id} style={styles.speedItem} onPress={() => { setQualityProfile(item.id as any); onClose(); }}>
                      <View style={{flex: 1}}>
                        <Text style={[styles.speedText, qualityProfile === item.id && {color: '#3EA6FF'}]}>{item.label}</Text>
                        <Text style={{color: '#aaa', fontSize: 11, marginTop: 2}}>{item.sub}</Text>        
                      </View>
                      {qualityProfile === item.id && <Icon name="check" size={24} color="#3EA6FF" />}      
                    </Pressable>
                  ))}
                </ScrollView>
              </>
            ) : showSpeedMenu ? (
              <>
                <View style={styles.menuHeader}>
                  <Pressable onPress={() => setShowSpeedMenu(false)} style={{padding: 5}}><Icon name="arrow-back" size={24} color="#fff" /></Pressable>
                  <Text style={styles.menuTitle}>Playback speed</Text>
                </View>
                <ScrollView style={{maxHeight: 350}}>
                  {SPEEDS.map(speed => (
                    <Pressable key={speed} style={styles.speedItem} onPress={() => { setPlaybackRate(speed); onClose(); }}>
                      <Text style={[styles.speedText, playbackRate === speed && {color: '#3EA6FF'}]}>{speed === 1 ? 'Normal' : `${speed}x`}</Text>
                      {playbackRate === speed && <Icon name="check" size={24} color="#3EA6FF" />}
                    </Pressable>
                  ))}
                </ScrollView>
              </>
            ) : (
              <>
                <View style={styles.menuHeader}>
                  <Pressable onPress={() => setShowQualityMenu(false)} style={{padding: 5}}><Icon name="arrow-back" size={24} color="#fff" /></Pressable>
                  <Text style={styles.menuTitle}>Quality</Text>
                </View>
                <ScrollView style={{maxHeight: 350}}>
                  <Pressable style={styles.speedItem} onPress={() => { setQuality('Auto'); onClose(); }}>  
                    <Text style={[styles.speedText, quality === 'Auto' && {color: '#3EA6FF'}]}>Auto</Text> 
                    {quality === 'Auto' && <Icon name="check" size={24} color="#3EA6FF" />}
                  </Pressable>
                  {QUALITIES.map(q => (
                    <Pressable key={q} style={styles.speedItem} onPress={() => { setQuality(q); onClose(); }}>
                      <Text style={[styles.speedText, quality === q && {color: '#3EA6FF'}]}>{q}</Text>     
                      {quality === q && <Icon name="check" size={24} color="#3EA6FF" />}
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
};
