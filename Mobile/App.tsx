/**
 * XHero Siege Mobile App
 * Vape Detection System Mobile Version
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import pages
import LandingPage from './src/pages/LandingPage';
import LoginPage from './src/pages/LoginPage';
import DashboardTabs from './src/navigation/DashboardTabs';

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Dashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#000000' : '#ffffff'} 
      />
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Landing"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Landing" component={LandingPage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Dashboard" component={DashboardTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
