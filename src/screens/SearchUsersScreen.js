import React, { useState } from 'react';
import {
  View, TextInput, FlatList, Text, TouchableOpacity,
  Image, StyleSheet, ActivityIndicator, Alert, Button
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../services/baseUrl';
import AppLayout from './AppLayout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SearchUsersScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState({}); // tracks follow button states
  const insets = useSafeAreaInsets();

  const searchUsers = async () => {
    if (!query.trim()) return;

    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    try {
      const res = await axios.get(`${BASE_URL}/api/users/search?username=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error in Search users:")
      Alert.alert('Error22:', err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (userId, isFollowing) => {
    const token = await AsyncStorage.getItem('token');
    const endpoint = isFollowing ? 'unfollow' : 'follow';

    setFollowLoading(prev => ({ ...prev, [userId]: true }));

    try {
      await axios.post(`${BASE_URL}/api/users/${userId}/${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local follow status
      setUsers(prev =>
        prev.map(user =>
          user._id === userId
            ? { ...user, isFollowing: !isFollowing }
            : user
        )
      );
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.error || err.message);
    } finally {
      setFollowLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const startChat = (user) => {
    navigation.navigate('Home', {
      screen: 'Chat',
      params: { peer: user, peerSocketId: null },
    });
    // navigation.navigate('Chat', {
    //   peer: user,
    //   peerSocketId: null, // You can update this if using sockets
    // });
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>

      <Image
        source={{ uri: `${BASE_URL}/uploads/${item.profilePicture}` }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.followBtn}
            onPress={() => toggleFollow(item._id, item.isFollowing)}
            disabled={followLoading[item._id]}
          >
            <Text style={{ color: 'white' }}>
              {item.isFollowing ? 'Unfollow' : 'Follow'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.messageBtn}
            onPress={() => startChat(item)}
          >
            <Text>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <AppLayout>

      <TextInput
        placeholder="Search"
        placeholderTextColor="#94A3B8"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={searchUsers}
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderUser}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      </AppLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    // padding: 15, 
    flex: 1 
  },
  input: {
    padding: '3%',
    borderWidth: 0.5,
    borderRadius: 10,
    marginBottom: '10%',
    marginLeft:'7.01%',
    marginRight:'7.01%',
    marginTop: '7.01%',
    color: '#090a0aff'
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '3%',
    marginBottom: '3%',
    marginLeft:'7.01%',
    marginRight:'7.01%',
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  avatar: {
    width: '17%', 
    height: '100%', 
    borderRadius: 25, 
    marginRight: '3%',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: '3%',
    gap: 10,
  },
  followBtn: {
    backgroundColor: '#F68532',
    paddingHorizontal: '9%',
    paddingVertical: '2.5%',
    borderRadius: 6,
  },
  messageBtn: {
    backgroundColor: '#ccc',
    paddingHorizontal: '7.01%',
    paddingVertical: '2.5%',
    borderRadius: 6,
  },
});

export default SearchUsersScreen;
