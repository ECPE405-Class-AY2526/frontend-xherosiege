import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const DashboardMonitor: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.pageContent}>
        <Text style={styles.pageTitle}>Live Monitoring</Text>
        <Text style={styles.pageText}>
          Real-time vape detection monitoring across all connected sensors.
        </Text>
        <View style={styles.monitoringCard}>
          <Text style={styles.monitoringStatus}>🟢 All Systems Operational</Text>
          <Text style={styles.monitoringDetail}>5 sensors online</Text>
        </View>
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
  monitoringCard: {
    backgroundColor: '#ffffff',
    padding: 28,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    marginHorizontal: 8,
  },
  monitoringStatus: {
    fontSize: 20,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 12,
    textAlign: 'center',
  },
  monitoringDetail: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default DashboardMonitor;