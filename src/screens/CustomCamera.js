// import React, { useEffect, useRef, useState } from 'react';
// import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
// import { Camera, useCameraDevice } from 'react-native-vision-camera';
// import { useNavigation } from '@react-navigation/native';

// const CustomCamera = () => {
//   const navigation = useNavigation();
//   const cameraRef = useRef(null);
//   // const devices = useCameraDevices();
//   const device = useCameraDevice('back');
//   // const device = devices.back;
//   const [hasPermission, setHasPermission] = useState(false);

//   useEffect(() => {
//     const requestPermissions = async () => {
//       const cameraPermission = await Camera.requestCameraPermission();
//       const micPermission = await Camera.requestMicrophonePermission();
//       setHasPermission(
//         cameraPermission === 'authorized' && micPermission === 'authorized'
//       );
//     };
//     requestPermissions();
//   }, []);

//   useEffect(() => {
//     Camera.requestCameraPermission();
//     Camera.requestMicrophonePermission();
//   }, []);

//   const takePhoto = async () => {
//     if (cameraRef.current) {
//       const photo = await cameraRef.current.takePhoto();
//       navigation.navigate('AddPostScreen', { photo });
//     }
//   };

//   if (!device || !hasPermission) return <View style={styles.loading} />;

//   return (
//     <View style={styles.container}>
//       <Camera
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//         photo={true}
//         pixelFormat="yuv"
//         ref={cameraRef}
//       />
//       {/* <Camera
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//       /> */}
//       <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
//         <Text style={{ color: '#fff', fontSize: 16 }}>📷</Text>
//         {/* <Text>📷</Text> */}
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'black' },
//   loading: { flex: 1, backgroundColor: 'black' },
//   captureButton: {
//     position: 'absolute',
//     bottom: 40,
//     alignSelf: 'center',
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     padding: 20,
//     borderRadius: 50,
//   },
// });

// export default CustomCamera;

// import React, { useEffect, useRef, useState } from 'react';
// import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
// import { Camera, useCameraDevice } from 'react-native-vision-camera';
// import { useNavigation } from '@react-navigation/native';

// const CustomCamera = () => {
//   const navigation = useNavigation();
//   const cameraRef = useRef(null);
//   const device = useCameraDevice('back');
//   const [hasPermission, setHasPermission] = useState(false);

//   useEffect(() => {
//     const requestPermissions = async () => {
//       const cameraPermission = await Camera.requestCameraPermission();
//       const micPermission = await Camera.requestMicrophonePermission();
//       console.log(`Camera permission: ${cameraPermission}`);
//       console.log(`Microphone permission: ${micPermission}`);
//       setHasPermission(
//         cameraPermission === 'authorized' && micPermission === 'authorized'
//       );
//     };
//     requestPermissions();
//   }, []);

//   useEffect(() => {
//     console.log(`hasPermission changed: ${hasPermission}`);
//   }, [hasPermission]);

//   const takePhoto = async () => {
//     console.log('takePhoto called');
//     if (cameraRef.current) {
//       console.log('cameraRef is not null');
//       const photo = await cameraRef.current.takePhoto();
//       navigation.navigate('AddPostScreen', { photo });
//     }
//   };

//   console.log(`Device: ${device}`);
//   console.log(`hasPermission: ${hasPermission}`);

//   if (!device || !hasPermission) return <View style={styles.loading} />;

//   return (
//     <View style={styles.container}>
//       <Camera
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//         ref={cameraRef}
//       />
//       <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
//         <Text style={{ color: '#fff', fontSize: 16 }}>📷</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'black' },
//   loading: { flex: 1, backgroundColor: 'black' },
//   captureButton: {
//     position: 'absolute',
//     bottom: 40,
//     alignSelf: 'center',
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     padding: 20,
//     borderRadius: 50,
//   },
// });

// export default CustomCamera;

// import React, { useEffect, useRef, useState } from 'react';
// import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
// import { Camera, useCameraDevice } from 'react-native-vision-camera';
// import { useNavigation } from '@react-navigation/native';

// const CustomCamera = () => {
//   const navigation = useNavigation();
//   const cameraRef = useRef(null);
//   const device = useCameraDevice('back');
//   const [cameraPermission, setCameraPermission] = useState(null);
//   const [micPermission, setMicPermission] = useState(null);

//   useEffect(() => {
//     const requestPermissions = async () => {
//       const cameraPerm = await Camera.requestCameraPermission();
//       const micPerm = await Camera.requestMicrophonePermission();
//       setCameraPermission(cameraPerm);
//       setMicPermission(micPerm);
//     };
//     requestPermissions();
//   }, []);

