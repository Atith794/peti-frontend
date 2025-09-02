import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator, PermissionsAndroid, Platform, ScrollView } from 'react-native';
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import DraggableSticker from '../screens/DraggableSticker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../services/baseUrl';
import TextPromptModal from '../services/TextPromptModal';
import EmojiPickerModal from '../services/EmojiPickerModal';
import { pick } from '@react-native-documents/picker';
import Video from 'react-native-video';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight, BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { Music, AudioLines, MapPin, Hash, AtSign, Smile, X } from 'lucide-react-native';

const EditMediaScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const viewShotRef = useRef(null);
  const insets = useSafeAreaInsets();

  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState(null);
  const [stickers, setStickers] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [location, setLocation] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); 
  const [emojiModalVisible, setEmojiModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [recordedAudioUri, setRecordedAudioUri] = useState(null);
  const [audioInfo, setAudioInfo] = useState(null);
  const tabBarHeightFromCtx = React.useContext(BottomTabBarHeightContext);
  // const tabBarHeight = useBottomTabBarHeight?.() ?? 0;
  const tabBarHeight = tabBarHeightFromCtx ?? 0;
  const BOTTOM_GUARD = insets.bottom + tabBarHeight + 16;

  const filterStyles = {
    normal: {},
    clarendon: { tintColor: 'rgba(255,255,255,0.1)' },
    gingham: { tintColor: 'rgba(247, 236, 220, 0.3)' },
    lark: { tintColor: 'rgba(255,255,200,0.2)' },
    moon: { tintColor: 'rgba(220,220,220,0.4)' },
    reyes: { tintColor: 'rgba(240, 200, 180, 0.25)' },
    valencia: { tintColor: 'rgba(255, 225, 170, 0.25)' },
    slumber: { tintColor: 'rgba(255, 240, 200, 0.2)' },
    reyes: { tintColor: 'rgba(245, 245, 245, 0.3)' },
    juno: { tintColor: 'rgba(255, 180, 150, 0.2)' },
    ludwig: { tintColor: 'rgba(255, 255, 230, 0.2)' },
  };

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const handleStickerInput = (value) => {
    if (modalType === 'location') addSticker(`📍 ${value}`);
    else if (modalType === 'hashtag') addSticker(`#${value}`);
    else if (modalType === 'mention') addSticker(`@${value}`);
  };

  useEffect(() => {
    if (route.params?.photo) {
      setMedia({
        uri: 'file://' + route.params.photo.path,
        type: 'image/jpeg',
        fileName: route.params.photo.path.split('/').pop(),
      });
    }
    if (route.params?.video) {
      const path = route.params.video.path;           // e.g. .../cache/.../xxxx.mov or xxxx.mp4
      const fileName = (path.split('/').pop() || '').toLowerCase();
      const type = fileName.endsWith('.mov') ? 'video/quicktime' : 'video/mp4';
      setMedia({
        uri: 'file://' + path,
        type,
        fileName: fileName || (type === 'video/quicktime' ? 'upload.mov' : 'upload.mp4'),
      });
    }
  }, [route?.params]);

  const addSticker = (text) => {
    setStickers([...stickers, { text, position: { x: 100, y: 100 } }]);
  };

  const updateStickerPosition = (index, newPos) => {
    const updated = [...stickers];
    updated[index].position = newPos;
    setStickers(updated);
  };

  const removeSticker = (indexToRemove) => {
    setStickers((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

const handlePost = async () => {
    if (!media) {
      Alert.alert('Missing', 'Please select an image or video');
      return;
    }

    try {
      setUploading(true);

      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();

      formData.append('caption', caption);
      formData.append('location', location);

      if (media.type?.startsWith('video/')) {
        // --- VIDEO: upload the captured file as-is ---
        const fileName = media.fileName || (media.type === 'video/quicktime' ? 'upload.mov' : 'upload.mp4');
        const fileType = media.type || (fileName.endsWith('.mov') ? 'video/quicktime' : 'video/mp4');

        formData.append('media', {
          uri: media.uri,
          name: fileName,
          type: fileType,
        });
      } else {
        // --- IMAGE: flatten the canvas with stickers/filters & upload JPEG ---
        const flattenedUri = await viewShotRef.current.capture();
        formData.append('media', {
          uri: flattenedUri,
          name: media.fileName || 'upload.jpg',
          type: 'image/jpeg',
        });
      }

      if (recordedAudioUri && audioInfo) {
        formData.append('audio', {
          uri: recordedAudioUri,
          name: audioInfo.name,
          type: audioInfo.type,
        });
      }

      await axios.post(`${BASE_URL}/api/posts/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Success', 'Post uploaded!');

      // From RootStack screen -> switch to Home tab
      navigation.dispatch(
        CommonActions.navigate({
          name: 'MainTabs',
          params: { screen: 'Home' },
          merge: true,
        })
      );
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Upload Failed', err.response?.data?.error || err.message);
    } finally {
      setUploading(false);
    }
  };  

  const pickAudioFromDevice = async () => {
    try {
    const results = await pick({
      type: ['audio/*'], 
    });

    if (results && results.length > 0) {
      const audioFile = results[0];
      setRecordedAudioUri(audioFile.uri);
      setAudioInfo({
      name: audioFile.name || 'audio.mp3',
      type: audioFile.type || 'audio/mpeg',
      });
    }
    } catch (err) {
    if (err.code === 'DOCUMENT_PICKER_CANCELED') { 
      console.log('User canceled audio picker');
    } else {
      console.error('Audio Picker Error:', err);
    }
    }
  };

  const isVideo = !!media?.type?.startsWith('video/');
    return (
    <SafeAreaView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom+65 }]}
      edges={['left', 'right', 'bottom']}   // ensures bottom safe area is respected
    >
      <View
        style={{ flex: 1, paddingBottom: BOTTOM_GUARD }}
      >
        {isVideo ? (
          <View style={styles.videoContainer}>
            <Video
              source={{ uri: media?.uri }}
              style={styles.video}
              resizeMode="contain"
              repeat
              controls
            />
          </View>
        ) : (
          <ViewShot ref={viewShotRef} style={styles.imageContainer} options={{ format: 'jpg', quality: 0.9 }}>
            <Image source={{ uri: media?.uri }} style={styles.image} resizeMode="contain" />
            {selectedFilter !== 'normal' && (
              <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: filterStyles[selectedFilter]?.tintColor }]} />
            )}
            <View style={styles.stickerOverlay}>
              {stickers.map((sticker, index) => (
                <DraggableSticker
                  key={index}
                  text={sticker.text}
                  initialPosition={sticker.position}
                  onDragEnd={(pos) => updateStickerPosition(index, pos)}
                  onDelete={() => removeSticker(index)}
                />
              ))}
            </View>
          </ViewShot>
        )}

        <TextInput
          style={styles.captionInput}
          placeholder="Add a caption or tag @username..."
          placeholderTextColor="#ccc"
          value={caption}
          onChangeText={setCaption}
        />

        {!isVideo && (
          <>
            <View style={styles.tagtextRow}>
              <Text style={styles.tagText}>Tags:</Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={() => openModal('location')}>
                <Text style={styles.tagButton}><MapPin color={'white'}/></Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openModal('hashtag')}>
                <Text style={styles.tagButton}><Hash color={'white'}/></Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openModal('mention')}>
                <Text style={styles.tagButton}><AtSign color={'white'}/></Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEmojiModalVisible(true)}>
                <Text style={styles.tagButton}><Smile color={'white'}/></Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filterRow}>
              {Object.keys(filterStyles).map((key) => (
                <TouchableOpacity key={key} onPress={() => setSelectedFilter(key)}>
                  <Text style={[styles.filterButton, selectedFilter === key && { backgroundColor: '#1da1f2' }]}>{key}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextPromptModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleStickerInput} label={`Enter ${modalType}`} />
        <EmojiPickerModal visible={emojiModalVisible} onClose={() => setEmojiModalVisible(false)} onSelect={(emoji) => addSticker(emoji)} />
        {!isVideo && (
          <TouchableOpacity onPress={pickAudioFromDevice} style={styles.recordButton}>
            <AudioLines style={{color:'#fff'}}/>
          </TouchableOpacity>
        )}
        {audioInfo && <Text style={styles.audioStatusText}>Selected Audio: {audioInfo.name}</Text>}
        <TouchableOpacity
          style={styles.postButton} // keep small margin; main spacing comes from paddingBottom above
          onPress={handlePost}
          disabled={uploading}
        >
          {uploading ? <ActivityIndicator color="white" /> : <Text style={styles.postButtonText}>Post</Text>}
        </TouchableOpacity>
          </>
        )}
         {isVideo && (
          <>
            <TouchableOpacity
              style={styles.postButton} // keep small margin; main spacing comes from paddingBottom above
              onPress={handlePost}
              disabled={uploading}
            >
              {uploading ? <ActivityIndicator color="white" /> : <Text style={styles.postButtonText}>Post</Text>}
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  imageContainer: { width: '100%', height: '70%', position: 'relative' },
  image: { width: '100%', height: '100%' },
  videoContainer: { width: '100%', height: '70%', backgroundColor: 'black' },
  video: { width: '100%', height: '100%' },
  stickerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  captionInput: {
    color: 'white',
    fontSize: 16,
    marginTop: '6%',
    marginLeft: '6%',
    marginRight: '6%',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: '10%',
    width: '25%',
    alignItems: 'center',
    marginLeft: '8%'
    // overflowX: 'scroll',
  },
  tagtextRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: '10%',
    width: '25%',
    alignItems: 'center'
    // overflowX: 'scroll',
  },
  tagButton: {
    color: 'white',
    backgroundColor: '#444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginHorizontal: 5,
    fontSize: 16
  },
  postButton: {
    position: 'absolute',
    alignSelf: 'right',
    backgroundColor: '#F68532',
    padding: 12,
    borderRadius: 30,
    bottom: '-18%',
    marginLeft: '80%'
    // marginTop: 10,
    // marginBottom: '20%',
  },
  postButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  },
  filterButton: {
    color: 'white',
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    margin: 4,
  },
  recordButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
    alignSelf: 'center',
    position: 'absolute',
    bottom: '-20%',
    // marginLeft: '15%'
  },
  recordButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  audioStatusText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
    alignSelf: 'center',
  },
  chipsScroll: {
    // optional: to prevent vertical scroll from stealing touches on Android:
    // maxHeight: 48,
  },
  chipsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,          
    marginRight: 8,             
  },
  chipLabel: {
    color: 'white',
    fontSize: 16,
    marginLeft: 6,
  },
  tagText: {
    color: 'white',
    fontSize: 20,
    marginLeft: '30%',
    marginTop: '6%',
    marginBottom: '-24%'
  }
});

export default EditMediaScreen;