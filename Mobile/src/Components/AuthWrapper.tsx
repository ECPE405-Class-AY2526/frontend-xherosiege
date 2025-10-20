import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import useAuthStore from '../store/authStore';

interface AuthWrapperProps {
  children: React.ReactNode;
  onAuthenticated?: () => void;
  onUnauthenticated?: () => void;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({
  children,
  onAuthenticated,
  onUnauthenticated,
}) => {
  const { user, isInitialized } = useAuthStore();

  useEffect(() => {
    if (isInitialized) {
      if (user && onAuthenticated) {
        onAuthenticated();
      } else if (!user && onUnauthenticated) {
        onUnauthenticated();
      }
    }
  }, [user, isInitialized, onAuthenticated, onUnauthenticated]);

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
});

export default AuthWrapper;