//   console.log('Device:', device);
//   console.log('Camera permission:', cameraPermission);
//   console.log('Mic permission:', micPermission)

//   const takePhoto = async () => {
//     if (cameraRef.current) {
//       try {
//         const photo = await cameraRef.current.takePhoto();
//         navigation.navigate('AddPostScreen', { photo });
//       } catch (error) {
//         console.error('Error taking photo:', error);
//       }
//     }
//   };

//   if (!device || cameraPermission !== 'authorized' || micPermission !== 'authorized') {
//     return <View style={styles.loading} />;
//   }

//   return (
//     <View style={styles.container}>
//       <Camera
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//         ref={cameraRef}
//       />
//       <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
//         <Text style={{ color: '#fff', fontSize: 16 }}>📷</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'black' },
//   loading: { flex: 1, backgroundColor: 'red' },
//   captureButton: {
//     position: 'absolute',
//     bottom: 40,
//     alignSelf: 'center',
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     padding: 20,
//     borderRadius: 50,
//   },
// });

// export default CustomCamera;

//Working Code
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Video, Square, Circle, Zap, ZapOff, Repeat2 ,Camera as CamIcon } from 'lucide-react-native';

const CustomCamera = () => {
  const navigation = useNavigation();
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimer = useRef(null);
  const [flash, setFlash] = useState('off'); // 'on' | 'off'
  const [cameraPosition, setCameraPosition] = useState('back'); // 'back' or 'front'
  // const device = useCameraDevice(cameraPosition);
  const [device, setDevice] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [micPermission, setMicPermission] = useState(null);
  const [loading, setLoading] = useState(true);
  const MAX_RECORDING_DURATION = 10; // in seconds
  // useEffect(() => {
  //   const requestPermissions = async () => {
  //     const cameraPerm = await Camera.requestCameraPermission();
  //     const micPerm = await Camera.requestMicrophonePermission();
  //     setCameraPermission(cameraPerm);
  //     setMicPermission(micPerm);
  //     setLoading(false);
  //   };
  //   requestPermissions();
  // }, []);
  useEffect(() => {
    const requestPermissions = async () => {
      const cameraPerm = await Camera.requestCameraPermission();
      const micPerm = await Camera.requestMicrophonePermission();
      setCameraPermission(cameraPerm);
      setMicPermission(micPerm);
      // console.log("cameraPerm:",cameraPerm)
      if (cameraPerm === 'granted') {
        // const availableDevices = await Camera.getAvailableCameraDevices();
        const availableDevices = Camera.getAvailableCameraDevices();

        const selected = availableDevices.find((d) => d.position === cameraPosition);
        console.log("selected:",selected)
        setDevice(selected);
        // setDevice(useCameraDevice(cameraPosition));

      }

      setLoading(false);
    };

    requestPermissions();
  }, []);

  if (!device ) {
    // return <View style={styles.loading} />;
    return (
      <View style={styles.loading}>
        {console.log("Cam device in loader:",device)}
        <Text style={{ color: 'black',fontSize: 100 }}>Device is not yet detected.</Text>
      </View>
    );
  }

  const flipCamera = async () => {
    const newPosition = cameraPosition === 'back' ? 'front' : 'back';
    setCameraPosition(newPosition);

    // const devices = await Camera.getAvailableCameraDevices();
    const devices = Camera.getAvailableCameraDevices();

    const newDevice = devices.find((d) => d.position === newPosition);
    setDevice(newDevice);
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto({ flash });
        // navigation.navigate('AddPostScreen', { photo });
        navigation.navigate('EditMediaScreen', { photo });
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true); // ✅ Set first
        setRecordingDuration(0);

        await cameraRef.current.startRecording({
          flash,
          onRecordingFinished: (video) => {
            clearInterval(recordingTimer.current);
            setIsRecording(false);
            // navigation.navigate('AddPost', { video });
            navigation.navigate('EditMediaScreen', { video })
            // navigation.navigate('MainTabs', {
            //   screen: 'AddPost',
            //   params: { video },
            // });
          },
          onRecordingError: (error) => {
            clearInterval(recordingTimer.current);
            setIsRecording(false);
            console.error('Recording error:', error);
          },
        });

        // ✅ Start timer AFTER recording has started
        recordingTimer.current = setInterval(() => {
          setRecordingDuration((prev) => {
            const next = prev + 1;
            if (next >= MAX_RECORDING_DURATION) {
              clearInterval(recordingTimer.current);
              stopRecording(); // ✅ Now it will work
            }
            return next;
          });
        }, 1000);

      } catch (err) {
        console.error('Failed to start recording:', err);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(false);
        clearInterval(recordingTimer.current);
        await cameraRef.current.stopRecording();
      } catch (err) {
        console.error('Failed to stop recording:', err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        ref={cameraRef}
        photo={true}
        flash={flash}
        video={true}
        audio={true} 
      />
      {/* <View style={styles.buttonsContainer}> */}
        <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
          {/* <Text style={{ color: '#fff', fontSize: 16 }}>Click</Text> */}
          {/* <Icon name="camera" size={30} color="#fff" /> */}
          <CamIcon color="#fff"/>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
            <Turntable style={{fontSize: 14, color: 'white'}}/>
        </TouchableOpacity> */}

        {isRecording && recordingDuration < MAX_RECORDING_DURATION ? (
          <TouchableOpacity onPress={stopRecording} style={styles.recordStopButton}>
            {/* <Text style={{ color: '#fff' }}>⏹ Stop</Text> */}
            <Square style={{ color: '#ff0000ff' }}/>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={startRecording} style={styles.recordButton}>
            {/* <Text style={{ color: '#fff' }}>🎬 Record</Text> */}
            {/* <Icon name="video-camera" size={50} color="#fff" /> */}
            {/* <Video color="#fff"/> */}
            <Circle style={{ color: '#fff' }}/>
          </TouchableOpacity>
        )}
        {isRecording && (
          <Text style={styles.timer}>
            {recordingDuration}s / {MAX_RECORDING_DURATION}s
          </Text>
        )}
      {/* </View> */}
      <TouchableOpacity
        onPress={() => setFlash((prev) => (prev === 'off' ? 'on' : 'off'))}
        style={styles.flashButton}
      >
        {cameraPosition === 'back' ? <Text style={{ color: '#fff' }}>
          {console.log('Flash:',flash)}
          {flash === 'off' ?<ZapOff  style={{ color: '#fff' }}/> : <Zap  style={{ color: '#fff' }}/> }
        </Text>:''}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={flipCamera} style={styles.switchCameraButton}>
        {/* <Text style={{ color: '#fff' }}>Flip</Text> */}
        <Repeat2 style={{ color: '#fff' }}/>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor: 'red'  },
  captureButton: {
    position: 'absolute',
    bottom: '10%',
    alignSelf: 'left',
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 20,
    borderRadius: 50,
    marginLeft: '25%'
  },
  flashButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderRadius: 8,
  },
  switchCameraButton: {
    position: 'absolute',
    top: 50,
    left: 30,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderRadius: 8,
  },
  recordStopButton: {
    position: 'absolute',
    // bottom: 110,
    bottom: '10%',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 50,
    marginLeft: '25%'
  },
  recordButton: {
    position: 'absolute',
    // bottom: 110,
    bottom: '10%',
    alignSelf: 'center',
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 50,
    marginLeft: '25%'
  },
  timer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    color: 'white',
    fontSize: 18,
  }
});

