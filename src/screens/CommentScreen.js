import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TextInput, Button, StyleSheet, ActivityIndicator, Alert, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../services/baseUrl';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CommentScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { postId } = route.params;
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(res.data.comments || []);
    } catch (err) {
      console.log("Error loading comments:", err);
      Alert.alert('Error', err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/posts/${postId}/comment`, { text: commentText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommentText('');
      fetchComments(); // Refresh
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const renderComment = ({ item }) => (
    <View style={styles.commentCard}>
      <Image
        source={{ uri: `${BASE_URL}/uploads/${item.user.profilePicture}` }}
        style={styles.avatar}
      />
      <View style={styles.commentText}>
        <Text style={styles.username}>{item.user.username}</Text>
        <Text>{item.text}</Text>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={[styles.container,, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Button title="Home" color="green" onPress={() => navigation.goBack()} />
      
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Add a comment..."
          value={commentText}
          onChangeText={setCommentText}
          style={styles.input}
        />
        <Button title="Post" onPress={handleAddComment} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  commentCard: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start'
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10
  },
  commentText: {
    flex: 1
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 2
  },
  inputContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40
  }
});

export default CommentScreen;
