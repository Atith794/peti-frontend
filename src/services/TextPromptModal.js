// components/TextPromptModal.js
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const TextPromptModal = ({ visible, onClose, onSubmit, label }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
    }
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter text"
            placeholderTextColor="#ccc"
            value={text}
            onChangeText={setText}
          />
          <View style={styles.buttons}>
            <TouchableOpacity onPress={onClose}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit}><Text style={styles.submit}>OK</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000aa' },
  modal: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
  label: { fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 20 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancel: { color: 'red' },
  submit: { color: 'blue' },
});

export default TextPromptModal;
