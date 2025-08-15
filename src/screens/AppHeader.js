import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AppHeader() {
  const insets = useSafeAreaInsets();

  return (
    // <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
    <View style={[styles.container]}>
    
      <Text style={styles.title}>Peti</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    // paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    fontFamily: 'Poppins-Bold', // or default font if not loaded
  },
});
