import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSongApp} from '../hooks/useSongApp';
import type {SongItem} from '../types';
import {SongPlayer} from './SongPlayer';

interface SongScreenProps {
  headerHeight: number;
}

export function SongScreen({headerHeight}: SongScreenProps) {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [isMinimized, setIsMinimized] = useState(false);
  const playerHeight = Math.max(270, width * 0.58);

  const {
    songs,
    selected,
    setSelected,
    playSong,
    playNext,
    playPrevious,
    loading,
    error,
  } = useSongApp();

  useEffect(() => {
    const backAction = () => {
      if (selected && !isMinimized) {
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
  }, [isMinimized, selected, setSelected]);

  const handlePlaySong = (item: SongItem) => {
    setIsMinimized(false);
    playSong(item);
  };

  const renderItem = ({item}: {item: SongItem}) => (
    <Pressable onPress={() => handlePlaySong(item)} style={styles.itemContainer}>
      <Image source={{uri: item.thumbnailUrl}} style={styles.thumbnail} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.itemSubtitle} numberOfLines={1}>
          {item.artist || item.category || 'Song'}
        </Text>
        <View style={styles.metaRow}>
          {item.format ? (
            <Text style={styles.metaText}>{item.format.toUpperCase()}</Text>
          ) : null}
          {item.duration ? <Text style={styles.metaText}>{item.duration}</Text> : null}
          {typeof item.likes === 'number' ? (
            <Text style={styles.metaText}>{item.likes} likes</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.content, {marginTop: headerHeight}]}>
        <FlatList
          data={songs}
          renderItem={renderItem}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={[
            styles.listContent,
            selected && !isMinimized && {paddingTop: playerHeight},
            selected && isMinimized && {paddingBottom: 150 + insets.bottom},
          ]}
          ListHeaderComponent={
            loading ? (
              <ActivityIndicator
                size="large"
                color="#3EA6FF"
                style={styles.loader}
              />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null
          }
        />
      </View>

      {selected && (
        <View
          pointerEvents="box-none"
          style={[
            styles.playerLayer,
            isMinimized
              ? styles.miniLayer
              : {top: headerHeight, height: playerHeight},
          ]}>
          <SongPlayer
            song={selected}
            onNext={playNext}
            onPrevious={playPrevious}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 50,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  thumbnail: {
    width: 92,
    height: 92,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  itemSubtitle: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  metaText: {
    color: '#ddd',
    fontSize: 11,
    backgroundColor: '#202020',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  loader: {
    marginTop: 50,
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    padding: 20,
  },
  playerLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  miniLayer: {
    top: 0,
    bottom: 0,
    height: '100%',
    zIndex: 9999,
    elevation: 9999,
  },
});
