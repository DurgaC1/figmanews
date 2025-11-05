import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

export function LanguageSelector({ selectedLanguage, onSelectLanguage }: LanguageSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLang = languages.find(lang => lang.code === selectedLanguage);

  const handleSelectLanguage = (code: string) => {
    onSelectLanguage(code);
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.button}
          activeOpacity={0.7}
        >
          <BlurView intensity={80} tint="dark" style={styles.blurButton}>
            <Ionicons name="language" size={20} color="#ffffff" />
            <Text style={styles.buttonText}>{selectedLang?.name || 'EN'}</Text>
            <Ionicons name="chevron-down" size={16} color="rgba(255,255,255,0.6)" />
          </BlurView>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.languageList}>
              {languages.map((language) => {
                const isSelected = selectedLanguage === language.code;
                return (
                  <TouchableOpacity
                    key={language.code}
                    onPress={() => handleSelectLanguage(language.code)}
                    style={[
                      styles.languageItem,
                      isSelected && styles.languageItemSelected
                    ]}
                    activeOpacity={0.7}
                  >
                    <View>
                      <Text style={styles.languageName}>{language.name}</Text>
                      <Text style={styles.languageNativeName}>{language.nativeName}</Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 108,
    right: 20,
    zIndex: 50,
  },
  button: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  blurButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  closeButton: {
    padding: 4,
  },
  languageList: {
    paddingHorizontal: 20,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  languageItemSelected: {
    backgroundColor: 'rgba(37,99,235,0.1)',
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  languageNativeName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
});
