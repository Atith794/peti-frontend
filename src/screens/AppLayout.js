// src/components/AppLayout.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PetiLogoCropped4 from '../assets/PetiLogo.svg';

const AppLayout = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
       {/* <View style={[styles.header, { paddingTop: insets.top + 10 }]}> */}
       {/* <View style={styles.logoContainer}> */}
        {/* <PetiLogoCropped4 width={'20%'} /> */}
       {/* </View> */}
       
      <View style={[styles.header]}>
        <Text style={styles.logo}>Peti</Text>
      </View>
      {/* <View style={styles.logoContainer}>
        <PetiLogo width={'20%'} />
      </View> */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

export default AppLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'flex-start',
    paddingBottom: '2.8%',
    paddingTop: '3%',
    paddingLeft: '7.01%',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#fff',
    zIndex: 100,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    fontFamily: 'Poppins-Bold',
  },
  content: {
    flex: 1,
  },
   logoContainer: {
    // alignItems: 'flex-start',
    // marginBottom: 20,
    marginBottom: 0,
    marginTop: 0
  },
});
