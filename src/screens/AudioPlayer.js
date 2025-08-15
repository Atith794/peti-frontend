// import Sound from 'react-native-sound';
// import { useEffect, useRef } from 'react';
// import { Text, View } from 'react-native';

// const AudioPlayer = ({ audioUrl }) => {
//   const soundRef = useRef(null);

//   useEffect(() => {
//     Sound.setCategory('Playback');
//     const sound = new Sound(audioUrl, null, (error) => {
//       if (error) {
//         console.log('Failed to load sound', error);
//         return;
//       }
//       sound.play((success) => {
//         if (!success) {
//           console.log('Sound playback failed');
//         }
//       });
//     });

//     soundRef.current = sound;

//     return () => {
//       soundRef.current?.release();
//     };
//   }, [audioUrl]);

//   return (
//     <View style={{ padding: 10 }}>
//       <Text style={{ fontSize: 12, color: '#64748B' }}>🔊 Playing audio...</Text>
//     </View>
//   );
// };

// export default AudioPlayer;

import Sound from 'react-native-sound';
import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AudioPlayer = ({ audioUrl }) => {
  const soundRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    Sound.setCategory('Playback');
    const sound = new Sound(audioUrl, null, (error) => {
      if (error) {
        console.log('Error loading sound:', error);
        return;
      }

      sound.setNumberOfLoops(-1); // loop infinitely
      sound.setVolume(1);
      sound.play((success) => {
        if (!success) console.log('Playback failed');
      });

      soundRef.current = sound;
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.stop(() => {
          soundRef.current.release();
        });
      }
    };
  }, [audioUrl]);

  const toggleMute = () => {
    if (soundRef.current) {
      const newVolume = isMuted ? 1 : 0;
      soundRef.current.setVolume(newVolume);
      setIsMuted(!isMuted);
    }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
      {/* <Text style={{ fontSize: 12, color: '#64748B', marginRight: 10 }}>
        {isMuted ? '🔇 Muted' : '🔊 '}
      </Text> */}
      <TouchableOpacity onPress={toggleMute} style={{ position: 'absolute', marginBottom: 50,padding: 8 , zIndex: 10}}>
        <Icon name={isMuted ? 'volume-mute' : 'volume-high'} size={20} color="#64748B"/>
      </TouchableOpacity>
    </View>
  );
};

export default AudioPlayer;
