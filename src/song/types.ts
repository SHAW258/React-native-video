export interface SongItem {
  id: string | number;
  title: string;
  description?: string;
  mediaType?: string;
  format?: string;
  category?: string;
  duration?: string;
  thumbnailUrl: string;
  mediaUrl: string;
  artist?: string;
  views?: number;
  likes?: number;
  isPremium?: boolean;
  createdAt?: string;
}
