import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

type NavigationProps = {
  onNavigate: (page: 'landing' | 'login' | 'dashboard') => void;
};

type DashboardPage = 'page1' | 'page2' | 'page3' | 'page4';

const Dashboard: React.FC<NavigationProps> = ({ onNavigate }) => {
  const [currentDashboardPage, setCurrentDashboardPage] = useState<DashboardPage>('page1');

  const renderDashboardContent = () => {
    switch (currentDashboardPage) {
      case 'page1':
        return (
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
        );
      case 'page2':
        return (
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
        );
      case 'page3':
        return (
          <View style={styles.pageContent}>
            <Text style={styles.pageTitle}>Analytics & Reports</Text>
            <Text style={styles.pageText}>
              View detailed analytics and generate reports for your vape detection data.
            </Text>
            <Text style={styles.analyticsText}>• Weekly detection trends</Text>
            <Text style={styles.analyticsText}>• Location-based analytics</Text>
            <Text style={styles.analyticsText}>• Custom report generation</Text>
          </View>
        );
      case 'page4':
        return (
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
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>XHero Siege Dashboard</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => onNavigate('landing')}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent}>
        {renderDashboardContent()}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.tabButton, currentDashboardPage === 'page1' && styles.tabButtonActive]}
          onPress={() => setCurrentDashboardPage('page1')}
        >
          <Text style={[styles.tabButtonText, currentDashboardPage === 'page1' && styles.tabButtonTextActive]}>
            📊 Overview
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, currentDashboardPage === 'page2' && styles.tabButtonActive]}
          onPress={() => setCurrentDashboardPage('page2')}
        >
          <Text style={[styles.tabButtonText, currentDashboardPage === 'page2' && styles.tabButtonTextActive]}>
            📡 Monitor
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, currentDashboardPage === 'page3' && styles.tabButtonActive]}
          onPress={() => setCurrentDashboardPage('page3')}
        >
          <Text style={[styles.tabButtonText, currentDashboardPage === 'page3' && styles.tabButtonTextActive]}>
            📈 Analytics
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, currentDashboardPage === 'page4' && styles.tabButtonActive]}
          onPress={() => setCurrentDashboardPage('page4')}
        >
          <Text style={[styles.tabButtonText, currentDashboardPage === 'page4' && styles.tabButtonTextActive]}>
            ⚙️ Settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#dc2626',
    minHeight: 36,
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#f0f9ff',
  },
  tabButtonText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: '#16a34a',
    fontWeight: '600',
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
  analyticsText: {
    fontSize: 17,
    color: '#374151',
    marginBottom: 16,
    paddingLeft: 16,
    lineHeight: 24,
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

export default Dashboard;