export default CustomCamera;

// import React, { useEffect, useRef, useState } from 'react';
// import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
// import { Camera, useCameraDevice } from 'react-native-vision-camera';
// import { useNavigation } from '@react-navigation/native';
// import { Surface } from 'gl-react-native';
// import GL from 'gl-react';

// const shaders = GL.Shaders.create({
//   sepia: {
//     frag: `precision highp float;
//     varying vec2 uv;
//     uniform sampler2D camera;
//     void main () {
//       vec4 c = texture2D(camera, uv);
//       float r = dot(c.rgb, vec3(0.393, 0.769, 0.189));
//       float g = dot(c.rgb, vec3(0.349, 0.686, 0.168));
//       float b = dot(c.rgb, vec3(0.272, 0.534, 0.131));
//       gl_FragColor = vec4(r, g, b, c.a);
//     }`
//   }
// });

// const SepiaFilter = GL.createComponent(
//   ({ children }) => <GL.Node shader={shaders.sepia} uniforms={{ camera: children }} />,
//   { displayName: 'SepiaFilter' }
// );

// const CustomCamera = () => {
//   const navigation = useNavigation();
//   const cameraRef = useRef(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingDuration, setRecordingDuration] = useState(0);
//   const recordingTimer = useRef(null);
//   const [flash, setFlash] = useState('off');
//   const [cameraPosition, setCameraPosition] = useState('back');
//   const device = useCameraDevice(cameraPosition);
//   const [cameraPermission, setCameraPermission] = useState(null);
//   const [micPermission, setMicPermission] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const MAX_RECORDING_DURATION = 10;

