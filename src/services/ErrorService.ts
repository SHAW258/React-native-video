import { ToastAndroid } from 'react-native';

/**
 * Categorizes and displays user-friendly toast messages based on the specific
 * error received from the video playback engine.
 * Differentiates clearly between Network and Format issues.
 */
export const handleMediaError = (error: any) => {
  console.error('Centralized Media Error:', error);

  // Extract error details
  const description = error?.error?.description || '';
  const extra = error?.error?.extra;
  const what = error?.error?.what;

  // 1. FORMAT ERROR (Codec, Unsupported, Corrupt)
  if (
    description.includes('format') || 
    description.includes('codec') || 
    description.includes('unsupported') ||
    description.includes('decode') ||
    extra === -1010 || // MEDIA_ERROR_UNSUPPORTED
    what === -1010 ||
    extra === -1007 || // MEDIA_ERROR_MALFORMED
    what === -1007
  ) {
    ToastAndroid.showWithGravityAndOffset(
      "❌ FORMAT ERROR: This video type or codec is not supported on your device.",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      0,
      100
    );
    return 'format_error';
  } 
  
  // 2. NETWORK ERROR (IO, Timeout, DNS)
  if (
    description.includes('network') || 
    description.includes('Connection') ||
    description.includes('source') ||
    description.includes('http') ||
    extra === -1004 || // MEDIA_ERROR_IO
    what === -1004 ||
    extra === -110 ||  // MEDIA_ERROR_TIMED_OUT
    what === -110
  ) {
    ToastAndroid.showWithGravityAndOffset(
      "🌐 NETWORK ERROR: Unstable connection or video source is unreachable.",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      0,
      100
    );
    return 'network_error';
  }

  // 3. GENERAL FALLBACK
  ToastAndroid.showWithGravity(
    "⚠️ PLAYBACK ERROR: An unexpected issue occurred while playing this video.",
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM
  );
  
  return 'general_error';
};

/**
 * Handles API/Fetch errors specifically
 */
export const handleApiError = (error: any) => {
    console.error('API Error:', error);
    ToastAndroid.show("☁️ SERVER ERROR: Unable to load video list.", ToastAndroid.SHORT);
};
