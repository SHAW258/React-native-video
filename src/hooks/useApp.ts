import {useEffect, useMemo, useState} from 'react';
import {VideoItem} from '../components/VideoPlayer';

const VIDEO_API_URL = 'https://media-api-kotlin.onrender.com/video';

function normalizeVideos(payload: unknown): VideoItem[] {
  if (Array.isArray(payload)) {
    return payload as VideoItem[];
  }

  if (payload && typeof payload === 'object') {
    const data = (payload as {data?: unknown; videos?: unknown}).data;
    const videos = (payload as {videos?: unknown}).videos;

    if (Array.isArray(data)) {
      return data as VideoItem[];
    }

    if (Array.isArray(videos)) {
      return videos as VideoItem[];
    }
  }

  return [];
}

export function useApp() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selected, setSelected] = useState<VideoItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError(null);

    fetch(VIDEO_API_URL)
      .then(async response => {
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        return response.json();
      })
      .then(payload => {
        if (!isMounted) return;
        setVideos(normalizeVideos(payload));
      })
      .catch(fetchError => {
        console.error('Video fetch error:', fetchError);
        if (isMounted) {
          setError('Failed to load videos. Please check your connection.');
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
    () => videos.findIndex(v => v.id === selected?.id),
    [selected?.id, videos],
  );

  const playVideo = (item: VideoItem) => {
    setSelected(item);
  };

  const playNext = () => {
    if (!videos.length) return;
    const nextIndex = currentIndex >= videos.length - 1 ? 0 : currentIndex + 1;
    setSelected(videos[nextIndex]);
  };

  const playPrevious = () => {
    if (!videos.length) return;
    const prevIndex = currentIndex <= 0 ? videos.length - 1 : currentIndex - 1;
    setSelected(videos[prevIndex]);
  };

  return {
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
  };
}
