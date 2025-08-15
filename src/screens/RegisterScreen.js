// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert
// } from 'react-native';
// import axios from 'axios';
// // import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// // const adUnitId = __DEV__
// //   ? TestIds.BANNER
// //   : 'ca-app-pub-3840448955183784~3058700149';

// const RegisterScreen = ({ navigation }) => {
//   const [form, setForm] = useState({
//     username: '',
//     email: '',
//     password: '',
//     gender: '',
//     interests: '',
//     matchGender: 'any'
//   });

//   const handleRegister = async () => {
//     const payload = {
//       username: form.username,
//       password: form.password,
//       email: form.email,
//       gender: form.gender,
//       interests: form.interests.split(',').map(i => i.trim()),
//       matchPreferences: {
//         gender: form.matchGender,
//         interests: form.interests.split(',').map(i => i.trim())
//       }
//     };

//     try {
//       await axios.post('http://192.168.1.100:5000/api/auth/register', payload);
//       Alert.alert('Success', 'Registration successful');
//       navigation.navigate('Login');
//     } catch (err) {
//       Alert.alert('Error', err);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Register</Text>
//       <TextInput style={styles.input} placeholder="Username" onChangeText={v => setForm({ ...form, username: v })} />
//       <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" onChangeText={v => setForm({ ...form, email: v })} />
//       <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={v => setForm({ ...form, password: v })} />
//       <TextInput style={styles.input} placeholder="Gender (male/female/other)" onChangeText={v => setForm({ ...form, gender: v })} />
//       <TextInput style={styles.input} placeholder="Interests (comma-separated)" onChangeText={v => setForm({ ...form, interests: v })} />
//       <TextInput style={styles.input} placeholder="Match Gender Preference (any/male/female)" onChangeText={v => setForm({ ...form, matchGender: v })} />
//       <TouchableOpacity style={styles.button} onPress={handleRegister}>
//         <Text style={styles.buttonText}>Register</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//         <Text style={styles.link}>Already have an account? Login</Text>
//       </TouchableOpacity>
//       {/* <Text>Ad is here not anywhere else</Text>
//       <BannerAd
//         unitId={adUnitId}
//         size={BannerAdSize.FULL_BANNER}
//         requestOptions={{
//           requestNonPersonalizedAdsOnly: true,
//         }}
//         onAdFailedToLoad={(error) => console.error('Ad failed to load:', error)}
//       /> */}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 20, flexGrow: 1, justifyContent: 'center' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//   input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 5, borderRadius: 6 },
//   button: { backgroundColor: '#0066cc', padding: 15, borderRadius: 6, marginTop: 10 },
//   buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
//   link: { marginTop: 15, textAlign: 'center', color: '#0066cc' }
// });

// export default RegisterScreen;

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import axios from 'axios';
// import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { launchImageLibrary } from 'react-native-image-picker';
import { BASE_URL } from '../services/baseUrl';
import PetiLogo from '../assets/PetiLogo.svg';

const MAX_PETS = 5;

