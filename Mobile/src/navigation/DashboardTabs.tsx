import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Import Dashboard pages
import DashboardOverview from '../pages/DashboardOverview';
import DashboardMonitor from '../pages/DashboardMonitor';
import DashboardAnalytics from '../pages/DashboardAnalytics';
import DashboardSettings from '../pages/DashboardSettings';

import type { RootStackParamList } from '../../App';

export type DashboardTabParamList = {
  Overview: undefined;
  Monitor: undefined;
  Analytics: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<DashboardTabParamList>();

type DashboardNavigationProp = StackNavigationProp<RootStackParamList>;

const DashboardHeader: React.FC = () => {
  const navigation = useNavigation<DashboardNavigationProp>();

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>XHero Siege Dashboard</Text>
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => navigation.navigate('Landing')}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const DashboardTabs: React.FC = () => {
  return (
    <View style={styles.container}>
      <DashboardHeader />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            let iconText = '';

            if (route.name === 'Overview') {
              iconText = '📊';
            } else if (route.name === 'Monitor') {
              iconText = '📡';
            } else if (route.name === 'Analytics') {
              iconText = '📈';
            } else if (route.name === 'Settings') {
              iconText = '⚙️';
            }

            return (
              <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.6 }]}>
                {iconText}
              </Text>
            );
          },
          tabBarActiveTintColor: '#16a34a',
          tabBarInactiveTintColor: '#6b7280',
          tabBarLabelStyle: styles.tabLabel,
          tabBarStyle: styles.tabBar,
        })}
      >
        <Tab.Screen 
          name="Overview" 
          component={DashboardOverview}
          options={{ tabBarLabel: 'Overview' }}
        />
        <Tab.Screen 
          name="Monitor" 
          component={DashboardMonitor}
          options={{ tabBarLabel: 'Monitor' }}
        />
        <Tab.Screen 
          name="Analytics" 
          component={DashboardAnalytics}
          options={{ tabBarLabel: 'Analytics' }}
        />
        <Tab.Screen 
          name="Settings" 
          component={DashboardSettings}
          options={{ tabBarLabel: 'Settings' }}
        />
      </Tab.Navigator>
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
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 8,
    height: 70,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default DashboardTabs;