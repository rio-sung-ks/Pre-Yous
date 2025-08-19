import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import FlashAutoIcon from '../../assets/svg/flash-auto.svg';
import FlashOnIcon from '../../assets/svg/flash-on.svg';
import FlashOffIcon from '../../assets/svg/flash-off.svg';
import FlipCameraIcon from '../../assets/svg/switch-camera.svg';
import { useCameraDevice } from 'react-native-vision-camera';
import { useCameraStore } from '../../store/useCameraStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const H_PADDING = SCREEN_WIDTH * 0.08;
const V_PADDING = SCREEN_HEIGHT * 0.02;
const WRAPPER_W = SCREEN_WIDTH * 0.14;
const WRAPPER_H = SCREEN_WIDTH * 0.14;
const ICON_SIZE = SCREEN_WIDTH * 0.1;

export default function CameraHeader({ flash, onToggleFlash }) {
  const backCamera = useCameraDevice('back');
  const frontCamera = useCameraDevice('front');
  const chosenDevice = useCameraStore((state) => state.chosenDevice);
  const setChosenDevice = useCameraStore((state) => state.setChosenDevice);

  const onToggleCamera = () => {
    setChosenDevice(
      chosenDevice.position === 'back' ? frontCamera : backCamera,
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={onToggleFlash}
        style={styles.iconPosition}
      >
        {flash === 'auto' && (
          <FlashAutoIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
          />
        )}
        {flash === 'on' && (
          <FlashOnIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
          />
        )}
        {flash === 'off' && (
          <FlashOffIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onToggleCamera}
        style={styles.iconPosition}
      >
        <FlipCameraIcon
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
    width: WRAPPER_W,
    height: WRAPPER_H,
    borderRadius: WRAPPER_W / 2,
    backgroundColor: '#f0f0f0ff',
    // backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
