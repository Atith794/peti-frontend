import React, { useState, useRef } from 'react';
import { Text, PanResponder, Animated, StyleSheet, View, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';

const DraggableSticker = ({ text, initialPosition, onDragEnd, onDelete }) => {
  const [pan] = useState(new Animated.ValueXY(initialPosition));
  const [showDelete, setShowDelete] = useState(false);

  const longPressTimeout = useRef(null);
  const hideDeleteTimeout = useRef(null);
  const hasMoved = useRef(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onPanResponderGrant: () => {
      hasMoved.current = false;
      pan.setOffset({ x: pan.x._value, y: pan.y._value });

      // Start long press timer
      longPressTimeout.current = setTimeout(() => {
        if (!hasMoved.current) {
          setShowDelete(true);

          // Auto-hide after 1.5 seconds
          hideDeleteTimeout.current = setTimeout(() => {
            setShowDelete(false);
          }, 1500);
        }
      }, 600);
    },

    onPanResponderMove: (e, gestureState) => {
      if (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5) {
        hasMoved.current = true;
        clearTimeout(longPressTimeout.current);
      }
      Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false })(e, gestureState);
    },

    onPanResponderRelease: () => {
      clearTimeout(longPressTimeout.current);
      pan.flattenOffset();
      onDragEnd && onDragEnd({ x: pan.x._value, y: pan.y._value });
    },

    onPanResponderTerminate: () => {
      clearTimeout(longPressTimeout.current);
    },
  });

  return (
    <Animated.View style={[pan.getLayout(), styles.sticker]} {...panResponder.panHandlers}>
      <View style={styles.stickerContent}>
        <Text style={styles.stickerText}>{text}</Text>
        {showDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text ><X style={styles.deleteText}/></Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sticker: {
    position: 'absolute',
  },
  stickerContent: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stickerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    marginLeft: 6,
    paddingHorizontal: 4,
  },
  deleteText: {
    fontSize: 14,
    color: 'red',
  },
});

export default DraggableSticker;
