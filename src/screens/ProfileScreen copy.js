import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome! You are logged in.</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 18, marginBottom: 20 },
  button: { backgroundColor: '#dc3545', padding: 15, borderRadius: 6 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

export default WelcomeScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../services/baseUrl.js';
import AppLayout from './AppLayout.js';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  // console.log("BASE_URL:", BASE_URL);
  const insets = useSafeAreaInsets();

  const fetchProfile = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      // const res = await axios.get('http://192.168.1.100:5000/api/profile/me', {
      const res = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (err) {
      Alert.alert('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    // setMessages([]);
    console.log("Logged Out");
    navigation.replace('Login');
    // navigation.navigate('Login');
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <AppLayout>
        <View>
          <Image 
            source={{ uri: `${BASE_URL}/uploads/${profile.profilePicture}` }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{profile?.username}</Text>
          <Text style={styles.details}> {profile?.email}</Text>
        </View>
        

        <Text style={styles.title}>My Pets</Text>
         <Image 
          source={{ uri: `${BASE_URL}/uploads/${profile.profilePicture}` }}
          style={styles.pets}
        />
        <Text style={styles.details}>{profile?.petname}</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </AppLayout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    // padding: 20, 
    flexGrow: 1, 
    justifyContent: 'center' 
  },
  username:{
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: '3%',
    marginLeft: '39%',
    // alignItems: 'center',
    // justifyContent:'center'
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: '3%',
    marginLeft: '6%',
    alignItems: 'center',
    justifyContent:'center'
  },
  buttonContainer: { 
    marginTop: 15 ,
    marginLeft: '6%',
    marginRight: '6%',
  },
  adContainer: { 
    marginTop: 15, 
    alignItems: 'center'
  },
  avatar: {
    // width: '50%',
    // height: '50%',
    width: 125,
    height: 125,
    borderRadius: 125,
    alignSelf: 'center',
    marginBottom: '6%',
    marginTop: '16%',
    // borderWidth: 2,
    borderColor: 'transparent',
    fontFamily: 'Poppins',
  },
  details:{
    fontSize: 18, 
    // fontWeight: 'bold', 
    marginBottom: '3%',
    marginLeft: '6%',
    fontFamily: 'Poppins',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    // backgroundColor: '#f7ab06ff', // gradient green tone approximation
    backgroundColor: '#F68532', //Color of the word 'i' on logo -- OG color, Color of the words PET -- 144951 
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    marginLeft: '7.01%',
    marginRight: '7.01%'
  },
  buttonText: {
    color: '#ffffff',
    // color: '#0c0c0cff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pets: {
    width: 125,
    height: 125,
    borderRadius: 125,
    alignSelf: 'flex-start',
    marginBottom: '6%',
    marginTop: '6%',
    marginLeft: '6%',

    // borderWidth: 2,
    borderColor: 'transparent',
  }
});

export default ProfileScreen;

//100% working code
// import React, { useEffect, useState, useMemo } from 'react';
// import { View, Text, StyleSheet, Button, ActivityIndicator, ScrollView, Alert, Image, TouchableOpacity, FlatList, Modal  } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { BASE_URL } from '../services/baseUrl.js';
// import AppLayout from './AppLayout.js';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { Dimensions } from 'react-native';
// import Video from 'react-native-video';
// import ImageViewing from 'react-native-image-viewing';
// import AudioPlayer from './AudioPlayer.js';

// const ProfileScreen = ({ navigation }) => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const insets = useSafeAreaInsets();
//   const [posts, setPosts] = useState([]);
//   const [selectedImageUri, setSelectedImageUri] = useState(null);
//   const GAP = 6;
//   const ITEM_SIZE = (Dimensions.get('window').width - (GAP * 4)) / 3; 
//   const [visible, setIsVisible] = useState(false);
//   const [viewer, setViewer] = useState({
//     visible: false,
//     type: null,          // 'image' | 'video' | 'imageAudio'
//     imageUri: null,
//     videoUri: null,
//     audioUri: null,
//   });
//   const [zoomVisible, setZoomVisible] = useState(false);
//   const [zoomIndex, setZoomIndex] = useState(0);
//   const [audioPaused, setAudioPaused] = useState(false); // for image+audio case
//   const [imageAudioUri, setImageAudioUri] = useState(null)

//   const [mediaViewer, setMediaViewer] = useState({
//     visible: false,
//     type: null,           // 'image' | 'video'
//     images: [],           // [{uri}]
//     startIndex: 0,
//     videoUri: null,
//     audioMap: {},         // { [imageUri]: audioUri | undefined }
//     audioPaused: false,
//   });

//   // const imageItems = useMemo(() => {
//   //   return filteredPosts
//   //     ?.filter(post => post.mediaType === "image")
//   //     ?.map(post => ({
//   //       uri: post.mediaUrl?.startsWith("http")
//   //         ? post.mediaUrl
//   //         : `${BASE_URL}/${post.mediaUrl}`
//   //     })) || [];
//   // }, [filteredPosts]);
//   const filteredPostItems = useMemo(
//     () => posts.filter((p) => p?.user?._id === profile?._id),
//     [posts, profile?._id]
//   );

//   const { imageItems, audioMap } = useMemo(() => {
//     const imgs = [];
//     const aMap = {};
//     filteredPostItems?.forEach(post => {
//       if (post.mediaType === 'image') {
//         const img = post.mediaUrl?.startsWith('http') ? post.mediaUrl : `${BASE_URL}/${post.mediaUrl}`;
//         imgs.push({ uri: img });
//         if (post.audioUrl) {
//           const a = post.audioUrl.startsWith('http') ? post.audioUrl : `${BASE_URL}/${post.audioUrl}`;
//           aMap[img] = a;
//         }
//       }
//     });
//     return { imageItems: imgs, audioMap: aMap };
//   }, [filteredPostItems, BASE_URL]);

//   const openImageAt = (imageUri) => {
//     const idx = imageItems.findIndex(i => i.uri === imageUri);
//     setMediaViewer({
//       visible: true,
//       type: 'image',
//       images: imageItems,
//       startIndex: idx >= 0 ? idx : 0,
//       videoUri: null,
//       audioMap,
//       audioPaused: false,
//     });
//   };

//   const openVideo = (videoUri) => {
//     setMediaViewer({
//       visible: true,
//       type: 'video',
//       images: [],
//       startIndex: 0,
//       videoUri,
//       audioMap: {},
//       audioPaused: false,
//     });
//   };

//   const fetchProfile = async () => {
//     const token = await AsyncStorage.getItem('token');
//     try {
//       const res = await axios.get(`${BASE_URL}/api/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setProfile(res.data);
//     } catch (err) {
//       Alert.alert('Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchFeed = async () => {
//     const token = await AsyncStorage.getItem('token');
//     try {
//       const res = await axios.get(`${BASE_URL}/api/posts/feed`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setPosts(res.data);
//     } catch (err) {
//       console.error("Error in HomeScreen:",err);
//       Alert.alert("Error", err?.response?.data?.error || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem('token');
//     navigation.replace('Login');
//   };

//   useEffect(() => {
//     fetchProfile();
//     fetchFeed();
//   }, []);

//   if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

//   const filteredPosts = posts.filter((item) => item?.user?._id === profile?._id)

//   return (
//     <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
    
//       <AppLayout>
//         {/* Profile Section */}
//         <View style={styles.profileSection}>
//           {/* {console.log("Profile Picture:",profile)} */}
//           {/* <TouchableOpacity onPress={() => {
//               setSelectedImageUri(`${BASE_URL}/${profile?.profilePicture}`);
//               setIsVisible(true);
//             }}>
//               <Image
//                 source={{ uri: `${BASE_URL}/${profile?.profilePicture}` }}
//                 style={styles.avatar}
//               />
              
//           </TouchableOpacity> */}
//           <TouchableOpacity onPress={() => openImageAt(`${BASE_URL}/${profile?.profilePicture}`)}>
//             <Image source={{ uri: `${BASE_URL}/${profile?.profilePicture}` }} style={styles.avatar} />
//           </TouchableOpacity>
//           <Text style={styles.username}>{profile?.username}</Text>
//           <Text style={styles.details}>{profile?.email}</Text>
//         </View>
        


//         {/* Pets Section */}
//         <Text style={styles.title}>My Pets</Text>
//         <FlatList
//           horizontal
//           data={profile?.pets || []}
//           keyExtractor={(item, index) => item._id ?? `${index}-${item?.photoUrl}`}
//           contentContainerStyle={styles.petsRow}
//           showsHorizontalScrollIndicator={true}
//           ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
//           renderItem={({ item }) => (
//             <View style={styles.petCard}>
//             <TouchableOpacity onPress={() => {
//               setSelectedImageUri(`${BASE_URL}/${item?.photoUrl}`);
//               setIsVisible(true);
//             }}>
//               <Image
//                 source={{ uri: `${BASE_URL}/${item?.photoUrl}` }}
//                 style={styles.petAvatar}
//               />
//               <Text style={styles.petName} numberOfLines={1}>
//                 {item?.name}
//               </Text>
//             </TouchableOpacity>  
//               {/* <TouchableOpacity onPress={() => openImageAt(`${BASE_URL}/${item?.photoUrl}`)}>
//                 <Image source={{ uri: `${BASE_URL}/${item?.photoUrl}` }} style={styles.petAvatar} />
//                 <Text style={styles.petName} numberOfLines={1}>{item?.name}</Text>
//               </TouchableOpacity> */}
//             </View>
//           )}
//         />
//         {/* Buddies & Following Row */}
//         <View style={styles.statsContainer}>
//            <View style={styles.statBox}>
//             <Text style={styles.statCount}>{filteredPosts?.length || 0}</Text>
//             <Text style={styles.statTitle}>Posts</Text>
//           </View>
//           <View style={styles.statBox}>
//             <Text style={styles.statCount}>{profile?.followers?.length || 0}</Text>
//             <Text style={styles.statTitle}>Buddies</Text>
//           </View>
//           <View style={styles.statBox}>
//             <Text style={styles.statCount}>{profile?.following?.length || 0}</Text>
//             <Text style={styles.statTitle}>Following</Text>
//           </View>
//         </View>

//         {/* Posts Section */}
//         <Text style={styles.title}>Posts</Text>
//         {filteredPosts?.length > 0 ?
//         <FlatList
//           data={filteredPosts}
//           scrollEnabled={false}
//           keyExtractor={(item) => item._id}
//           numColumns={3}
//           contentContainerStyle={styles.gridContainer}
//           columnWrapperStyle={{ gap: GAP }}
//           ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
//           renderItem={({ item }) => {
//             const uri = item.mediaUrl?.startsWith('http')
//               ? item.mediaUrl
//               : `${BASE_URL}/${item.mediaUrl}`;

//             return (
//               <View style={[styles.postItem, { width: ITEM_SIZE, height: ITEM_SIZE }]}>
//                 {/* {item.mediaType === 'image' ? (
//                   <TouchableOpacity onPress={() => {
//                     setSelectedImageUri(uri);
//                     setIsVisible(true);
//                   }}>
//                     <Image
//                       source={{ uri }}
//                       style={styles.postMedia}
//                       resizeMode="cover"
//                     />
//                   </TouchableOpacity>
//                 ) : (
//                   <Video
//                     source={{ uri }}
//                     style={styles.postMedia}
//                     resizeMode="cover"
//                     muted
//                     repeat
//                     paused // set to false if you want autoplay in grid
//                   />
//                 )} */}
//                 {item.mediaType === 'image' ? (
//                   <TouchableOpacity onPress={() => {
//                     const img = item.mediaUrl?.startsWith('http') ? item.mediaUrl : `${BASE_URL}/${item.mediaUrl}`;
//                     openImageAt(img);
//                   }}>
//                     <Image source={{ uri }} style={styles.postMedia} resizeMode="cover" />
//                   </TouchableOpacity>
//                 ) : (
//                   <TouchableOpacity onPress={() => openVideo(uri)} activeOpacity={0.9}>
//                     <Video
//                       source={{ uri }}
//                       style={styles.postMedia}
//                       resizeMode="cover"
//                       muted
//                       repeat
//                       paused
//                     />
//                   </TouchableOpacity>
//                 )}
//               </View>
//             );
//             // return (
//             //   <View style={[styles.postItem, { width: ITEM_SIZE, height: ITEM_SIZE }]}>
//             //     {(() => {
//             //       const mediaUri = item.mediaUrl?.startsWith('http')
//             //         ? item.mediaUrl
//             //         : `${BASE_URL}/${item.mediaUrl}`;

//             //       const audioUri = item.audioUrl
//             //         ? (item.audioUrl.startsWith('http') ? item.audioUrl : `${BASE_URL}/${item.audioUrl}`)
//             //         : null;

//             //       if (item.mediaType === 'image') {
//             //         // Image (maybe with audio)
//             //         // return (
//             //          {/* <TouchableOpacity
//             //             onPress={() => {
//             //               if (audioUri) {
//             //                 // image + audio viewer
//             //                 setViewer({
//             //                   visible: true,
//             //                   type: 'imageAudio',
//             //                   imageUri: mediaUri,
//             //                   audioUri,
//             //                 });
//             //                 setAudioPaused(false);
//             //                 setImageAudioUri(audioUri || null); // attach audio if present
//             //                 setAudioPaused(false);
//             //                 setIsVisible(true);
//             //               } else {
//             //                 // plain image viewer
//             //                 setViewer({
//             //                   visible: true,
//             //                   type: 'image',
//             //                   imageUri: mediaUri,
//             //                 });
//             //                 setIsVisible(true);
//             //               }
//             //             }}
//             //           > 
//             //             <Image source={{ uri: mediaUri }} style={styles.postMedia} resizeMode="cover" />
//             //           </TouchableOpacity> */}
//             //         return (
//             //           <TouchableOpacity
//             //             onPress={() => {
//             //               const tappedUri = item.mediaUrl?.startsWith('http')
//             //                 ? item.mediaUrl
//             //                 : `${BASE_URL}/${item.mediaUrl}`;

//             //               const index = imageItems.findIndex(img => img.uri === tappedUri);
//             //               if (index >= 0) {
//             //                 setZoomIndex(index);
//             //                 setZoomVisible(true);
//             //               }
//             //             }}
//             //           >
//             //             <Image source={{ uri: mediaUri }} style={styles.postMedia} resizeMode="cover" />
//             //           </TouchableOpacity>

//             //         );
//             //       }

//             //       // Video thumbnail → open video viewer
//             //       return (
//             //         <TouchableOpacity
//             //           onPress={() =>
//             //             setViewer({
//             //               visible: true,
//             //               type: 'video',
//             //               videoUri: mediaUri,
//             //             })
//             //           }
//             //           activeOpacity={0.9}
//             //         >
//             //           <Video
//             //             source={{ uri: mediaUri }}
//             //             style={styles.postMedia}
//             //             resizeMode="cover"
//             //             muted
//             //             repeat
//             //             paused   // keep grid silent; open player on tap
//             //           />
//             //         </TouchableOpacity>
//             //       );
//             //     })()}
//             //   </View>
//             // )
//           }}
//         />:<Text style={styles.noPostsText}>No posts to display</Text>
      
//       }
//         {/* <FlatList
//           data={filteredPosts}
//           scrollEnabled={false}
//           keyExtractor={(item) => item._id}
//           numColumns={3}
//           contentContainerStyle={styles.gridContainer}
//           columnWrapperStyle={{ gap: GAP }}
//           ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
//           renderItem={({ item }) => {
//             const uri = item.mediaUrl?.startsWith('http')
//               ? item.mediaUrl
//               : `${BASE_URL}/${item.mediaUrl}`;

//             return (
//               <View style={[styles.postItem, { width: ITEM_SIZE, height: ITEM_SIZE }]}>
//                 {item.mediaType === 'image' ? (
//                   <Image
//                     source={{ uri }}
//                     style={styles.postMedia}
//                     resizeMode="cover"
//                   />
//                 ) : (
//                   <Video
//                     source={{ uri }}
//                     style={styles.postMedia}
//                     resizeMode="cover"
//                     muted
//                     repeat
//                     paused // set to false if you want autoplay in grid
//                   />
//                 )}
//               </View>
//             );
//           }}
//         /> */}

//         {/* Logout */}
//         <TouchableOpacity style={styles.button} onPress={handleLogout}>
//           <Text style={styles.buttonText}>Logout</Text>
//         </TouchableOpacity>
        
//         {/* <Modal
//           visible={viewer.visible}
//           animationType="slide"
//           onRequestClose={() => setViewer({ visible: false, type: null, imageUri: null, videoUri: null, audioUri: null })}
//         >
//           <View style={styles.viewerContainer}>
//             <TouchableOpacity
//               style={styles.viewerClose}
//               onPress={() =>
//                 setViewer({ visible: false, type: null, imageUri: null, videoUri: null, audioUri: null })
//               }
//             >
//               <Text style={styles.viewerCloseText}>×</Text>
//             </TouchableOpacity>

//             {viewer.type === 'video' && (
//               <Video
//                 source={{ uri: viewer.videoUri }}
//                 style={styles.viewerMedia}
//                 resizeMode="contain"
//                 controls
//                 paused={false}
//                 muted={false}
//               />
//             )}

//             {viewer.type === 'image' && (
//               <Image
//                 source={{ uri: viewer.imageUri }}
//                 style={styles.viewerMedia}
//                 resizeMode="contain"
//               />
//             )}

//             {viewer.type === 'imageAudio' && (
//               <View style={styles.viewerMedia}>
//                 <Image
//                   source={{ uri: viewer.imageUri }}
//                   style={styles.viewerMedia}
//                   resizeMode="contain"
//                 />
//                 <View style={styles.audioControls}>
//                   <TouchableOpacity
//                     onPress={() => setAudioPaused(p => !p)}
//                     style={styles.audioButton}
//                   >
//                     <Text style={styles.audioButtonText}>{audioPaused ? 'Play' : 'Pause'}</Text>
//                   </TouchableOpacity>
//                 </View>

//                 <Video
//                   source={{ uri: viewer.audioUri }}
//                   audioOnly
//                   paused={audioPaused}
//                   playInBackground={false}
//                   playWhenInactive={false}
//                   onEnd={() => setAudioPaused(true)}
//                   style={{ width: 0, height: 0 }}
//                 />

//                 <ImageViewing
//                   images={[{ uri }]}
//                   imageIndex={0}
//                   visible={visible}
//                   onRequestClose={() => setIsVisible(false)}
//                 />
//               </View>
//             )}
//           </View>
//         </Modal> */}
        
//         {/* MEDIA VIEWER */}
//         <Modal
//           visible={mediaViewer.visible}
//           animationType="fade"
//           transparent
//           onRequestClose={() => setMediaViewer(v => ({ ...v, visible: false }))}
//         >
//           {/* IMAGE ZOOMER */}
//           {/* {mediaViewer.type === 'image' && (
//             <ImageViewing
//               images={mediaViewer.images}
//               imageIndex={mediaViewer.startIndex}
//               visible={true}
//               onRequestClose={() => setMediaViewer(v => ({ ...v, visible: false }))}
//               // Keep audio in sync while swiping images
//               onImageIndexChange={(idx) => {
//                 setMediaViewer(v => ({ ...v, startIndex: idx }));
//               }}
//               HeaderComponent={({ imageIndex }) => (
//                 <View style={viewerStyles.header}>
//                   <TouchableOpacity onPress={() => setMediaViewer(v => ({ ...v, visible: false }))}>
//                     <Text style={viewerStyles.headerText}>×</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//               FooterComponent={({ imageIndex }) => {
//                 const imgUri = mediaViewer.images?.[imageIndex]?.uri;
//                 const audioUri = mediaViewer.audioMap?.[imgUri];
//                 if (!audioUri) return null;
//                 return (
//                   <View style={viewerStyles.footer}>
//                     <TouchableOpacity
//                       onPress={() => setMediaViewer(v => ({ ...v, audioPaused: !v.audioPaused }))}
//                       style={viewerStyles.audioButton}
//                     >
//                       <Text style={viewerStyles.audioButtonText}>
//                         {mediaViewer.audioPaused ? 'Play' : 'Pause'} Audio
//                       </Text>
//                     </TouchableOpacity>
//                     <Video
//                       source={{ uri: audioUri }}
//                       audioOnly
//                       paused={mediaViewer.audioPaused}
//                       playInBackground={false}
//                       playWhenInactive={false}
//                       onEnd={() => setMediaViewer(v => ({ ...v, audioPaused: true }))}
//                       style={{ width: 0, height: 0 }}
//                     />
//                   </View>
//                 );
//               }}
//             />
//           )} */}

//           {/* FULLSCREEN VIDEO */}
//           {mediaViewer.type === 'video' && (
//             <View style={viewerStyles.videoContainer}>
//               <TouchableOpacity
//                 style={viewerStyles.close}
//                 onPress={() => setMediaViewer(v => ({ ...v, visible: false }))}
//               >
//                 <Text style={viewerStyles.headerText}>×</Text>
//               </TouchableOpacity>
//               <Video
//                 source={{ uri: mediaViewer.videoUri }}
//                 style={viewerStyles.video}
//                 resizeMode="contain"
//                 controls
//                 paused={false}
//               />
//             </View>
//           )}
//         </Modal>
//       </AppLayout>
//     </ScrollView>

//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     // flexGrow: 1,
//     backgroundColor: '#fff',
//   },
//   profileSection: {
//     alignItems: 'center', // center everything horizontally
//     marginTop: '8%',
//     marginBottom: '6%',
//   },
//   username:{
//     fontSize: 22, 
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   title: { 
//     fontSize: 22, 
//     fontWeight: 'bold', 
//     marginBottom: '3%',
//     marginLeft: '6%',
//   },
//   details:{
//     fontSize: 16,
//     marginTop: '5%',
//     textAlign: 'center'
//   },
//   avatar: {
//     width: 125,
//     height: 125,
//     borderRadius: 125,
//     // borderColor: 'transparent',
//     borderColor: '#F68532',
//   },
//   petsContainer: {
//     flexDirection: 'row', // arrange pets horizontally
//     flexWrap: 'wrap', // wrap to next line if needed
//     justifyContent: 'flex-start',
//     paddingHorizontal: '6%',
//     marginBottom: '6%',
//   },
//   petItem: {
//     alignItems: 'center',
//     marginRight: 15,
//     marginBottom: 15,
//   },
//   pets: {
//     width: 100,
//     height: 100,
//     borderRadius: 100,
//     borderColor: 'transparent',
//   },
//   button: {
//     backgroundColor: '#F68532',
//     borderRadius: 12,
//     paddingVertical: 15,
//     alignItems: 'center',
//     marginTop: '2%',
//     elevation: 3,
//     marginHorizontal: '7%',
//     marginBottom: '20%'
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   noPostsText: {
//     color: '#F68532',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: '6%',
//     marginBottom: '3.5%'
//   },
//   // statsContainer: {
//   //   flexDirection: 'row',
//   //   justifyContent: 'space-around',
//   //   marginVertical: 15,
//   //   borderColor:'#F68532'
//   // },
//   statItem: {
//     alignItems: 'center',
//   },
//   statTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   statCount: {
//     fontSize: 16,
//     color: '#555',
//     marginTop: 4,
//   },
//   gridContainer: {
//     paddingHorizontal: 6,
//     paddingBottom: 10,
//   },
//   postItem: {
//     borderRadius: 12,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#e5e7eb', // light gray
//     backgroundColor: '#f9fafb',
//   },
//   postMedia: {
//     width: '100%',
//     height: '100%',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginVertical: 15,
//   },
//   statBox: {
//     width: 100, // square size
//     height: 100,
//     borderWidth: 1,
//     // borderColor: '#F68532', // subtle border
//     borderColor: '#edededff', // subtle border
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//     shadowColor: '#F68532',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2, // for Android subtle shadow
//   },
//   statCount: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   statTitle: {
//     fontSize: 14,
//     color: '#555',
//     marginTop: 4,
//   },
//   petsRow: {
//     paddingHorizontal: '6%',
//     paddingBottom: '4%',
//   },
//   petCard: {
//     alignItems: 'center',
//     width: 92, // keeps names from wrapping oddly
//   },
//   petAvatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#eaeaea',
//   },
//   petName: {
//     marginTop: 6,
//     fontSize: 12,
//     color: '#111827',
//     maxWidth: 88,
//     textAlign: 'center',
//   },
//   viewerContainer: {
//     flex: 1,
//     backgroundColor: 'black',
//     justifyContent: 'center',
//   },
//   viewerMedia: {
//     width: '100%',
//     height: '100%',
//   },
//   viewerClose: {
//     position: 'absolute',
//     top: 16,
//     right: 16,
//     zIndex: 10,
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   viewerCloseText: {
//     color: '#fff',
//     fontSize: 22,
//     lineHeight: 22,
//     fontWeight: '700',
//   },
//   audioControls: {
//     position: 'absolute',
//     bottom: 28,
//     alignSelf: 'center',
//     backgroundColor: 'rgba(0,0,0,0.45)',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 20,
//   },
//   audioButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   audioButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   header: {
//     position: 'absolute',
//     top: 18,
//     right: 18,
//     zIndex: 2,
//     backgroundColor: 'rgba(0,0,0,0.55)',
//     borderRadius: 18,
//     width: 36,
//     height: 36,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   headerText: { color: '#fff', fontSize: 22, fontWeight: '700' },
//   footer: {
//     position: 'absolute',
//     bottom: 28,
//     alignSelf: 'center',
//     backgroundColor: 'rgba(0,0,0,0.45)',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 20,
//   },
//   audioButton: { alignItems: 'center', justifyContent: 'center' },
//   audioButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
//   videoContainer: {
//     flex: 1,
//     backgroundColor: 'black',
//     justifyContent: 'center',
//   },
//   video: { width: '100%', height: '100%' },
//   close: {
//     position: 'absolute',
//     top: 18, right: 18, zIndex: 2,
//     backgroundColor: 'rgba(0,0,0,0.55)',
//     borderRadius: 18, width: 36, height: 36,
//     alignItems: 'center', justifyContent: 'center',
//   },
// });

// const viewerStyles = StyleSheet.create({
//   header: {
//     position: 'absolute',
//     top: 18,
//     right: 18,
//     zIndex: 2,
//     backgroundColor: 'rgba(0,0,0,0.55)',
//     borderRadius: 18,
//     width: 36,
//     height: 36,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   headerText: { color: '#fff', fontSize: 22, fontWeight: '700' },

//   footer: {
//     position: 'absolute',
//     bottom: 28,
//     alignSelf: 'center',
//     backgroundColor: 'rgba(0,0,0,0.45)',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 20,
//   },
//   audioButton: { alignItems: 'center', justifyContent: 'center' },
//   audioButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },

//   videoContainer: {
//     flex: 1,
//     backgroundColor: 'black',
//     justifyContent: 'center',
//   },
//   video: { width: '100%', height: '100%' },
//   close: {
//     position: 'absolute',
//     top: 18, right: 18, zIndex: 2,
//     backgroundColor: 'rgba(0,0,0,0.55)',
//     borderRadius: 18, width: 36, height: 36,
//     alignItems: 'center', justifyContent: 'center',
//   },
// });

// export default ProfileScreen;

