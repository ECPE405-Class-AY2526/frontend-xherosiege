import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const LandPageNav: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text style={styles.logo}>XHero Siege</Text>
          <TouchableOpacity 
            style={styles.signUpButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.signUpButtonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>About</Text>
          </TouchableOpacity>
          <TextInput 
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#999"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 12,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 44, // Better touch target
  },
  navButtonText: {
    color: '#000000',
    fontWeight: '500',
    fontSize: 16,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    flex: 1,
    marginLeft: 16,
    fontSize: 14,
    minHeight: 44, // Better touch target
  },
  signUpButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
    minHeight: 44, // Better touch target
    justifyContent: 'center',
  },
  signUpButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default LandPageNav;