import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image, Text } from 'react-native';
import MoveToCameraIcon from '../assets/svg/cancel.svg';
import BackIcon from '../assets/svg/back.svg';
import DeletePhotoIcon from '../assets/svg/trash.svg';
import { useCameraStore } from '../store/useCameraStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const numColumns = 3;
const ICON_SIZE = SCREEN_WIDTH * 0.12;
const ICON_WRAPPER_W = SCREEN_WIDTH * 0.13;
const ICON_WRAPPER_H = SCREEN_HEIGHT * 0.06;
const FONT_SCALE_TITLE = SCREEN_WIDTH * 0.045;
const MARGIN_TOP_IMAGE = SCREEN_HEIGHT * 0.03;

export default function GalleryScreen({ visible, onClose }) {
  const [photos, setPhotos] = useState([]);
  const [selectedUri, setSelectedUri] = useState(null);
  const [isSingleView, setIsSingleView] = useState(false);

  const getLatestPhoto = useCameraStore((state) => state.getLatestPhoto);

  const bringPhotos = async () => {
    try {
      const albumPhotos = await CameraRoll.getPhotos({
        first: 100,
        assetType: 'Photos',
      });
      const images = albumPhotos.edges.map((edge) => edge.node.image);
      setPhotos(images);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await CameraRoll.deletePhotos([selectedUri]);
      Alert.alert('삭제 완료', '사진이 삭제되었습니다.');
      setSelectedUri(null);
      setIsSingleView(false);
      bringPhotos();
      await getLatestPhoto();
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  };

  useEffect(() => {
    if (visible) {
      bringPhotos();
      setIsSingleView(false);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType='slide'
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        {isSingleView ? (
          <View style={{ flex: 1 }}>
            <Image
              source={{ uri: selectedUri }}
              style={styles.oneImage}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => setIsSingleView(false)}
                style={styles.backButton}
              >
                <View style={styles.iconPosition}>
                  <BackIcon
                    width={40}
                    height={40}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.deleteButton}
              >
                <View style={styles.iconPosition}>
                  <DeletePhotoIcon
                    width={40}
                    height={40}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.title}>사진 선택</Text>
            <FlatList
              data={photos}
              numColumns={numColumns}
              keyExtractor={(item) => item.uri}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedUri(item.uri);
                    setIsSingleView(true);
                  }}
                >
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.image}
                  />
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </SafeAreaView>

      {!isSingleView && (
        <SafeAreaView>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
          >
            <View style={styles.iconPosition}>
              <MoveToCameraIcon
                width={50}
                height={50}
              />
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  image: {
    width: SCREEN_WIDTH / numColumns,
    height: SCREEN_WIDTH / numColumns,
    margin: 2,
  },
  oneImage: {
    flex: 1,
    resizeMode: 'contain',
    backgroundColor: 'black',
    marginTop: MARGIN_TOP_IMAGE,
  },
  title: {
    fontSize: FONT_SCALE_TITLE,
    textAlign: 'center',
    padding: SCREEN_HEIGHT * 0.015,
    padding: 20,
    padding: SCREEN_WIDTH * 0.045,
  },
  closeBtn: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: SCREEN_HEIGHT * 0.015,
  },
  backButton: {
    padding: SCREEN_WIDTH * 0.045,
    backgroundColor: 'white',
    alignItems: 'flex-start',
  },
  deleteButton: {
    backgroundColor: 'white',
    padding: SCREEN_WIDTH * 0.045,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginHorizontal: SCREEN_WIDTH * 0.015,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SCREEN_WIDTH * 0.045,
    paddingVertical: SCREEN_HEIGHT * 0.015,
  },
  iconPosition: {
    width: ICON_WRAPPER_W,
    height: ICON_WRAPPER_H,
    backgroundColor: '#f0f0f0',
    borderRadius: ICON_WRAPPER_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
