import {useEffect, useMemo, useState} from 'react';
import type {SongItem} from '../types';

const SONG_API_URL = 'https://media-api-kotlin.onrender.com/song';

function normalizeSongs(payload: unknown): SongItem[] {
  if (Array.isArray(payload)) {
    return payload as SongItem[];
  }

  if (payload && typeof payload === 'object') {
    const data = (payload as {data?: unknown; songs?: unknown}).data;
    const songs = (payload as {songs?: unknown}).songs;

    if (Array.isArray(data)) {
      return data as SongItem[];
    }

    if (Array.isArray(songs)) {
      return songs as SongItem[];
    }
  }

  return [];
}

export function useSongApp() {
  const [songs, setSongs] = useState<SongItem[]>([]);
  const [selected, setSelected] = useState<SongItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError(null);

    fetch(SONG_API_URL)
      .then(async response => {
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        return response.json();
      })
      .then(payload => {
        if (!isMounted) {
          return;
        }

        setSongs(normalizeSongs(payload));
      })
      .catch(fetchError => {
        console.error('Song fetch error:', fetchError);
        if (isMounted) {
          setError('Failed to load songs. Please check your connection.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const currentIndex = useMemo(
    () => songs.findIndex(song => song.id === selected?.id),
    [selected?.id, songs],
  );

  const playSong = (item: SongItem) => {
    setSelected(item);
  };

  const playNext = () => {
    if (!songs.length) {
      return;
    }

    setSelected(songs[currentIndex >= songs.length - 1 ? 0 : currentIndex + 1]);
  };

  const playPrevious = () => {
    if (!songs.length) {
      return;
    }

    setSelected(songs[currentIndex <= 0 ? songs.length - 1 : currentIndex - 1]);
  };

  return {
    songs,
    selected,
    setSelected,
    playSong,
    playNext,
    playPrevious,
    loading,
    error,
  };
}
