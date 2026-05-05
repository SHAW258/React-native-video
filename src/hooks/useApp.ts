import {useState, useEffect} from 'react';
import type {VideoItem} from '../components/VideoPlayer';

// Local dev URL: http://localhost:8080/videos
// Render URL: https://media-api-kotlin.onrender.com/videos
const API_URL = 'https://media-api-kotlin.onrender.com/videos';

export function useApp() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selected, setSelected] = useState<VideoItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(API_URL)
      .then(async r => {
        if (!r.ok) {
          throw new Error(`Server responded with ${r.status}`);
        }
        const data = await r.json();
        setVideos(data.data || []);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Failed to load videos. Please check your connection.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const currentIndex = videos.findIndex(v => v.id === selected?.id);

  const playVideo = (item: VideoItem) => {
    setSelected(item);
  };

  const playNext = () => {
    if (currentIndex < videos.length - 1) {
      setSelected(videos[currentIndex + 1]);
    } else if (videos.length > 0) {
      // Loop back to first video or just stop
      setSelected(videos[0]);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      setSelected(videos[currentIndex - 1]);
    } else if (videos.length > 0) {
      // Loop to last video
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