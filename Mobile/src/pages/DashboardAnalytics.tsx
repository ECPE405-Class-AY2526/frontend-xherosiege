import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const DashboardAnalytics: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.pageContent}>
        <Text style={styles.pageTitle}>Analytics & Reports</Text>
        <Text style={styles.pageText}>
          View detailed analytics and generate reports for your vape detection data.
        </Text>
        <Text style={styles.analyticsText}>• Weekly detection trends</Text>
        <Text style={styles.analyticsText}>• Location-based analytics</Text>
        <Text style={styles.analyticsText}>• Custom report generation</Text>
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
  analyticsText: {
    fontSize: 17,
    color: '#374151',
    marginBottom: 16,
    paddingLeft: 16,
    lineHeight: 24,
  },
});

export default DashboardAnalytics;