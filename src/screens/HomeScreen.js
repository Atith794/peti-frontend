import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Animated, Easing, View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../services/baseUrl';
import Icon from 'react-native-vector-icons/Ionicons';
import { Bone } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppLayout from './AppLayout';
import AudioPlayer from './AudioPlayer';
import Video from 'react-native-video';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import PawBreakAd from '../screens/PawBreakAd';

const PawBreakAdMemo = React.memo(PawBreakAd);

const PostCard = ({ item, currentUserId, toggleLike, navigation, isVisible, isTabFocused, isLiking }) => {
  const wiggleAnim = useRef(new Animated.Value(0)).current;
  const isActive = (!!isVisible && isTabFocused);
  const videoRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const [appActive, setAppActive] = useState(true);

  // 1) Pause video when app goes background/foreground switches
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      appState.current = next;
      setAppActive(next === 'active');
    });
    return () => sub.remove();
  }, []);

  // 2) Pause when screen loses focus (navigating away)
  useFocusEffect(
    useCallback(() => {
      return () => {
        // screen is blurring → stop/reset
        if (videoRef.current?.seek) videoRef.current.seek(0);
      };
    }, [])
  );

  // 3) Derived playing flag
  const shouldPlay = !!isVisible && isTabFocused && appActive;

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

  const isLiked = Array.isArray(item.likes) && item.likes.includes(currentUserId);

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: `${BASE_URL}/${item?.user?.profilePicture}` }} style={styles.avatar} />
        <View>
          <Text style={styles.username}>{item?.user?.username}</Text>
        </View>
      </View>

      <View style={styles.mediaContainer}>
       {item?.caption && <Text style={styles.caption}>{item?.caption}</Text>}

        {item?.mediaType === 'video' ? (
          isVisible && (
            <Video
              ref={videoRef}
              source={{ uri: item.mediaUrl?.startsWith('http') ? item.mediaUrl : `${BASE_URL}/${item.mediaUrl}` }}
              style={styles.postImage}
              resizeMode="cover"
              paused={!shouldPlay}
              repeat={false}
              controls={false}
              muted={false}            
              playInBackground={false}
              playWhenInactive={false}
              onEnd={() => { if (videoRef.current?.seek) videoRef.current.seek(0); }}
              // Optional: smoother start on slow networks
              bufferConfig={{
                minBufferMs: 2000,
                maxBufferMs: 5000,
                bufferForPlaybackMs: 500,
                bufferForPlaybackAfterRebufferMs: 1500,
              }}
            />
          )
        ) : (
          <>
            <Image source={{ uri: item.mediaUrl?.startsWith('http')
              ? item.mediaUrl
              : `${BASE_URL}/${item.mediaUrl}` }} style={styles.postImage} />
            {item.audioUrl && shouldPlay && (
              <AudioPlayer 
                audioUrl={item.audioUrl?.startsWith('http') ? item.audioUrl :`${BASE_URL}/${item.audioUrl}`} 
                isActive={shouldPlay}
                loop={false}
                initialMuted={false}
              />
            )}
          </>
        )}
      </View>

      <View style={[styles.actionBar, item?.caption &&  { marginTop: '11.5%' },]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            if (!isLiking) {
              toggleLike(item._id);
              triggerWiggle();
            }
          }}
          disabled={isLiking}
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
              color={isLiked ? '#FF6B35' : '#64748B'}
              fill={isLiked ? '#FF6B35' : 'none'}
              strokeWidth={2}
            />
          </Animated.View>
          <Text style={styles.actionText}>{item?.likes?.length ? item?.likes?.length:0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Comments', { postId: item?._id })}>
          <Icon name="chatbubble-outline" size={22} color="#64748B" />
          <Text style={styles.actionText}>{item?.comments?.length}</Text>
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
  const [likePending, setLikePending] = useState({});
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
    itemVisiblePercentThreshold: 60,  // was 20; reduces churn
    minimumViewTime: 250,             // must be visible for at least 250ms
    waitForInteraction: true,         // don't fire during initial mount noise
  };

  const lastViewabilityTsRef = useRef(0);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    const now = Date.now();
    if (now - lastViewabilityTsRef.current < 300) return; // throttle window
    lastViewabilityTsRef.current = now;

    // prefer the first actually-viewable item (RN sometimes includes edge cases)
    const first = viewableItems.find(v => v.isViewable);
    if (first?.item?._id) {
      setVisiblePostId(first.item._id);
    }
  }).current;

  const fetchFeed = useCallback(async (cancelToken) => {
    try{
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/posts/feed`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: cancelToken, // axios >=1 uses AbortController
      });
      setPosts(res.data);
    }catch(e){
      if (e.name !== 'CanceledError' && e.name !== 'AbortError') {
        Alert.alert('Error', e?.response?.data?.error || e.message);
      }
    }finally{
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const me = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (mounted) setCurrentUserId(me.data._id);
      } catch (e) {
        if (e.name !== 'CanceledError' && e.name !== 'AbortError') {
          Alert.alert('Error', e?.response?.data?.error || e.message);
        }
      }
      // fetch posts (this will set loading=false in finally)
      await fetchFeed(controller.signal);
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [fetchFeed]);


  const toggleLike = React.useCallback(async (postId) => {
  if (!currentUserId) return;

  // Block re-entrant taps for this post
  setLikePending(prev => ({ ...prev, [postId]: true }));

  // 1) OPTIMISTIC UPDATE
  setPosts(prev =>
    prev.map(p => {
      if (p._id !== postId) return p;
      const alreadyLiked = Array.isArray(p.likes) && p.likes.includes(currentUserId);
      const nextLikes = alreadyLiked
        ? p.likes.filter(id => id !== currentUserId)
        : [...(p.likes || []), currentUserId];
      return { ...p, likes: nextLikes };
    })
  );

  // 2) FIRE API (no full refetch)
  const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.post(
        `${BASE_URL}/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3) (Optional) If backend returns the updated post, merge it for truth
      if (res?.data && res.data._id) {
        const serverPost = res.data; // expect { _id, likes, ... }
        setPosts(prev =>
          prev.map(p => (p._id === postId
            ? { ...p, likes: serverPost.likes ?? p.likes, comments: serverPost.comments ?? p.comments }
            : p))
        );
      }
    } catch (err) {
      // 4) REVERT on failure
      setPosts(prev =>
        prev.map(p => {
          if (p._id !== postId) return p;
          const hadLiked = Array.isArray(p.likes) && p.likes.includes(currentUserId);
          // revert the optimistic flip
          const revertedLikes = hadLiked
            ? p.likes.filter(id => id !== currentUserId)
            : [...(p.likes || []), currentUserId];
          return { ...p, likes: revertedLikes };
        })
      );
      Alert.alert('Error', err?.response?.data?.error || err.message);
    } finally {
      setLikePending(prev => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });
    }
  }, [currentUserId]);

  const renderPost = ({ item,index }) => {
    // if (index === AD_FREQUENCY) return <PawBreakAd />;
    return (
      <>
      {index !== 0 && index % AD_FREQUENCY === 0 && <PawBreakAdMemo />}
      <PostCard
        item={item}
        currentUserId={currentUserId}
        toggleLike={toggleLike}
        navigation={navigation}
        isVisible={item._id === visiblePostId}
        isTabFocused={isTabFocused}
        isLiking={!!likePending[item._id]}
      />
      </>
  )};


  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={[styles.card, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <AppLayout>
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item?._id}
            extraData={visiblePostId}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            removeClippedSubviews
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
            contentContainerStyle={{
              padding: 10,
              paddingBottom: '15%', // 👈 gives room above bottom tab bar
            }}
          />
        </AppLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  caption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 10,
    marginBottom: 14,
    // shadow
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: '#E2E8F0',
  },
  username: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F172A',
    lineHeight: 24,
  },
  timestamp: {
    marginTop: 2,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // evenly but with padding
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
   mediaContainer: {
    width: '100%',
    aspectRatio: 1,
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#E5E7EB',
  },

});

export default HomeScreen;