// const adUnitId = __DEV__
//   ? TestIds.BANNER
//   : 'ca-app-pub-3840448955183784~3058700149';

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    petname: '',
    username: '',
    email: '',
    password: '',
  });

  const [profileImage, setProfileImage] = useState(null); 
  const [pets, setPets] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const petnameRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  // const genderRef = useRef(null);
  // const interestsRef = useRef(null);
  // const matchGenderRef = useRef(null);

  const validateForm = () => {
  const newErrors = {};
    if (!form.petname.trim()) newErrors.petname = 'Petname is required';
    if (!form.username.trim()) newErrors.username = 'Username is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.password.trim()) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (newErrors.petname) petnameRef.current?.focus();
    else if (newErrors.username) usernameRef.current?.focus();
    else if (newErrors.email) emailRef.current?.focus();
    else if (newErrors.password) passwordRef.current?.focus();

    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async (onPicked) => {
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 1 },
      (res) => {
        if (res.didCancel) return;
        if (res.errorMessage) {
          Alert.alert('Error', res.errorMessage);
          return;
        }
        const asset = res.assets?.[0];
        if (!asset) return;

        // Normalize fields
        const uri = asset.uri?.startsWith('file://') || asset.uri?.startsWith('content://')
          ? asset.uri
          : `file://${asset.uri}`;
        const fileName = asset.fileName || `photo_${Date.now()}.jpg`;
        const type = asset.type || 'image/jpeg';

        onPicked({ uri, fileName, type });
      }
    );
  };

  const handlePickProfile = () => {
    pickImage((img) => setProfileImage(img));
  };

  const handleAddPetPhoto = () => {
    if (pets.length >= MAX_PETS) {
      Alert.alert('Limit reached', `You can add up to ${MAX_PETS} pet photos.`);
      return;
    }
    pickImage((img) => setPets((prev) => [...prev, { ...img, name: '' }]));
  };

  const handleRemovePet = (index) => {
    setPets((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangePetName = (index, name) => {
    setPets((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], name };
      return copy;
    });
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      // Build form-data
      const fd = new FormData();
      fd.append('petname', form.petname);
      fd.append('username', form.username);
      fd.append('email', form.email);
      fd.append('password', form.password);

      if (profileImage) {
        fd.append('profilePicture', {
          uri: profileImage.uri,
          name: profileImage.fileName,
          type: profileImage.type,
        });
      }

      pets.forEach((p, idx) => {
        fd.append('pets', {
          uri: p.uri,
          name: p.fileName || `pet_${idx + 1}.jpg`,
          type: p.type || 'image/jpeg',
        });
        // Keep names aligned by index with the photos
        fd.append('petNames[]', p.name || `Pet ${idx + 1}`);
      });

      const registerRequest = axios.post(`${BASE_URL}/api/auth/register`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 60000)
      );

      await Promise.race([registerRequest, timeout]);

      Alert.alert('Success', 'Registration successful');
      navigation.navigate('Login');
    } catch (err) {
      if (err.message === 'timeout') {
        Alert.alert('Timeout', 'Server took too long to respond, please try again later.');
      } else {
        console.error('Error in registering on frontend:', err);
        Alert.alert('Error', err.response?.data?.error || err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  //100% working code
  // const handleRegister = async () => {
  //   if (!validateForm()) return;

  //   setIsLoading(true);
  //   const payload = {
  //     petname: form.petname,
  //     username: form.username,
  //     password: form.password,
  //     email: form.email
  //   };

  //   try {
  //     const registerRequest = axios.post(`${BASE_URL}/api/auth/register`, payload);
  //     const timeout = new Promise((_, reject) =>
  //       setTimeout(() => reject(new Error('timeout')), 60000)
  //     );

  //     await Promise.race([registerRequest, timeout]);

  //     Alert.alert('Success', 'Registration successful');
  //     navigation.navigate('Login');
  //   } catch (err) {
  //     if (err.message === 'timeout') {
  //       Alert.alert('Timeout', 'Server took too long to respond, please try again later.');
  //     } else {
  //       console.error("Error in registering on frontend:",err);
  //       Alert.alert('Error 1', err.message);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  //100% working code
  // return (
  //   <ScrollView contentContainerStyle={styles.container}>
  //     {/* <Text style={styles.title}>Register</Text> */}
  //     <View style={styles.logoContainer}>
  //       <PetiLogo width={'40%'} />
  //     </View>
  //     <TextInput 
  //       ref={petnameRef}
  //       style={[styles.input, errors.petname && styles.errorInput]}
  //       placeholder="Petname"
  //       placeholderTextColor="#94A3B8"
  //       onChangeText={v => {
  //         setForm({ ...form, petname: v });
  //         if (errors.petname) setErrors({ ...errors, petname: null });
  //       }}
  //     />
  //     {errors.petname && <Text style={styles.errorText}>{errors.petname}</Text>}

  //     <TextInput 
  //       ref={usernameRef}
  //       // style={styles.input} 
  //       style={[styles.input, errors.username && styles.errorInput]}
  //       placeholder="Username" 
  //       placeholderTextColor="#94A3B8"
  //       // onChangeText={v => setForm({ ...form, username: v })} 
  //       onChangeText={v => {
  //         setForm({ ...form, username: v });
  //         if (errors.username) setErrors({ ...errors, username: null });
  //       }}
  //     />
  //     {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
  //     <TextInput 
  //       ref={emailRef}
  //       // style={styles.input} 
  //       style={[styles.input, errors.email && styles.errorInput]}
  //       placeholder="Email" 
  //       placeholderTextColor="#94A3B8"
  //       keyboardType="email-address" 
  //       // onChangeText={v => setForm({ ...form, email: v })} 
  //       onChangeText={v => {
  //         setForm({ ...form, email: v });
  //         if (errors.email) setErrors({ ...errors, email: null });
  //       }}
  //     />
  //     {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
  //     <TextInput 
  //       ref={passwordRef}
  //       // style={styles.input} 
  //       style={[styles.input, errors.password && styles.errorInput]}
  //       placeholder="Password" 
  //       placeholderTextColor="#94A3B8"
  //       secureTextEntry 
  //       // onChangeText={v => setForm({ ...form, password: v })} 
  //       onChangeText={v => {
  //         setForm({ ...form, password: v });
  //         if (errors.password) setErrors({ ...errors, password: null });
  //       }}
  //     />
  //     {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      
      
  //     <TouchableOpacity style={styles.button} onPress={handleRegister}>
  //       <Text style={styles.buttonText}>Register</Text>
  //     </TouchableOpacity>
  //     <TouchableOpacity onPress={() => navigation.navigate('Login')}>
  //       <Text style={styles.linkText}>Already have an account? <Text style={styles.link}>Login</Text></Text>
  //     </TouchableOpacity>
  //     {/* <Text>Ad is here not anywhere else</Text>
  //     <BannerAd
  //       unitId={adUnitId}
  //       size={BannerAdSize.FULL_BANNER}
  //       requestOptions={{
  //         requestNonPersonalizedAdsOnly: true,
  //       }}
  //       onAdFailedToLoad={(error) => console.error('Ad failed to load:', error)}
  //     /> */}
  //     {isLoading && <ActivityIndicator size="large" color="#00d084" style={{ marginTop: 20 }} />}
  //   </ScrollView>
  // );
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <PetiLogo width={'40%'} />
      </View>

      {/* Profile picture */}
      <Text style={styles.sectionTitle}>Profile Picture</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.smallButton} onPress={handlePickProfile}>
          <Text style={styles.buttonText}>Pick Profile</Text>
        </TouchableOpacity>
        {profileImage && (
          <Image source={{ uri: profileImage.uri }} style={styles.thumb} />
        )}
      </View>

      {/* Pet photos */}
      <Text style={styles.sectionTitle}>Your Pets (up to 5)</Text>
      <TouchableOpacity style={styles.smallButton} onPress={handleAddPetPhoto}>
        <Text style={styles.buttonText}>Add Pet Photo</Text>
      </TouchableOpacity>

      {pets.map((p, idx) => (
        <View key={idx} style={styles.petItem}>
          <Image source={{ uri: p.uri }} style={styles.petThumb} />
          <TextInput
            style={styles.petNameInput}
            placeholder={`Pet ${idx + 1} name`}
            placeholderTextColor="#94A3B8"
            value={p.name}
            onChangeText={(v) => handleChangePetName(idx, v)}
          />
          <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemovePet(idx)}>
            <Text style={styles.removeBtnText}>×</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Core fields */}
      {/* <TextInput
        ref={petnameRef}
        style={[styles.input, errors.petname && styles.errorInput]}
        placeholder="Petname"
        placeholderTextColor="#94A3B8"
        onChangeText={v => {
          setForm({ ...form, petname: v });
          if (errors.petname) setErrors({ ...errors, petname: null });
        }}
      />
      {errors.petname && <Text style={styles.errorText}>{errors.petname}</Text>} */}

      <TextInput
        ref={usernameRef}
        style={[styles.input, errors.username && styles.errorInput]}
        placeholder="Username"
        placeholderTextColor="#94A3B8"
        onChangeText={v => {
          setForm({ ...form, username: v });
          if (errors.username) setErrors({ ...errors, username: null });
        }}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

      <TextInput
        ref={emailRef}
        style={[styles.input, errors.email && styles.errorInput]}
        placeholder="Email"
        placeholderTextColor="#94A3B8"
        keyboardType="email-address"
        onChangeText={v => {
          setForm({ ...form, email: v });
          if (errors.email) setErrors({ ...errors, email: null });
        }}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        ref={passwordRef}
        style={[styles.input, errors.password && styles.errorInput]}
        placeholder="Password"
        placeholderTextColor="#94A3B8"
        secureTextEntry
        onChangeText={v => {
          setForm({ ...form, password: v });
          if (errors.password) setErrors({ ...errors, password: null });
        }}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>
          Already have an account? <Text style={styles.link}>Login</Text>
        </Text>
      </TouchableOpacity>

      {isLoading && <ActivityIndicator size="large" color="#00d084" style={{ marginTop: 20 }} />}
    </ScrollView>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#fff', // dark background consistent with login screen
//     justifyContent: 'center',
//     // paddingHorizontal: 30,
//     // paddingVertical: 40,
//   },
//   title: {
//     fontSize: 28,
//     color: '#ffffff',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 30,
//   },
//   input: {
//     // backgroundColor: '#1d2a2d', // dark input box
//     backgroundColor: '#f0ecddff',
//     color: '#ffffff',
//     borderRadius: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     marginBottom: '6%',
//     marginLeft: '7.01%',
//     marginRight: '7.01%',
//   },
//   button: {
//     // backgroundColor: '#00d084',
//     backgroundColor: '#F68532', //Color of the word 'i' on logo -- OG color, Color of the words PET -- 144951 
//     borderRadius: 12,
//     paddingVertical: 15,
//     alignItems: 'center',
//     marginTop: 10,
//     elevation: 3,
//     marginLeft: '7.01%',
//     marginRight: '7.01%'
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   linkText: {
//     // alignItems: 'center',
//     // marginBottom: 20,
//     color:'#144951',
//     textAlign: 'center',
//     marginTop: '3%',
//     fontSize: 14,
//   },
//   link: {
//     // color: '#cccccc',
//     color:'#F68532',
//     textAlign: 'center',
//     marginTop: '10%',
//     fontSize: 14,
//     textDecorationLine: 'underline'
//   },
//   errorInput: {
//     borderWidth: 1,
//     borderColor: 'red',
//   },
//   errorText: {
//     color: 'red',
//     marginBottom: 10,
//     marginLeft: 5,
//     fontSize: 12,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     // marginBottom: 20,
//   },
// });

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, backgroundColor: '#fff', justifyContent: 'center',
  },
  logoContainer: { alignItems: 'center' },
  sectionTitle: {
    marginTop: 16, marginBottom: 8, marginHorizontal: '7.01%',
    fontWeight: '600', color: '#144951',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: '7.01%', marginBottom: 8,
  },
  smallButton: {
    backgroundColor: '#F68532', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14,
    alignItems: 'center', elevation: 3,
  },
  thumb: { width: 48, height: 48, borderRadius: 10, marginLeft: 12 },
  petItem: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: '7.01%', marginBottom: 8,
    backgroundColor: '#f7f7f7', borderRadius: 12, padding: 8,
  },
  petThumb: { width: 56, height: 56, borderRadius: 10, marginRight: 10, backgroundColor: '#eaeaea' },
  petNameInput: {
    flex: 1, backgroundColor: '#f0ecddff', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 8, color: '#111827',
  },
  removeBtn: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center', marginLeft: 8,
  },
  removeBtnText: { color: '#fff', fontSize: 18, lineHeight: 18, fontWeight: '600' },

  input: {
    backgroundColor: '#f0ecddff', color: '#111827',
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16,
    fontSize: 16, marginBottom: '6%', marginLeft: '7.01%', marginRight: '7.01%',
  },
  button: {
    backgroundColor: '#F68532', borderRadius: 12, paddingVertical: 15,
    alignItems: 'center', marginTop: 10, elevation: 3,
    marginLeft: '7.01%', marginRight: '7.01%',
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  linkText: { color: '#144951', textAlign: 'center', marginTop: '3%', fontSize: 14 },
  link: { color: '#F68532', textAlign: 'center', fontSize: 14, textDecorationLine: 'underline' },
  errorInput: { borderWidth: 1, borderColor: 'red' },
  errorText: { color: 'red', marginBottom: 10, marginLeft: 5, fontSize: 12 },
});

export default RegisterScreen;