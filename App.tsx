import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  BackHandler,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from 'react-native';
import {SafeAreaProvider, SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import NavigationBar from 'react-native-system-navigation-bar';
import VideoPlayer, {VideoItem} from './src/components/VideoPlayer';
import {useApp} from './src/hooks/useApp';

function AppContent() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [isMinimized, setIsMinimized] = useState(false);

  // Layout Constants
  const BASE_HEADER_HEIGHT = 60;
  const HEADER_HEIGHT = BASE_HEADER_HEIGHT + insets.top;
  const PLAYER_HEIGHT = width * (9 / 16);

  useEffect(() => {
    Orientation.lockToPortrait();
    if (Platform.OS === 'android') {
        NavigationBar.setNavigationColor('transparent');
        NavigationBar.stickyImmersive(true);
    }
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
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

  // Handle Back Button
  useEffect(() => {
    const backAction = () => {
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
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [selected, isMinimized, isFullscreen]);

  const handlePlayVideo = (item: VideoItem) => {
    setIsMinimized(false);
    playVideo(item);
  };

  const renderItem = ({item}: {item: VideoItem}) => (
    <Pressable onPress={() => handlePlayVideo(item)} style={styles.itemContainer}>
      <Image source={{uri: item.thumbnailUrl}} style={styles.thumbnail} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.mainContainer}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        <SafeAreaView 
          style={styles.flexOne} 
          edges={isFullscreen ? [] : ['left', 'right']}
        >
            {/* 1. PERSISTENT HEADER (Always Fixed at Top) */}
            {!isFullscreen && (
              <View 
                style={[
                    styles.header, 
                    { 
                        height: HEADER_HEIGHT, 
                        paddingTop: insets.top,
                        zIndex: 2000 
                    }
                ]}
              >
                <Text style={styles.headerText}>MediaApp</Text>
              </View>
            )}

            {/* 2. CONTENT CONTAINER */}
            <View style={{ flex: 1, position: 'relative' }} pointerEvents="box-none">
                {/* VIDEO LIST */}
                {!isFullscreen && (
                <View style={[styles.content, { marginTop: HEADER_HEIGHT }]}>
                    <FlatList
                        data={videos}
                        renderItem={renderItem}
                        keyExtractor={i => String(i.id)}
                        scrollEventThrottle={16}
                        contentContainerStyle={[
                            styles.listContent,
                            // Normal mode space for top player
                            (selected && !isMinimized) && { paddingTop: PLAYER_HEIGHT },
                            // Mini mode space for bottom player
                            (selected && isMinimized) && { paddingBottom: 160 }
                        ]}
                        ListHeaderComponent={loading ? <ActivityIndicator size="large" color="#ff0000" style={{marginTop: 50}} /> : error ? <Text style={styles.errorText}>{error}</Text> : null}
                    />
                </View>
                )}

                {/* 3. THE SINGLE PERSISTENT VIDEO PLAYER */}
                {selected && (
                    <View 
                        pointerEvents="box-none"
                        style={[
                            { position: 'absolute', left: 0, right: 0, zIndex: 1000 },
                            isFullscreen ? { top: 0, bottom: 0, height: '100%', zIndex: 9999 } : 
                            isMinimized ? { top: 0, bottom: 0, height: '100%', zIndex: 9999, elevation: 9999 } : 
                            { 
                                top: HEADER_HEIGHT, 
                                height: PLAYER_HEIGHT 
                            }
                        ]}
                    >
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
  mainContainer: { flex: 1, backgroundColor: '#000' },
  flexOne: { flex: 1, backgroundColor: '#000' },
  header: { 
    justifyContent: 'center', 
    paddingHorizontal: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#222', 
    backgroundColor: '#000', 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0 
  },
  headerText: { color: '#fff', fontSize: 22, fontWeight: 'bold', letterSpacing: 0.5 },
  content: { flex: 1 },
  itemContainer: { flexDirection: 'row', padding: 10, borderBottomWidth: 0.5, borderBottomColor: '#222' },
  thumbnail: { width: 120, height: 70, marginRight: 10, borderRadius: 4, backgroundColor: '#333' },
  itemTextContainer: { flex: 1, justifyContent: 'center' },
  itemTitle: { color: '#fff', fontSize: 16, fontWeight: '500' },
  listContent: { paddingBottom: 50 },
  errorText: { color: '#ff4444', textAlign: 'center', padding: 20 },
});
