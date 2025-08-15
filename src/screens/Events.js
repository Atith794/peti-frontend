import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, Image, StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import Video from 'react-native-video';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../services/baseUrl';
import AppLayout from './AppLayout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Events = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, , { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <AppLayout>
        <Text style={styles.eventsText}>No Events for now</Text>
        
      </AppLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    // paddingTop: 20, 
    flex: 1 
  },
  eventsText:{
    color:'#9d9d9dff',
    position: 'absolute',
    justifyContent:'center',
    alignItems: 'center',
    fontSize: 32,
    marginLeft: '15%',
    marginTop: '70%'
  }
});

export default Events;
