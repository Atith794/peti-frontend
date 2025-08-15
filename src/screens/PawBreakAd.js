// components/PawBreakAd.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import  { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// const BANNER_UNIT_ID = __DEV__ ? TestIds.BANNER : 'ca-app-pub-3840448955183784~3058700149'; // replace in prod
const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-3840448955183784~3058700149';

export default function PawBreakAd() {
  return (
    // <View style={styles.card} accessible accessibilityRole="banner">
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.sponsored}>Sponsored</Text>
        <Text style={styles.brand}>Peti Ads</Text>
      </View>
      <View style={styles.adBox}>
        {/* <BannerAd 
            unitId={BANNER_UNIT_ID} 
            size={BannerAdSize.FULL_BANNER} 
            requestOptions={{
             requestNonPersonalizedAdsOnly: true,
            }}
            onAdFailedToLoad={(error) => console.error('Ad failed to load:', error)}
        /> */}
        <BannerAd
           unitId={adUnitId}
           size={BannerAdSize.MEDIUM_RECTANGLE}
           requestOptions={{
             requestNonPersonalizedAdsOnly: true,
           }}
           onAdFailedToLoad={(error) => console.error('Ad failed to load:', error)}
         />
      </View>
      <Text style={styles.note}>Ad keeps Peti free ❤️</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  sponsored: { fontSize: 12, color: '#64748B' },
  brand: { fontSize: 12, color: '#94A3B8' },
  adBox: { 
    // borderRadius: 12, 
    // overflow: 'hidden' 
    alignItems: 'center',
    marginTop: 30,
  },
  note: { fontSize: 12, color: '#94A3B8', marginTop: 6, textAlign: 'center' },
});
