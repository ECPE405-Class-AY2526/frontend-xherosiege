import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const DashboardOverview: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.pageContent}>
        <Text style={styles.pageTitle}>Dashboard Overview</Text>
        <Text style={styles.pageText}>
          Welcome to the XHero Siege Vape Detection System dashboard. 
          Here you can monitor detection activities, view analytics, and manage your system.
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Detections Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default DashboardOverview;