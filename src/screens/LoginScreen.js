// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// const adUnitId = __DEV__
//   ? TestIds.BANNER
//   : 'ca-app-pub-3840448955183784~3058700149';

// const LoginScreen = ({ navigation }) => {
//   const [form, setForm] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');

//   const handleLogin = async () => {
//     try {
//       const res = await axios.post('http://192.168.1.100:5000/api/auth/login', form);
//       await AsyncStorage.setItem('token', res.data.token);
//         navigation.replace('Profile');
//       // navigation.replace('Welcome');
//     } catch (err) {
//       Alert.alert('Login failed', err);
//       console.log("Error:",err);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>
//       <TextInput style={styles.input} placeholder="Username" onChangeText={v => setForm({ ...form, username: v })} />
//       <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={v => setForm({ ...form, password: v })} />
//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Login</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.navigate('Register')}>
//         <Text style={styles.link}>Don't have an account? Register</Text>
//       </TouchableOpacity>
//       {/* <View style={styles.adContainer}> */}

//          <BannerAd
//            unitId={adUnitId}
//            size={BannerAdSize.FULL_BANNER}
//            requestOptions={{
//              requestNonPersonalizedAdsOnly: true,
//            }}
//            onAdFailedToLoad={(error) => console.error('Ad failed to load:', error)}
//          />
//        {/* </View> */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 20, flex: 1, justifyContent: 'center' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//   input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 5, borderRadius: 6 },
//   button: { backgroundColor: '#28a745', padding: 15, borderRadius: 6, marginTop: 10 },
//   buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
//   link: { marginTop: 15, textAlign: 'center', color: '#0066cc' },
//   adContainer: { alignItems: 'center'}
// });

// // const styles = StyleSheet.create({
// //   container: {
// //     minHeight: '100%',
// //     backgroundColor: '#0F111D',
// //     display: 'flex',
// //     flexDirection: 'column',
// //     alignItems: 'center',
// //     paddingTop: 60,
// //     paddingHorizontal: 20,
// //   },
// //   icon: {
// //     fontSize: 40,
// //     marginBottom: 10,
// //   },
// //   subtitle: {
// //     color: '#9ca3af',
// //     fontSize: 16,
// //     marginBottom: 20,
// //   },
// //   title: {
// //     fontSize: 36,
// //     fontWeight: 'bold',
// //     marginBottom: 30,
// //     color: '#fff',
// //   },
// //   form: {
// //     width: '100%',
// //     maxWidth: 320,
// //     display: 'flex',
// //     flexDirection: 'column',
// //     gap: 15,
// //   },
// //   input: {
// //     backgroundColor: '#1F2430',
// //     borderRadius: 12,
// //     padding: 14,
// //     fontSize: 16,
// //     color: '#fff',
// //     marginBottom: 15,
// //   },
// //   button: {
// //     backgroundColor: '#a5a1c6',
// //     borderRadius: 16,
// //     padding: 14,
// //     alignItems: 'center',
// //     marginTop: 10,
// //   },
// //   buttonText: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     color: '#000',
// //   },
// //   error: {
// //     color: '#f87171',
// //     marginBottom: 10,
// //   },
// //   registerText: {
// //     marginTop: 30,
// //     color: '#9ca3af',
// //     fontSize: 14,
// //   },
// //   registerLink: {
// //     marginTop: 4,
// //     color: '#fff',
// //     textDecorationLine: 'underline',
// //     fontWeight: 'bold',
// //   },
// // });

// export default LoginScreen;

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { BASE_URL } from '../services/baseUrl.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppLayout from './AppLayout.js';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// @ts-ignore
import PetiLogo from '../assets/PetiLogo.svg';


const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-3840448955183784~3058700149';

