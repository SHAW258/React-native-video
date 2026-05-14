import {StyleSheet} from 'react-native';

const absoluteFill = {
  position: 'absolute' as const,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const songStyles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  normalContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  artwork: {
    ...absoluteFill,
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  overlay: {
    ...absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
  },
  
  // Reuse/Mirror Video Player Style Names
  controlsOverlay: {
    ...absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  
  // Mini Player (PiP Style)
  miniContainer: {
    position: 'absolute',
    bottom: 30,
    right: 15,
    width: 220,
    aspectRatio: 16 / 9,
    backgroundColor: '#181818',
    borderRadius: 14,
    overflow: 'hidden',
    zIndex: 10000,
    elevation: 20,
    borderWidth: 1.5,
    borderColor: '#333',
  },
  miniContentInner: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  miniArtwork: {
    ...absoluteFill,
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  miniControlsOverlay: {
    ...absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
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
  miniInfo: {
      position: 'absolute',
      bottom: 8,
      left: 10,
      right: 40,
  },
  miniTitle: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '700',
  },

  // Modal & Settings
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
  
  // Compatibility with VideoPlayerStyles names if needed
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
  playButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
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
});
