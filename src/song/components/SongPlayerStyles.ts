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
    backgroundColor: '#101010',
    overflow: 'hidden',
  },
  normalContainer: {
    minHeight: 270,
    backgroundColor: '#151515',
  },
  artwork: {
    ...absoluteFill,
    width: '100%',
    height: '100%',
    opacity: 0.42,
  },
  artworkFocused: {
    width: 96,
    height: 96,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  overlay: {
    ...absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.48)',
    padding: 14,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleGroup: {
    flex: 1,
  },
  category: {
    color: '#3EA6FF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 3,
  },
  artist: {
    color: '#d6d6d6',
    fontSize: 13,
    marginTop: 2,
  },
  iconButton: {
    padding: 10,
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 36,
  },
  playButton: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  bottom: {
    gap: 6,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 42,
    marginHorizontal: 6,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    minWidth: 40,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    color: '#e7e7e7',
    fontSize: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  description: {
    color: '#ddd',
    fontSize: 13,
    lineHeight: 18,
  },
  miniContainer: {
    position: 'absolute',
    bottom: 30,
    right: 15,
    width: 250,
    height: 82,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#181818',
    zIndex: 10000,
    elevation: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  miniInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 8,
  },
  miniArtwork: {
    width: 54,
    height: 54,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  miniText: {
    flex: 1,
  },
  miniTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  miniArtist: {
    color: '#aaa',
    fontSize: 11,
    marginTop: 2,
  },
  miniProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    backgroundColor: '#3EA6FF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
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
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 22,
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
});
