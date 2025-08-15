// components/EmojiPickerModal.js
import React from 'react';
import { Modal, View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';

const EMOJIS = [
  '🐶', '🐱', '🐰', '🐼', '🐻', '🦁', '🐮', '🐷', '🐸', '🐵',
  '🐔', '🐧', '🐦', '🐤', '🐺', '🐗', '🦊', '🐴', '🦄', '🐢',
  '🐍', '🐬', '🐳', '🦋', '🐝', '🐞', '🦀', '🦑', '🐙', '🦐',
];

const EmojiPickerModal = ({ visible, onSelect, onClose }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <FlatList
            data={EMOJIS}
            numColumns={6}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { onSelect(item); onClose(); }} style={styles.emojiButton}>
                <Text style={styles.emoji}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000aa' },
  modal: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%', maxHeight: '50%' },
  emojiButton: { padding: 10, alignItems: 'center', justifyContent: 'center', width: '16.66%' },
  emoji: { fontSize: 28 },
  closeButton: { marginTop: 10, alignSelf: 'center' },
  closeText: { color: 'red', fontSize: 16 },
});

export default EmojiPickerModal;