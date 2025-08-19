import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  Image,
  Animated,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Switch,
  ActivityIndicator,
} from 'react-native';

import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { WebView } from 'react-native-webview';
import CameraActionBar from '../components/CameraActionBar/CameraActionBar';
import { useCameraStore } from '../store/useCameraStore';
import { handleTakePhoto } from '../utils/camera/takePhoto';
import { transparentProcessorHTML } from '../utils/overlay/transparentProcessor';
import CameraToolBar from '../components/CameraToolBar/CameraToolBar';
import GalleryScreen from './GalleryScreen';
import DraggableSticker from '../components/sticker/DraggableSticker';
import * as Svg from '../assets/svg';
// import { usePhotoPermission } from '../hooks/usePermissions';
import { binaryImageProcessor } from '../utils/overlay/binaryImageProcessor';
import OverlaySwitch from '../components/overlay/overlaySwitch';
import CustomOpacitySlider from '../components/sticker/OpacitySlider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const RESET_ICON = SCREEN_WIDTH * 0.07;
const RESET_PAD_H = SCREEN_WIDTH * 0.05;
const RESET_PAD_V = SCREEN_HEIGHT * 0.04;
const STICKER_W = SCREEN_WIDTH * 0.18;
const STICKER_H = SCREEN_HEIGHT * 0.065;

