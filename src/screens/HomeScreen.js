import React, { useEffect, useState, useRef } from 'react';
import { Animated, Easing, View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../services/baseUrl';
import Icon from 'react-native-vector-icons/Ionicons';
import { Bone } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppLayout from './AppLayout';
import AudioPlayer from './AudioPlayer';
import Video from 'react-native-video';
import { useIsFocused } from '@react-navigation/native';
import PawBreakAd from '../screens/PawBreakAd';

const PostCard = ({ item, currentUserId, toggleLike, navigation, isVisible, isTabFocused }) => {
  const wiggleAnim = useRef(new Animated.Value(0)).current;
  const isActive = (!!isVisible && isTabFocused);

  const triggerWiggle = () => {
    wiggleAnim.setValue(0);
    Animated.sequence([
      Animated.timing(wiggleAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(wiggleAnim, {
        toValue: -1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(wiggleAnim, {
        toValue: 0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: `${BASE_URL}/uploads/${item?.user?.profilePicture}` }} style={styles.avatar} />
        <View>
          <Text style={styles.username}>{item?.user?.username}</Text>
        </View>
      </View>

      <View style={styles.mediaContainer}>
        {item?.mediaUrl?.endsWith('.mp4') || item?.mediaUrl?.endsWith('.mov') ? (
          isVisible && <Video
            source={{ uri: `${BASE_URL}/${item.mediaUrl}` }}
            style={styles.postImage}
            controls
            resizeMode="cover"
            repeat
            paused={!isActive}
          />
        ) : (
          <>
            <Image source={{ uri: `${BASE_URL}/${item.mediaUrl}` }} style={styles.postImage} />
            {/* {item.audioUrl && (
              <AudioPlayer audioUrl={`${BASE_URL}/${item.audioUrl}`} />
            )} */}
            {item.audioUrl && isActive && isVisible && (
            <AudioPlayer audioUrl={`${BASE_URL}/${item.audioUrl}`} />
            )}
          </>
        )}
      </View>

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            toggleLike(item._id);
            triggerWiggle();
          }}
        >
          <Animated.View
            style={{
              transform: [
                {
                  rotate: wiggleAnim.interpolate({
                    inputRange: [-1, 1],
                    outputRange: ['-15deg', '15deg'],
                  }),
                },
              ],
            }}
          >
            <Bone
              size={22}
              color={item.likes.includes(currentUserId) ? '#FF6B35' : '#64748B'}
              fill={item.likes.includes(currentUserId) ? '#FF6B35' : 'none'}
              strokeWidth={2}

            />
          </Animated.View>
          <Text style={styles.actionText}>{item.likes.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Comments', { postId: item._id })}>
          <Icon name="chatbubble-outline" size={22} color="#64748B" />
          <Text style={styles.actionText}>{item.comments.length}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');
  const [visiblePostId, setVisiblePostId] = useState(null);
  const isTabFocused = useIsFocused();
  const AD_FREQUENCY = 6;
  
  const getCurrentUser = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    setCurrentUserId(res.data._id);
   };

   const viewabilityConfig = {
    itemVisiblePercentThreshold: 20, // 80% of the post must be visible
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setVisiblePostId(viewableItems[0].item._id); // or any unique ID
    }
  }).current;

  const fetchFeed = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get(`${BASE_URL}/api/posts/feed`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error in HomeScreen:",err);
      Alert.alert("Error", err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   setMixedData(withAdPlaceholders(posts));
  // }, [posts]);

  const toggleLike = async (postId) => {
    const token = await AsyncStorage.getItem('token');
    try {
        await axios.post(`${BASE_URL}/api/posts/${postId}/like`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchFeed();
    } catch (err) {
        Alert.alert('Error', err.response?.data?.error || err.message);
    }
   };

  useEffect(() => {
    getCurrentUser();
    fetchFeed();
  }, []);

  //Working code
  // const renderPost = ({ item }) => (
  //   <View style={styles.card}>
  //       {console.log("item in homescreen:",item)}
  //     <View style={styles.header}>
  //       <Image source={{ uri: `${BASE_URL}/uploads/${item?.user?.profilePicture}` }} style={styles.avatar} />
  //       <Text style={styles.username}>{item?.user?.username}</Text>
  //     </View>
  //     <Image source={{ uri: `${BASE_URL}/${item?.mediaUrl}` }} style={styles.media} />
  //     <Text style={styles.caption}>{item?.caption}</Text>
  //     <Text style={styles.location}>{item?.location}</Text>
  //     <TouchableOpacity onPress={() => toggleLike(item._id)}>
  //       <Icon
  //       name={item.likes.includes(currentUserId) ? 'heart' : 'heart-outline'}
  //       size={24}
  //       color={item.likes.includes(currentUserId) ? 'red' : 'black'}
  //       />
  //       </TouchableOpacity>
  //       <Text style={styles.countText}>{item.likes.length} Likes</Text>

  //       {/* <TouchableOpacity onPress={() => openCommentInput(item._id)}>
  //           <Icon name="chatbubble-outline" size={24} style={{ marginLeft: 20 }} />
  //       </TouchableOpacity>
  //       <Text style={styles.countText}>{item.comments.length} Comments</Text> */}
  //       <TouchableOpacity onPress={() => navigation.navigate('Comments', { postId: item._id })}>
  //           <Icon name="chatbubble-outline" size={24} style={{ marginLeft: 20 }} />
  //       </TouchableOpacity>
  //       <Text style={styles.countText}>{item.comments.length} Comments</Text>
  //   </View>
  // );

  //100% working code
  // const renderPost = ({ item }) => (
    
  //   <View style={styles.postCard}>
  //     <View style={styles.postHeader}>
  //       <Image source={{ uri: `${BASE_URL}/uploads/${item?.user?.profilePicture}` }} style={styles.avatar} />
  //       <View>
  //         <Text style={styles.username}>{item?.user?.username}</Text>
  //         {/* <Text style={styles.timestamp}>2h</Text> Replace with real time diff if available */}
  //       </View>
  //     </View>

  //     <Image source={{ uri: `${BASE_URL}/${item?.mediaUrl}` }} style={styles.postImage} />

  //     <View style={styles.actionBar}>
  //       <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item._id)}>
  //         {/* <Icon name={item.likes.includes(currentUserId) ? 'heart' : 'heart-outline'} size={22} color={item.likes.includes(currentUserId) ? '#FF6B35' : '#64748B'} /> */}
  //         <Bone
  //           size={22}
  //           color={item.likes.includes(currentUserId) ? '#FF6B35' : '#64748B'}
  //           fill={item.likes.includes(currentUserId) ? '#FF6B35' : 'none'}
  //           strokeWidth={2}
  //         />
  //         <Text style={styles.actionText}>{item.likes.length}</Text>
  //       </TouchableOpacity>

  //       <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Comments', { postId: item._id })}>
  //         <Icon name="chatbubble-outline" size={22} color="#64748B" />
  //         <Text style={styles.actionText}>{item.comments.length}</Text>
  //       </TouchableOpacity>

  //       {/* <TouchableOpacity style={styles.actionButton}> */}
  //         {/* <Icon name="paper-plane-outline" size={22} color="#64748B" /> */}
  //         {/* <Text style={styles.actionText}>67</Text> placeholder */}
  //       {/* </TouchableOpacity> */}
  //     </View>
  //   </View>
  // );

  const renderPost = ({ item,index }) => {
    // if (index === AD_FREQUENCY) return <PawBreakAd />;
    console.log(item)
    return (
      <>
      {index !== 0 && index % AD_FREQUENCY === 0 && <PawBreakAd />}
      <PostCard
        item={item}
        currentUserId={currentUserId}
        toggleLike={toggleLike}
        navigation={navigation}
        isVisible={item._id === visiblePostId}
        isTabFocused={isTabFocused}
      />
      </>
  )};

  // const renderMixedItem = ({ item }) => {
  //   const data = item;
  //   console.log("Data for ad posts:",data);
  //   return (
  //     <PostCard
  //       item={data}
  //       currentUserId={currentUserId}
  //       toggleLike={toggleLike}
  //       navigation={navigation}
  //       isVisible={data._id === visiblePostId}
  //       isTabFocused={isTabFocused}
  //     />
  //   );
  // }

  // const keyExtractor = (item) => item.key;

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={[styles.card, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {/* <Text style={styles.actionText}>Peti</Text> */}
        <AppLayout>
          {console.log("Posts:",posts)}
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item?._id}
            contentContainerStyle={{
              padding: 10,
              paddingBottom: '15%', // 👈 gives room above bottom tab bar
            }}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
          {/* <FlatList
            data={mixedData}
            renderItem={renderMixedItem}
            keyExtractor={(item) => item?._id}
            contentContainerStyle={{ padding: 10, paddingBottom: '15%' }}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          /> */}
        </AppLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    // backgroundColor: '#F8FAFC',
    backgroundColor: '#eddfdfff',
  },
  postCard: {
    // backgroundColor: '#FFFFFF',
    backgroundColor: '#F8FAFC',
    // borderRadius: 16,
    // marginHorizontal: 16,
    // marginBottom: 20,
    overflow: 'hidden',
    // width: '100%',
    // borderColor: '#E2E8F0'
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.08,
    // shadowRadius: 6,
    // elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: '#E2E8F0',
  },
  username: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  postImage: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginLeft: 6,
  },mediaContainer: {
  width: '100%',
  aspectRatio: 1,
  marginTop: 10,
},
postImage: {
  width: '100%',
  height: '100%',
  borderRadius: 10,
},

});

export default HomeScreen;
