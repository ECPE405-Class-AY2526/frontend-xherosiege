import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LandPagePicture: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.placeholderText}>Vape Detector Image</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  imagePlaceholder: {
    width: '90%',
    maxWidth: 300,
    height: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#16a34a',
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  placeholderText: {
    color: '#16a34a',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default LandPagePicture;