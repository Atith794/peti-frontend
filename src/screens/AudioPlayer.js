import Sound from 'react-native-sound';
import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AudioPlayer = ({ audioUrl, isActive, loop = false, initialMuted = false }) => {
  const soundRef = useRef(null);
  const [isMuted, setIsMuted] = useState(!!initialMuted);
  const mountedRef = useRef(true);

  // iOS-only; safe to call. Keep once.
  useEffect(() => {
    Sound.setCategory('Playback', true); // mixWithOthers=true (iOS)
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (soundRef.current) {
        try {
          soundRef.current.stop(() => {
            soundRef.current?.release();
            soundRef.current = null;
          });
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Load/Play when active; Stop/Release when inactive or URL changes
  useEffect(() => {
    // If not active, ensure released
    if (!isActive) {
      if (soundRef.current) {
        try {
          soundRef.current.stop(() => {
            soundRef.current?.release();
            soundRef.current = null;
          });
        } catch {
          // ignore
        }
      }
      return;
    }

    // Guard: need URL and must be active
    if (!audioUrl) return;

    let local = new Sound(audioUrl, null, (error) => {
      if (error || !mountedRef.current) {
        // failed or unmounted during load
        try { local?.release(); } catch {}
        local = null;
        return;
      }

      // If another sound was already attached (URL changed quickly), replace it
      if (soundRef.current && soundRef.current !== local) {
        try {
          soundRef.current.stop(() => soundRef.current?.release());
        } catch {}
      }

      soundRef.current = local;

      // Looping as requested
      soundRef.current.setNumberOfLoops(loop ? -1 : 0);

      // Apply mute state without extra re-renders
      soundRef.current.setVolume(isMuted ? 0 : 1);

      // Start playback
      soundRef.current.play((success) => {
        // If not looping, release after completion
        if (!loop) {
          try {
            soundRef.current?.release();
          } catch {}
          soundRef.current = null;
        }
      });
    });

    // If URL changes quickly, release the temp instance on effect cleanup
    return () => {
      if (local && local !== soundRef.current) {
        try { local.stop(() => local.release()); } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl, isActive, loop]); // NOTE: don't include isMuted here—mute handled separately

  // Toggle mute without recreating the player
  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (soundRef.current) {
        try { soundRef.current.setVolume(next ? 0 : 1); } catch {}
      }
      return next;
    });
  };

  // Render just the mute button; players are headless
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
      <TouchableOpacity
        onPress={toggleMute}
        style={{ position: 'absolute', marginBottom: 50, padding: 8, zIndex: 10 }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Icon name={isMuted ? 'volume-mute' : 'volume-high'} size={20} color="#64748B" />
      </TouchableOpacity>
    </View>
  );
};

export default AudioPlayer;