const LoginScreen = ({ navigation }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const insets = useSafeAreaInsets();

  const validateForm = () => {
  const newErrors = {};
  if (!form.username.trim()) newErrors.username = 'Username is required';
  if (!form.password.trim()) newErrors.password = 'Password is required';
  setErrors(newErrors);

  // Focus on first invalid field
  if (newErrors.username) {
    usernameRef.current?.focus();
  } else if (newErrors.password) {
    passwordRef.current?.focus();
  }

  return Object.keys(newErrors).length === 0;
};

  const handleLogin = async () => {
  // Sync autofilled values
  const username = usernameRef.current?._lastNativeText || form.username;
  const password = passwordRef.current?._lastNativeText || form.password;

  const newForm = { username, password };
  setForm(newForm);

  const newErrors = {};
  if (!username.trim()) newErrors.username = 'Username is required';
  if (!password.trim()) newErrors.password = 'Password is required';
  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    if (newErrors.username) usernameRef.current?.focus();
    else if (newErrors.password) passwordRef.current?.focus();
    return;
  }

  setIsLoading(true);
  try {
    const loginRequest = axios.post(`${BASE_URL}/api/auth/login`, newForm);
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 60000)
    );

    const res = await Promise.race([loginRequest, timeout]);
    if (!res.data?.token) throw new Error('Invalid login response');
    // console.log('jwtDecode:', jwtDecode);

    // const decoded = jwtDecode(res.data.token);
    await AsyncStorage.setItem('token', res.data.token);
    await AsyncStorage.setItem('userId', res.data.userId);
    // navigation.replace('Profile');
    navigation.replace('MainTabs');
  } catch (err) {
      if (err.message === 'timeout') {
        Alert.alert('Timeout', 'Server took too long to respond.');
      } else {
        console.error("Error on Login frontend:",err);
        Alert.alert('Login failed', err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* <AppLayout> */}
      {/* <Text style={styles.title}>Peti</Text> */}
      <View style={styles.logoContainer}>
        <PetiLogo width={'40%'} />
      </View>
      <TextInput 
        ref={usernameRef}
        style={[styles.input, errors.username && styles.errorInput]}
        placeholder="Username" 
        placeholderTextColor="#94A3B8"
        autoComplete="username"
        onChangeText={v => {
          setForm({ ...form, username: v });
          if (errors.username) setErrors({ ...errors, username: null });
        }}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
      <View style={styles.passwordContainer}>
        <TextInput
          ref={passwordRef}
          style={[
            styles.input,
            styles.passwordInput,
            errors.password && styles.errorInput,
          ]}
          placeholder="Password"
          placeholderTextColor="#94A3B8"
          secureTextEntry={!showPassword}
          value={form.password}
          onChangeText={v => {
            setForm({ ...form, password: v });
            if (errors.password) setErrors({ ...errors, password: null });
          }}
        />
        {form.password.length > 0 && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(prev => !prev)}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#ccc"
            />
          </TouchableOpacity>
        )}
      </View>
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        {/* <Text style={styles.link}>Don't have an account? Register</Text> */}
        <Text style={styles.linkText}>Don't have an account? <Text style={styles.link}>Register</Text></Text>
      </TouchableOpacity>
      {/* <View style={styles.adContainer}>

         <BannerAd
           unitId={adUnitId}
           size={BannerAdSize.FULL_BANNER}
           requestOptions={{
             requestNonPersonalizedAdsOnly: true,
           }}
           onAdFailedToLoad={(error) => console.error('Ad failed to load:', error)}
         />
       </View> */}
       {isLoading && <ActivityIndicator size="large" color="#00d084" style={{ marginTop: 20 }} />}
       {/* </AppLayout> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.95,
    backgroundColor: '#fff', // dark background tone
    justifyContent: 'center',
    // paddingHorizontal: 30,
  },
  title: {
    fontSize: 40,
    color: '#F68532',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#f0ecddff',
    // color: '#0c0c0cff',
    color:'#144951',
    borderRadius: 12,
    paddingVertical: '4%',
    paddingHorizontal: '5%',
    fontSize: 16,
    marginBottom: '5%',
    marginLeft: '7.01%',
    marginRight: '7.01%',
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
  linkText: {
    // alignItems: 'center',
    // marginBottom: 20,
    color:'#144951',
    textAlign: 'center',
    marginTop: '3%',
    fontSize: 14,
  },
  link: {
    // color: '#cdbcbcff',
    color:'#F68532',
    textAlign: 'center',
    marginTop: '10%',
    fontSize: 14,
    textDecorationLine: 'underline'
  },
  adContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 5,
    fontSize: 12,
  },
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    // paddingRight: 45, // space for icon
    color: '#0c0c0cff',
  },
  eyeIcon: {
    position: 'absolute',
    right: '12%',
    top: '21%',
  },
  logoContainer: {
    alignItems: 'center',
    // marginBottom: 20,
  },
});

export default LoginScreen;