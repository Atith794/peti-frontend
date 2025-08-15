// import React from 'react';
// import { View, Text, StyleSheet, Button } from 'react-native';

// const ChatScreen = ({ route, navigation }) => {
//   const { peer } = route.params;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Chat with {peer.username}</Text>
//       {/* Later you’ll add chat logic here */}
//       <Button title="Home" color="green" onPress={() => navigation.replace('Home')} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   title: { fontSize: 20, fontWeight: 'bold' }
// });

// export default ChatScreen;

import React, { useEffect, useState, useRef } from 'react';
import { Keyboard, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Button, Image, KeyboardAvoidingView, Platform } from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../services/baseUrl';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';
import ImageViewing from 'react-native-image-viewing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppLayout from './AppLayout';
import { Paperclip, Send  } from 'lucide-react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
// import {  } from 'react-native';

const ChatScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { peer } = route.params; // peer: {_id, username, profilePicture}
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const flatListRef = useRef();
  const [visible, setIsVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [kbOpen, setKbOpen] = useState(false);

  useEffect(() => {
    const connectSocket = async () => {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId'); // Store your logged-in user's ID in AsyncStorage during login

      const newSocket = io(BASE_URL, {
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        newSocket.emit('register', userId);
      });

      newSocket.on('receive-message', (message) => {
        if (message.from === peer._id) {
          setMessages((prev) => [...prev, message]);
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    };

    connectSocket();
  }, [peer]);

  useEffect(() => {
    const fetchMessages = async () => {
        try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await axios.get(`${BASE_URL}/api/messages/${userId}/${peer._id}`);
        setMessages(response.data);
        } catch (error) {
        console.error('Failed to load chat history:', error);
        }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
   const show = Keyboard.addListener('keyboardDidShow', () => setKbOpen(true));
   const hide = Keyboard.addListener('keyboardDidHide', () => setKbOpen(false));
   return () => {
     show.remove();
     hide.remove();
   };
 }, []);

  const handleSend = async () => {
    if (!text.trim()) return;

    const userId = await AsyncStorage.getItem('userId');

    const message = {
      to: peer._id,
      from: userId,
      text,
    };
    console.log("Message:",message);
    socket.emit('send-message', message);
    setMessages((prev) => [...prev, { ...message, timestamp: new Date() }]);
    setText('');
  };

  const handleMediaSend = async () => {
    const userId = await AsyncStorage.getItem('userId');

    launchImageLibrary({ mediaType: 'mixed' }, async (response) => {
        if (response.didCancel || !response.assets || response.errorCode) return;

        const asset = response.assets[0];
        const formData = new FormData();
        formData.append('sender', userId);
        formData.append('recipient', peer._id);
        formData.append('mediaType', asset.type.startsWith('image') ? 'image' : 'video');
        formData.append('media', {
        uri: asset.uri,
        type: asset.type,
        name: asset.fileName
        });

        try {
        // const res = await axios.post(`${BASE_URL}/api/messages/upload-chat-media`, formData, {
        const res = await axios.post(`${BASE_URL}/api/messages/upload`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        });
        setMessages(prev => [...prev, res.data]);
        } catch (err) {
        console.error('Upload failed:', err);
        }
    });
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.from === peer._id ? styles.left : styles.right]}>
      {/* <AppLayout> */}


      {/* <Text>{item.text}</Text> */}
      {item.text ? <Text>{item.text}</Text> : null}
      {/* {item?.mediaType === 'image' && (
        <Image source={{ uri: `${BASE_URL}/uploads/${item.mediaUrl}` }} style={{ width: 200, height: 200 }} />
      )} */}

      {item?.mediaType === 'image' && (
        <TouchableOpacity onPress={() => {
            setSelectedImageUri(`${BASE_URL}/uploads/${item.mediaUrl}`);
            setIsVisible(true);
        }}>
            <Image
            source={{ uri: `${BASE_URL}/uploads/${item.mediaUrl}` }}
            style={{ width: 200, height: 200 }}
            />
        </TouchableOpacity>
      )}

      {item?.mediaType === 'video' && (
        <Video
            source={{ uri: `${BASE_URL}/uploads/${item.mediaUrl}` }}
            style={{ width: 200, height: 200 }}
            controls
        />
      )}
      {/* </AppLayout> */}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ 
        flex: 1, 
        paddingTop: insets.top, 
        // paddingBottom: tabBarHeight
        // paddingBottom: insets.bottom 
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? tabBarHeight : 0} // adjust if header is overlapping
    >
       
    {/* <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}> */}
      <AppLayout>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={{ paddingBottom: 8 }}
      />
      
      <View style={styles.inputContainer}> 
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Message"
          placeholderTextColor="#7b7b7bff"
        />
        <TouchableOpacity onPress={handleMediaSend} style={styles.sendButton}>
            {/* <Text style={{ fontSize: 20 }}>📎</Text> */}
          <Paperclip style={{fontSize: 14, color: 'white'}}/>

        </TouchableOpacity>
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          {/* <Text style={{ Size:'14px', color:'white' }}>Send</Text> */}
          <Send style={{fontSize: 14, color: 'white'}}/>
        </TouchableOpacity>
      </View>
      <ImageViewing
        images={[{ uri: selectedImageUri }]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
      </AppLayout>
    {/* </View> */}
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  messageBubble: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    maxWidth: '70%',
  },
  left: { backgroundColor: '#e5e5e5', alignSelf: 'flex-start' },
  right: { backgroundColor: '#cce5ff', alignSelf: 'flex-end' },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingBottom: '30%',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    color:'black',
    borderColor:'#d2d2d2ff'
  },
  sendButton: {
    backgroundColor: '#95a7baff',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    margin: "0.6%"
  },
});