export default function CameraPreview() {
  const [flash, setFlash] = useState('auto');
  const [processedUri, setProcessedUri] = useState(null);
  const [transparentOverlay, setTransparentOverlay] = useState(null);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const cameraRef = useRef(null);
  const webViewRef = useRef(null);
  const bottomSheetHeight = useRef(new Animated.Value(0)).current;

  const placedStickers = useCameraStore((state) => state.placedStickers);
  const setPlacedStickers = useCameraStore((state) => state.setPlacedStickers);
  const showSlider = useCameraStore((state) => state.showSlider);
  const setShowSlider = useCameraStore((state) => state.setShowSlider);
  const chosenDevice = useCameraStore((state) => state.chosenDevice);
  const setChosenDevice = useCameraStore((state) => state.setChosenDevice);
  const isRequesting = useCameraStore((state) => state.isRequesting);
  const setIsRequesting = useCameraStore((state) => state.setIsRequesting);
  const setThumbnailUri = useCameraStore((state) => state.setThumbnailUri);
  const getLatestPhoto = useCameraStore((state) => state.getLatestPhoto);
  const { isOverlaySwitchOn } = useCameraStore.getState();
  const photoPermissionStatus = useCameraStore(
    (state) => state.photoPermissionStatus,
  );
  const requestGalleryPermissions = useCameraStore(
    (state) => state.requestGalleryPermissions,
  );
  const openAppSettings = useCameraStore((state) => state.openAppSettings);
  const refresh = useCameraStore((state) => state.refresh);

  const backCamera = useCameraDevice('back');
  const frontCamera = useCameraDevice('front');
  // const { photoPermissionStatus, requestGalleryPermissions, openAppSettings } =
  //   usePhotoPermission();
  const cameraPermission = useCameraStore((state) => state.cameraPermission);
  const setCameraPermission = useCameraStore(
    (state) => state.setCameraPermission,
  );
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const initialCameraMode = backCamera || frontCamera;
  const stickerList = [
    <Image
      source={require('../assets/images/m1.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Image
      source={require('../assets/images/m2.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Image
      source={require('../assets/images/m3.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Image
      source={require('../assets/images/m4.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Image
      source={require('../assets/images/m5.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Image
      source={require('../assets/images/m6.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Image
      source={require('../assets/images/m7.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Image
      source={require('../assets/images/m8.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Image
      source={require('../assets/images/m9.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Image
      source={require('../assets/images/m9.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Image
      source={require('../assets/images/m10.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Image
      source={require('../assets/images/m11.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Image
      source={require('../assets/images/m12.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Image
      source={require('../assets/images/m13.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Image
      source={require('../assets/images/m14.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Image
      source={require('../assets/images/m15.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Image
      source={require('../assets/images/m16.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Image
      source={require('../assets/images/m17.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Image
      source={require('../assets/images/m18.png')}
      style={{ width: 100, height: 100 }}
      resizeMode='contain'
    />,
    <Svg.Vector1
      width={STICKER_W}
      height={STICKER_H}
    />,
    <Svg.Vector2
      width={STICKER_W}
      height={STICKER_H}
    />,
    <Svg.Vector3
      width={STICKER_W}
      height={STICKER_H}
    />,
    <Svg.Vector4
      width={STICKER_W}
      height={STICKER_H}
    />,
    <Svg.Vector5
      width={STICKER_W}
      height={STICKER_H}
    />,
    <Svg.Vector6
      width={STICKER_W}
      height={STICKER_H}
    />,
    <Svg.Vector7
      width={STICKER_W}
      height={STICKER_H}
    />,
    <Svg.Vector8
      width={STICKER_W}
      height={STICKER_H}
    />,
    <Svg.Vector9
      width={STICKER_W}
      height={STICKER_H}
    />,
    <Svg.Vector10
      width={STICKER_W}
      height={STICKER_H}
    />,
    <Svg.Vector11
      width={STICKER_W}
      height={STICKER_H}
    />,
    <Svg.Vector12
      width={STICKER_W}
      height={STICKER_H}
    />,
    <Svg.Vector13
      width={STICKER_W}
      height={STICKER_H}
    />,
    <Svg.Vector14
      width={STICKER_W}
      height={STICKER_H}
    />,
    <Svg.Vector15
      width={STICKER_W}
      height={STICKER_H}
    />,
    <Svg.Vector16
      width={STICKER_W}
      height={STICKER_H}
    />,
    <Svg.Vector17
      width={STICKER_W}
      height={STICKER_H}
    />,
    <Svg.Vector18
      width={STICKER_W}
      height={STICKER_H}
    />,
    <Svg.Vector19
      width={STICKER_W}
      height={STICKER_H}
    />,
  ];

  useEffect(() => {
    if (initialCameraMode) {
      setChosenDevice(initialCameraMode);
    }
  }, [initialCameraMode, setChosenDevice]);

  useEffect(() => {
    (async () => {
      let camStatus = await Camera.getCameraPermissionStatus();

      if (typeof camStatus === 'undefined') {
        camStatus = 'not-determined';
      }
      setCameraPermission(camStatus);
      await getLatestPhoto();
    })();
  }, []);

  useEffect(() => {
    if (
      photoPermissionStatus === 'granted' ||
      photoPermissionStatus === 'limited'
    ) {
      getLatestPhoto();
    } else if (
      photoPermissionStatus === 'denied' ||
      photoPermissionStatus === 'blocked'
    ) {
      setThumbnailUri(null);
    }
  }, [photoPermissionStatus, getLatestPhoto, setThumbnailUri]);

  async function requestPermissions() {
    setIsRequesting(true);
    const newCamStatus = await Camera.requestCameraPermission();
    setCameraPermission(newCamStatus);
    setIsRequesting(false);
  }
  const openStickerSheet = () => {
    setIsBottomSheetVisible(true);
    Animated.timing(bottomSheetHeight, {
      toValue: SCREEN_HEIGHT * 0.4,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeBottomSheet = () => {
    Animated.timing(bottomSheetHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsBottomSheetVisible(false);
    });
  };

  const handleStickerSelect = (sticker) => {
    const newSticker = {
      id: Date.now() + Math.random(),
      emoji: sticker,
      source: sticker,
      width: 200,
      height: 200,
    };
    setPlacedStickers([...placedStickers, newSticker]);
    setShowSlider(true);
    closeBottomSheet();
  };

  const renderBottomSheet = () => (
    <Modal
      visible={isBottomSheetVisible}
      transparent={true}
      animationType='none'
    >
      <TouchableOpacity
        style={bottomSheetStyles.modalOverlay}
        activeOpacity={1}
        onPress={closeBottomSheet}
      >
        <Animated.View
          style={[
            bottomSheetStyles.bottomSheet,
            {
              height: bottomSheetHeight,
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={bottomSheetStyles.handle} />
            <Text style={bottomSheetStyles.title}>스티커 선택</Text>
            <ScrollView
              style={bottomSheetStyles.scrollView}
              showsVerticalScrollIndicator={true}
            >
              <View style={bottomSheetStyles.stickerGrid}>
                {stickerList.map((sticker, index) => (
                  <TouchableOpacity
                    key={index}
                    style={bottomSheetStyles.stickerItem}
                    onPress={() => handleStickerSelect(sticker)}
                  >
                    <Text style={bottomSheetStyles.stickerText}>{sticker}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );

  useEffect(() => {
    if (cameraPermission === 'denied') {
      Alert.alert(
        '권한이 필요합니다',
        '카메라/마이크 권한이 꺼져 있어 기능을 사용할 수 없습니다. 설정에서 권한을 허용해주세요.',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '설정으로 이동',
            onPress: () => {
              Linking.openURL('app-settings:');
            },
          },
        ],
      );
    }
  }, [cameraPermission]);

  if (cameraPermission === null || cameraPermission === 'not-determined') {
    return (
      <View style={styles.centerPosition}>
        <Text style={styles.titleText}>카메라 · 마이크 권한이 필요합니다.</Text>
        <Button
          title={
            isRequesting ? '권한 요청 중입니다...' : '카메라·마이크 권한 요청'
          }
          onPress={requestPermissions}
          disabled={isRequesting}
        />
      </View>
    );
  } else if (
    cameraPermission === 'denied' ||
    cameraPermission === 'restricted'
  ) {
    return (
      <View style={styles.centerPosition}>
        <Text style={styles.titleText}>설정에서 권한을 허용해주세요.</Text>
        <Button
          title='설정 열기'
          onPress={() => Linking.openURL('app-settings:')}
        />
      </View>
    );
  }

  async function onTakePhoto() {
    try {
      const photoPath = await handleTakePhoto(cameraRef, flash);
      if (isOverlaySwitchOn) {
        const edgeBase64 = await binaryImageProcessor(photoPath);
        setProcessedUri(`data:image/png;base64,${edgeBase64}`);
        setTimeout(() => {
          if (webViewRef.current) {
            webViewRef.current.postMessage(edgeBase64);
          } else {
          }
        }, 100);
      }
    } catch (err) {}
  }

  const onWebViewMessage = (event) => {
    const transparentImage = event.nativeEvent.data;
    setTransparentOverlay(transparentImage);
  };

  const resetPhoto = () => {
    setProcessedUri(null);
    setTransparentOverlay(null);
    setPlacedStickers([]);
    setShowSlider(false);
  };

  const onToggleFlash = () => {
    setFlash((prev) =>
      prev === 'auto' ? 'on' : prev === 'on' ? 'off' : 'auto',
    );
  };

  const openGallery = async () => {
    if (
      photoPermissionStatus === 'granted' ||
      photoPermissionStatus === 'limited'
    ) {
      setIsGalleryVisible(true);
    } else if (
      photoPermissionStatus === 'denied' ||
      photoPermissionStatus === 'blocked'
    ) {
      Alert.alert('사진 접근 권한이 필요합니다', '설정에서 허용해주세요', [
        { text: '취소', style: 'cancel' },
        { text: '설정 열기', onPress: openAppSettings },
      ]);
    } else {
      const requestResult = await requestGalleryPermissions();
      if (requestResult === 'granted' || requestResult === 'limited')
        setIsGalleryVisible(true);
      else if (requestResult === 'denied' || requestResult === 'blocked') {
        Alert.alert('사진 접근 권한이 필요합니다', '설정에서 허용해주세요', [
          { text: '취소', style: 'cancel' },
          { text: '설정 열기', onPress: openAppSettings },
        ]);
      }
    }
  };
  const closeGallery = () => setIsGalleryVisible(false);

  const isFront = chosenDevice.position === 'front';

  return (
    <View style={styles.container}>
      <View style={styles.headerPosition}>
        <CameraToolBar
          flash={flash}
          onToggleFlash={onToggleFlash}
        />
      </View>

      <View style={styles.bodyPosition}>
        <OverlaySwitch />
        {showSlider && <CustomOpacitySlider />}
        <Camera
          ref={cameraRef}
          device={chosenDevice}
          isActive={true}
          style={styles.cameraPosition}
          photo={true}
          video={false}
          audio={false}
        />
        {placedStickers.map((sticker, index) => (
          <DraggableSticker
            key={index}
            emoji={sticker.emoji}
            id={sticker.id}
          />
        ))}
        {processedUri && !transparentOverlay && (
          <WebView
            ref={webViewRef}
            source={{ html: transparentProcessorHTML }}
            onMessage={onWebViewMessage}
            style={{
              width: 1,
              height: 1,
              position: 'absolute',
            }}
            javaScriptEnabled
            onLoad={() => {
              const base64Only = processedUri.split(',')[1];
              webViewRef.current.postMessage(base64Only);
            }}
          />
        )}
        {processedUri && !transparentOverlay && (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator
              size='large'
              color='#71dc84'
            />
          </View>
        )}
        {transparentOverlay && (
          <Image
            source={{ uri: transparentOverlay }}
            resizeMode='cover'
            style={[
              styles.cameraPosition,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0.3,
                backgroundColor: 'transparent',
                transform: isFront ? [{ scaleX: -1 }] : [],
              },
            ]}
          />
        )}
        {transparentOverlay && (
          <View style={styles.resetButtonContainer}>
            <Svg.ResetOverlay
              width={RESET_ICON}
              height={RESET_ICON}
              onPress={resetPhoto}
            />
          </View>
        )}
      </View>
      <View style={styles.bottomPosition}>
        <CameraActionBar
          onTakePhoto={onTakePhoto}
          openGallery={openGallery}
          onStickerPress={openStickerSheet}
        />
        <GalleryScreen
          visible={isGalleryVisible}
          onClose={closeGallery}
        />
        {renderBottomSheet()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerPosition: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },
  cameraPosition: {
    width: SCREEN_WIDTH,
    aspectRatio: 3 / 4,
    overflow: 'hidden',
  },
  titleText: {
    fontSize: SCREEN_WIDTH * 0.045,
    marginBottom: 12,
    textAlign: 'center',
    color: 'black',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.045 * 0.9,
  },
  resetButtonContainer: {
    position: 'absolute',
    bottom: '84%',
    right: 0,
    paddingHorizontal: RESET_PAD_H,
    paddingVertical: RESET_PAD_V,
  },
  centerStickerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    zIndex: 1,
  },
  stickerText: {
    fontSize: 60,
  },
  headerPosition: {
    flex: 1.2,
    backgroundColor: 'white',
  },
  bodyPosition: {
    flex: 7,
    alignItems: 'center',
  },
  bottomPosition: {
    flex: 1.8,
    backgroundColor: 'white',
  },
});
const bottomSheetStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handle: {
    SCREEN_WIDTH: 40,
    SCREEN_HEIGHT: 4,
    backgroundColor: '#DDDDDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  stickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  stickerItem: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stickerText: {
    fontSize: 36,
  },
});
