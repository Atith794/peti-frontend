// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, TextInput, Button, Image, StyleSheet, Alert, ActivityIndicator, TouchableOpacity
// } from 'react-native';
// import Video from 'react-native-video';
// import { launchImageLibrary } from 'react-native-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { BASE_URL } from '../services/baseUrl';
// import AppLayout from './AppLayout';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const AddPostScreen = ({ navigation, route }) => {
//   const insets = useSafeAreaInsets();
//   const [media, setMedia] = useState(null);
//   const [caption, setCaption] = useState('');
//   const [location, setLocation] = useState('');
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     if (route.params?.photo) {
//       setMedia({
//         uri: 'file://' + route.params.photo.path,
//         type: 'image/jpeg',
//         fileName: route.params.photo.path.split('/').pop(),
//       });
//     }
//     if (route?.params?.video) {
//       setMedia({ uri: 'file://' + route.params.video.path, type: 'video/mp4' });
//     }
//   }, [route?.params]);

//   const pickMedia = () => {
//     launchImageLibrary({ mediaType: 'mixed' }, (res) => {
//       if (res.didCancel) return;
//       if (res.errorMessage) {
//         Alert.alert("Error", res.errorMessage);
//         return;
//       }

//       const asset = res.assets?.[0];
//       if (asset) {
//         setMedia(asset);
//       }
//     });
//   };

//   const uploadPost = async () => {
//     if (!media) {
//       Alert.alert('Missing', 'Please select an image or video');
//       return;
//     }

//     const token = await AsyncStorage.getItem('token');
//     const formData = new FormData();

//     formData.append('caption', caption);
//     formData.append('location', location);
//     formData.append('media', {
//       uri: media.uri,
//       name: media.fileName || 'upload.jpg',
//       type: media.type || 'image/jpeg'
//     });

//     try {
//       setUploading(true);
//       const res = await axios.post(`${BASE_URL}/api/posts/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`
//         }
//       });
//       Alert.alert('Success', 'Post uploaded!');
//       navigation.replace('Home');
//     } catch (err) {
//       console.error("Upload error:", err);
//       Alert.alert('Upload Failed', err.response?.data?.error || err.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <View style={[styles.container, , { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
//       <AppLayout>

//         {/* <Button title="Pick Image/Video" onPress={pickMedia} /> */}
//         <TouchableOpacity style={styles.button} onPress={pickMedia}>
//           <Text style={styles.buttonText}>Pick Image/Video</Text>
//         </TouchableOpacity>
//         {/* <Button title="Open Camera" onPress={() => navigation.navigate('CustomCamera')} /> */}
//         <TouchableOpacity style={styles.cameraButton} onPress={() => navigation.navigate('CustomCamera')}>
//           <Text style={styles.buttonText}>Open Camera</Text>
//         </TouchableOpacity>
//         {/* {media && (
//           <Image source={{ uri: media.uri }} style={styles.preview} />
//         )} */}
//         {/* {console.log("Enri media:",media)} */}
//         {media?.type?.includes('video') ? (
//           <Video
//             source={{ uri: media?.uri }}
//             style={styles.preview}
//             resizeMode="cover"
//             repeat
//           />
//         ) : (
//           <Image source={{ uri: media?.uri }} style={styles.preview} />
//         )}



//         <TextInput
//           placeholder="Caption"
//           placeholderTextColor="#94A3B8"
//           style={styles.input}
//           value={caption}
//           onChangeText={setCaption}
//         />

//         <TextInput
//           placeholder="Location"
//           placeholderTextColor="#94A3B8"
//           style={styles.input}
//           value={location}
//           onChangeText={setLocation}
//         />

//         {/* <Button title="Upload Post" onPress={uploadPost}  style={ styles.uploadPostButton } /> */}
//         <TouchableOpacity style={styles.uploadPostButton} onPress={uploadPost}>
//           <Text style={styles.buttonText}>Post</Text>
//         </TouchableOpacity>
//         {uploading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
//         {/* <Button title="Home" color="green" onPress={() => navigation.replace('Home')} /> */}
//       </AppLayout>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     // paddingTop: 20, 
//     flex: 1 
//   },
//   input: {
//     borderWidth: 0.5,
//     borderColor: '#aaa',
//     // marginVertical: '5%',
//     padding: '3%',
//     borderRadius: 8,
//     marginLeft: '7.01%',
//     marginRight:'7.01%',
//     // marginTop:'1%',
//     // marginBottom:'7.01%'
//   },
//   preview: {
//     width: '50%',
//     height: '50%',
//     marginVertical: '5%',
//     marginBottom: '5%',
//     marginLeft: '24%',
//     borderRadius: 8
//   },
//   button: {
//     backgroundColor: '#F68532',
//     borderRadius: 12,
//     paddingVertical: 15,
//     alignItems: 'center',
//     marginTop: '7%',
//     // elevation: 3,
//     marginHorizontal: '7%',
//     marginBottom: '7%'
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   cameraButton:{
//     backgroundColor: '#bfbfbfff',
//     borderRadius: 12,
//     paddingVertical: 15,
//     alignItems: 'center',
//     // marginTop: '7%',
//     elevation: 3,
//     marginHorizontal: '7%',
//     marginBottom: '7%'
//   },
//   uploadPostButton:{
//     backgroundColor: '#bfbfbfff',
//     borderRadius: 12,
//     paddingVertical: 15,
//     alignItems: 'center',
//     // marginTop: '7%',
//     elevation: 3,
//     marginHorizontal: '7%',
//     marginBottom: '7%',
//     borderColor: 'black'
//   }
// });

// export default AddPostScreen;

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Image, StyleSheet, Alert, ActivityIndicator, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import Video from 'react-native-video';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../services/baseUrl';
import AppLayout from './AppLayout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AddPostScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (route.params?.photo) {
      setMedia({
        uri: 'file://' + route.params.photo.path,
        type: 'image/jpeg',
        fileName: route.params.photo.path.split('/').pop(),
      });
    }
    // if (route?.params?.video) {
    //   console.log("Route.params:",route.params.video.path)
    //   setMedia({ uri: 'file://' + route.params.video.path, type: 'video/mp4' });
    // }
    if (route?.params?.video) {
      const path = route.params.video.path;                   // e.g. .../12345.mp4 or .../12345.mov
      const fileName = path.split('/').pop();                 // 12345.mp4
      const type = fileName.endsWith('.mov') ? 'video/quicktime' : 'video/mp4';

      setMedia({
        uri: 'file://' + path,
        type,
        fileName,                                            // <-- crucial
      });
    }
  }, [route?.params]);

  const pickMedia = () => {
    launchImageLibrary({ mediaType: 'mixed' }, (res) => {
      if (res.didCancel) return;
      if (res.errorMessage) {
        Alert.alert("Error", res.errorMessage);
        return;
      }
      const asset = res.assets?.[0];
      if (asset) setMedia(asset);
    });
  };

  const handleRemoveMedia = () => {
    setMedia(null);
  };

  const uploadPost = async () => {
    if (!media) {
      Alert.alert('Missing', 'Please select an image or video');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('location', location);
    const fallbackName = media.type?.startsWith('video/')
    ? `upload.${media.type === 'video/quicktime' ? 'mov' : 'mp4'}`
    : 'upload.jpg';
    // formData.append('media', {
    //   uri: media.uri,
    //   name: media.fileName || 'upload.jpg',
    //   type: media.type || 'image/jpeg'
    // });
    formData.append('media', {
      uri: media.uri,
      name: media.fileName || fallbackName,                  
      type: media.type || 'image/jpeg',
    });

    try {
      setUploading(true);
      await axios.post(`${BASE_URL}/api/posts/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      Alert.alert('Success', 'Post uploaded!');
      setMedia(null);
      setCaption('');
      setLocation('');
      navigation.navigate('Home');
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert('Upload Failed', err.response?.data?.error || err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0} // adjust if you add a header
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 96, // ✅ clears bottom tab bar + gives breathing room
        }}
      >
        <AppLayout>{/* Ensure AppLayout is a plain View on this screen (no ScrollView) */}
          <TouchableOpacity style={styles.button} onPress={pickMedia}>
            <Text style={styles.buttonText}>Pick Image/Video</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cameraButton} onPress={() => navigation.navigate('CustomCamera')}>
            <Text style={styles.buttonText}>Open Camera</Text>
          </TouchableOpacity>
          {/* 100% working code */}
          {/* {media ? (
            media?.type?.includes('video') ? (
              <Video source={{ uri: media?.uri }} style={styles.preview} resizeMode="cover" repeat controls/>
            ) : (
              <Image source={{ uri: media?.uri }} style={styles.preview} />
            )
          ) : null} */}

          {/* Preview + clear (×) */}
          {media ? (
            <View style={styles.previewWrap}>
              {media?.type?.includes('video') ? (
                <Video source={{ uri: media?.uri }} style={styles.previewMedia} resizeMode="cover" repeat controls/>
              ) : (
                <Image source={{ uri: media?.uri }} style={styles.previewMedia} />
              )}

              <TouchableOpacity
                accessibilityLabel="Remove selected media"
                onPress={handleRemoveMedia}
                style={styles.removeBadge}
                disabled={uploading}
              >
                <Text style={styles.removeBadgeText}>×</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <TextInput
            placeholder="Caption"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            value={caption}
            onChangeText={setCaption}
            returnKeyType="next"
          />

          <TextInput
            placeholder="Location"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            returnKeyType="done"
          />

          <TouchableOpacity style={styles.uploadPostButton} onPress={uploadPost}>
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>

          {uploading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
        </AppLayout>

        {/* Extra spacer just in case different devices/nav bars need more room */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },

  input: {
    borderWidth: 0.5,
    borderColor: '#aaa',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: '7%',
    marginBottom: 12,
  },

  preview: {
    width: '86%',
    aspectRatio: 1,         // ✅ keeps it square; remove if you want 16:9
    alignSelf: 'center',    // ✅ centers without hardcoded margins
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#f1f5f9',
  },

  button: {
    backgroundColor: '#F68532',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: '7%',
    marginBottom: 12,
    marginTop: '5%'
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },

  cameraButton: {
    backgroundColor: '#bfbfbf',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 3,
    marginHorizontal: '7%',
    marginBottom: 12,
  },

  uploadPostButton: {
    backgroundColor: '#0ea5e9',
    color: '#F68532',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 3,
    marginHorizontal: '7%',
    marginTop: 8,
  },
  // New wrapper to position the "×"
  previewWrap: {
    width: '86%',
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
    position: 'relative',
  },
  // Fill the wrapper
  previewMedia: {
    width: '100%',
    height: '100%',
  },
  // The little × badge
  removeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBadgeText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '600',
  },
});

export default AddPostScreen;
