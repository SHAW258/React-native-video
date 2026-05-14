import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import NavigationBar from 'react-native-system-navigation-bar';
import VideoPlayer, {VideoItem} from './src/components/VideoPlayer';
import {useApp} from './src/hooks/useApp';
import {SongScreen} from './src/song/components/SongScreen';

type ActiveSection = 'video' | 'song';

function AppContent() {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>('video');

  const baseHeaderHeight = 76;
  const headerHeight = baseHeaderHeight + insets.top;
  const playerHeight = width * (9 / 16);

  useEffect(() => {
    Orientation.lockToPortrait();
    if (Platform.OS === 'android') {
      NavigationBar.setNavigationColor('transparent');
      NavigationBar.stickyImmersive(true);
    }
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  }, []);

  const {
    videos,
    selected,
    setSelected,
    isFullscreen,
    setIsFullscreen,
    playVideo,
    playNext,
    playPrevious,
    loading,
    error,
  } = useApp();

  useEffect(() => {
    const backAction = () => {
      if (activeSection !== 'video') {
        return false;
      }

      if (selected && !isMinimized && !isFullscreen) {
        setIsMinimized(true);
        return true;
      }

      if (isMinimized) {
        setIsMinimized(false);
        setSelected(null);
        return true;
      }

      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [activeSection, selected, isMinimized, isFullscreen, setSelected]);

  const handlePlayVideo = (item: VideoItem) => {
    setIsMinimized(false);
    playVideo(item);
  };

  const renderVideoItem = ({item}: {item: VideoItem}) => (
    <Pressable
      onPress={() => handlePlayVideo(item)}
      style={styles.itemContainer}>
      <Image source={{uri: item.thumbnailUrl}} style={styles.thumbnail} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <SafeAreaView
        style={styles.flexOne}
        edges={isFullscreen ? [] : ['left', 'right']}>
        {!isFullscreen && (
          <View
            style={[
              styles.header,
              {
                height: headerHeight,
                paddingTop: insets.top,
                zIndex: 2000,
              },
            ]}>
            <Text style={styles.headerText}>MediaApp</Text>
            <View style={styles.switcher}>
              <Pressable
                onPress={() => setActiveSection('video')}
                style={[
                  styles.switchButton,
                  activeSection === 'video' && styles.switchButtonActive,
                ]}>
                <Text
                  style={[
                    styles.switchText,
                    activeSection === 'video' && styles.switchTextActive,
                  ]}>
                  Video
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsMinimized(false);
                  setActiveSection('song');
                }}
                style={[
                  styles.switchButton,
                  activeSection === 'song' && styles.switchButtonActive,
                ]}>
                <Text
                  style={[
                    styles.switchText,
                    activeSection === 'song' && styles.switchTextActive,
                  ]}>
                  Song
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.contentLayer} pointerEvents="box-none">
          {!isFullscreen && activeSection === 'video' && (
            <View style={[styles.content, {marginTop: headerHeight}]}>
              <FlatList
                data={videos}
                renderItem={renderVideoItem}
                keyExtractor={item => String(item.id)}
                scrollEventThrottle={16}
                contentContainerStyle={[
                  styles.listContent,
                  selected && !isMinimized && {paddingTop: playerHeight},
                  selected && isMinimized && {paddingBottom: 160},
                ]}
                ListHeaderComponent={
                  loading ? (
                    <ActivityIndicator
                      size="large"
                      color="#ff0000"
                      style={styles.loader}
                    />
                  ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                  ) : null
                }
              />
            </View>
          )}

          {!isFullscreen && activeSection === 'song' && (
            <SongScreen headerHeight={headerHeight} />
          )}

          {activeSection === 'video' && selected && (
            <View
              pointerEvents="box-none"
              style={[
                styles.videoPlayerLayer,
                isFullscreen
                  ? {
                      top: 0,
                      bottom: 0,
                      height: '100%',
                      zIndex: 9999,
                    }
                  : isMinimized
                    ? {
                        top: 0,
                        bottom: 0,
                        height: '100%',
                        zIndex: 9999,
                        elevation: 9999,
                      }
                    : {
                        top: headerHeight,
                        height: playerHeight,
                      },
              ]}>
              <VideoPlayer
                video={selected}
                onNext={playNext}
                onPrevious={playPrevious}
                onFullscreenChange={setIsFullscreen}
                isMinimized={isMinimized}
                onExpand={() => setIsMinimized(false)}
                onMinimize={() => setIsMinimized(true)}
                onClose={() => {
                  setIsMinimized(false);
                  setSelected(null);
                }}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#000'},
  flexOne: {flex: 1, backgroundColor: '#000'},
  header: {
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerText: {color: '#fff', fontSize: 22, fontWeight: 'bold', letterSpacing: 0},
  switcher: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    backgroundColor: '#161616',
    borderRadius: 8,
    padding: 3,
  },
  switchButton: {
    minWidth: 64,
    alignItems: 'center',
    borderRadius: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  switchButtonActive: {
    backgroundColor: '#fff',
  },
  switchText: {
    color: '#bbb',
    fontSize: 13,
    fontWeight: '700',
  },
  switchTextActive: {
    color: '#000',
  },
  contentLayer: {flex: 1, position: 'relative'},
  content: {flex: 1},
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  thumbnail: {
    width: 120,
    height: 70,
    marginRight: 10,
    borderRadius: 4,
    backgroundColor: '#333',
  },
  itemTextContainer: {flex: 1, justifyContent: 'center'},
  itemTitle: {color: '#fff', fontSize: 16, fontWeight: '500'},
  listContent: {paddingBottom: 50},
  loader: {marginTop: 50},
  errorText: {color: '#ff4444', textAlign: 'center', padding: 20},
  videoPlayerLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});
