import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import ShotButtonIcon from '../../assets/svg/ShotBtn.svg';
import StickerIcon from '../../assets/svg/smile.svg';
import GalleryIcon from '../../assets/svg/gallery.svg';
import { useCameraStore } from '../../store/useCameraStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const H_PADDING = SCREEN_WIDTH * 0.09;
const V_PADDING = SCREEN_HEIGHT * 0.045;
const ICON_WRAPPER_W = SCREEN_WIDTH * 0.14;
const ICON_WRAPPER_H = SCREEN_HEIGHT * 0.065;
const ICON_SIZE = SCREEN_WIDTH * 0.12;
const CAPTURE_OUTER_D = SCREEN_WIDTH * 0.17;
const CAPTURE_INNER_D = SCREEN_WIDTH * 0.175;

export default function CameraActionBar({
  onTakePhoto,
  openGallery,
  onStickerPress,
}) {
  const thumbnailUri = useCameraStore((state) => state.thumbnailUri);
  function openStickerBook() {
    onStickerPress();
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={openGallery}
        style={[
          styles.iconPosition,
          thumbnailUri && { backgroundColor: 'transparent' },
        ]}
      >
        {thumbnailUri === undefined ? null : thumbnailUri ? (
          <Image
            source={{ uri: thumbnailUri }}
            style={styles.icon}
          />
        ) : (
          <GalleryIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onTakePhoto}
        style={styles.captureBtnPressed}
      >
        <ShotButtonIcon
          width={CAPTURE_INNER_D}
          height={CAPTURE_INNER_D}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={openStickerBook}
        style={styles.iconPosition}
      >
        <StickerIcon
          width={ICON_SIZE}
          height={ICON_SIZE}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: H_PADDING,
    paddingVertical: V_PADDING,
    backgroundColor: 'transparent',
  },
  iconPosition: {
    width: ICON_WRAPPER_W,
    height: ICON_WRAPPER_H,
    borderRadius: ICON_WRAPPER_W / 2,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  captureOuter: {
    width: CAPTURE_OUTER_D,
    height: CAPTURE_OUTER_D,
    borderRadius: CAPTURE_OUTER_D / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
});
