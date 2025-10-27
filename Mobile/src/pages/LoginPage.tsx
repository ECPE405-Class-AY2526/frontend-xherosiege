import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';
import useAuthStore from '../store/authStore';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const LoginPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    if (success) {
      Alert.alert('Success', 'Login successful!');
      navigation.navigate('Dashboard');
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  const handleSignUp = () => {
    // For now, just navigate to dashboard
    navigation.navigate('Dashboard');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to XHero Siege</Text>
        <Text style={styles.subtitle}>Soil Monitoring System</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Logging in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.signUpButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
            <Text style={styles.backLink}>← Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 56,
  },
  loginButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 56,
    shadowColor: '#16a34a',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  loginButtonDisabled: {
    backgroundColor: '#64748b',
    shadowOpacity: 0.1,
  },
  signUpButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 30,
    minHeight: 56,
  },
  signUpButtonText: {
    color: '#16a34a',
    fontSize: 18,
    fontWeight: '600',
  },
  backLink: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
    paddingVertical: 12,
  },
});

export default LoginPage;
