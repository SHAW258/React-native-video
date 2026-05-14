import {useState, useEffect, useMemo} from 'react';
import type {VideoItem} from '../components/VideoPlayer';

// Render URL: https://media-api-kotlin.onrender.com/videos
const API_URL = 'https://media-api-kotlin.onrender.com/videos';

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
    
    fetch(API_URL)
      .then(async r => {
        if (!r.ok) {
          throw new Error(`Server responded with ${r.status}`);
        }
        const data = await r.json();
        if (isMounted) {
            // Support both direct array and {data: []} format
            setVideos(Array.isArray(data) ? data : (data.data || []));
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        if (isMounted) {
            setError('Failed to load videos. Please check your connection.');
        }
      })
      .finally(() => {
        if (isMounted) {
            setLoading(false);
        }
      });
      
    return () => { isMounted = false; };
  }, []);

  const currentIndex = useMemo(() => 
    videos.findIndex(v => v.id === selected?.id),
    [videos, selected?.id]
  );

  const playVideo = (item: VideoItem) => {
    setSelected(item);
  };

  const playNext = () => {
    if (videos.length === 0) return;
    if (currentIndex < videos.length - 1) {
      setSelected(videos[currentIndex + 1]);
    } else {
      setSelected(videos[0]);
    }
  };

  const playPrevious = () => {
    if (videos.length === 0) return;
    if (currentIndex > 0) {
      setSelected(videos[currentIndex - 1]);
    } else {
      setSelected(videos[videos.length - 1]);
    }
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
