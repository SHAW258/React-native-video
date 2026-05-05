import { StyleSheet } from 'react-native';

const absoluteFill = {
  position: 'absolute' as const,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const playerStyles = StyleSheet.create({
  // Main Container Styles
  container: {
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  normalContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  
  // FLOATING IN-APP PiP STYLES (Properly Sized & Centered)
  miniContainer: {
    position: 'absolute',
    bottom: 30,
    right: 15,
    width: 220, // Set to a clear, large width for tap space
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 14,
    overflow: 'hidden',
    zIndex: 10000,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    borderWidth: 1.5,
    borderColor: '#333',
  },
  miniContentInner: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  miniControlsOverlay: {
    ...absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Perfect horizontal centering
    gap: 20, // Professional spacing
  },
  miniIconButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniCloseButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 18,
    padding: 4,
  },
  miniProgressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    backgroundColor: '#FF0000',
  },

  // Overlays & General UI
  centerOverlay: {
    ...absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineText: {
    color: '#fff',
    marginTop: 15,
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
    zIndex: 10,
  },

  // Top Bar Styles
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  topBarLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topIconButton: {
    padding: 10,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },

  // Center Control Styles
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50,
    flex: 1,
  },
  iconButton: {
    padding: 15,
  },
  playButtonWrapper: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  spinner: {
    position: 'absolute',
  },
  playButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },

  // Bottom Bar Styles
  bottomBar: {
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 44,
    marginHorizontal: 5,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    minWidth: 40,
    textAlign: 'center',
  },
  fullscreenButton: {
    padding: 5,
    marginLeft: 5,
  },

  // Skip Animation Styles
  skipOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 1,
  },
  skipCircle: {
    alignItems: 'center',
  },
  skipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },

  // Modal & Settings Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  settingsContent: {
    backgroundColor: '#282828',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  settingsHeader: {
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#444',
  },
  settingsHeaderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingHorizontal: 20,
  },
  settingsTextContent: {
    marginLeft: 15,
  },
  settingsText: {
    color: '#fff',
    fontSize: 16,
  },
  settingsSubText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#444',
  },
  menuTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 15,
  },
  speedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingHorizontal: 25,
  },
  speedText: {
    color: '#fff',
    fontSize: 16,
  },
});
