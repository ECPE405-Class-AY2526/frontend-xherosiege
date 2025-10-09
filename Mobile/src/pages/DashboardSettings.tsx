import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const DashboardSettings: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.pageContent}>
        <Text style={styles.pageTitle}>Settings & Configuration</Text>
        <Text style={styles.pageText}>
          Configure your vape detection system settings and preferences.
        </Text>
        <TouchableOpacity style={styles.settingButton}>
          <Text style={styles.settingButtonText}>Sensor Configuration</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingButton}>
          <Text style={styles.settingButtonText}>Alert Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingButton}>
          <Text style={styles.settingButtonText}>User Management</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  pageContent: {
    padding: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  pageText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 26,
    marginBottom: 28,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  settingButton: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginHorizontal: 8,
    minHeight: 60,
    justifyContent: 'center',
  },
  settingButtonText: {
    fontSize: 18,
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default DashboardSettings;