//   useEffect(() => {
//     const requestPermissions = async () => {
//       const cameraPerm = await Camera.requestCameraPermission();
//       const micPerm = await Camera.requestMicrophonePermission();
//       setCameraPermission(cameraPerm);
//       setMicPermission(micPerm);
//       setLoading(false);
//     };
//     requestPermissions();
//   }, []);

//   if (!device) return <View style={styles.loading} />;

//   const takePhoto = async () => {
//     if (cameraRef.current) {
//       try {
//         const photo = await cameraRef.current.takePhoto({ flash });
//         navigation.navigate('AddPostScreen', { photo });
//       } catch (error) {
//         console.error('Error taking photo:', error);
//       }
//     }
//   };

//   const startRecording = async () => {
//     if (cameraRef.current) {
//       try {
//         setIsRecording(true);
//         setRecordingDuration(0);

//         await cameraRef.current.startRecording({
//           flash,
//           onRecordingFinished: (video) => {
//             clearInterval(recordingTimer.current);
//             setIsRecording(false);
//             navigation.navigate('AddPostScreen', { video });
//           },
//           onRecordingError: (error) => {
//             clearInterval(recordingTimer.current);
//             setIsRecording(false);
//             console.error('Recording error:', error);
//           }
//         });

//         recordingTimer.current = setInterval(() => {
//           setRecordingDuration((prev) => {
//             const next = prev + 1;
//             if (next >= MAX_RECORDING_DURATION) {
//               clearInterval(recordingTimer.current);
//               stopRecording();
//             }
//             return next;
//           });
//         }, 1000);

//       } catch (err) {
//         console.error('Failed to start recording:', err);
//       }
//     }
//   };

//   const stopRecording = async () => {
//     if (cameraRef.current) {
//       try {
//         setIsRecording(false);
//         clearInterval(recordingTimer.current);
//         await cameraRef.current.stopRecording();
//       } catch (err) {
//         console.error('Failed to stop recording:', err);
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Surface style={StyleSheet.absoluteFill}>
//         <SepiaFilter>
//           <Camera
//             style={StyleSheet.absoluteFill}
//             device={device}
//             isActive={true}
//             ref={cameraRef}
//             photo={true}
//             flash={flash}
//             video={true}
//             audio={true}
//           />
//         </SepiaFilter>
//       </Surface>

//       <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
//         <Text style={{ color: '#fff', fontSize: 16 }}>📷</Text>
//       </TouchableOpacity>

//       {isRecording && recordingDuration < MAX_RECORDING_DURATION ? (
//         <TouchableOpacity onPress={stopRecording} style={styles.recordButton}>
//           <Text style={{ color: '#fff' }}>⏹ Stop</Text>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity onPress={startRecording} style={styles.recordButton}>
//           <Text style={{ color: '#fff' }}>🎬 Record</Text>
//         </TouchableOpacity>
//       )}

//       {isRecording && (
//         <Text style={styles.timer}>{recordingDuration}s / {MAX_RECORDING_DURATION}s</Text>
//       )}

//       <TouchableOpacity onPress={() => setFlash((prev) => (prev === 'off' ? 'on' : 'off'))} style={styles.flashButton}>
//         {cameraPosition === 'back' && (
//           <Text style={{ color: '#fff' }}>{flash === 'off' ? 'Flash Off' : 'Flash On'}</Text>
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => setCameraPosition((prev) => (prev === 'back' ? 'front' : 'back'))} style={styles.switchCameraButton}>
//         <Text style={{ color: '#fff' }}>Flip</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'black' },
//   loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   captureButton: {
//     position: 'absolute',
//     bottom: 40,
//     alignSelf: 'center',
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     padding: 20,
//     borderRadius: 50
//   },
//   flashButton: {
//     position: 'absolute',
//     top: 50,
//     right: 30,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     padding: 10,
//     borderRadius: 8
//   },
//   switchCameraButton: {
//     position: 'absolute',
//     top: 50,
//     left: 30,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     padding: 10,
//     borderRadius: 8
//   },
//   recordButton: {
//     position: 'absolute',
//     bottom: 110,
//     alignSelf: 'center',
//     backgroundColor: 'red',
//     padding: 20,
//     borderRadius: 50
//   },
//   timer: {
//     position: 'absolute',
//     top: 50,
//     alignSelf: 'center',
//     color: 'white',
//     fontSize: 18
//   }
// });

// export default CustomCamera;
