import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const LandPageParagraph: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        What are vape detectors and how do they impact us?
      </Text>
      
      <Text style={styles.paragraph}>
        E-cigarettes, or vapes, have rapidly grown in popularity, especially among young people, due to their sleek designs, 
        wide variety of flavors, and accessibility. While they are often marketed as a safer alternative to traditional cigarettes, 
        studies show that vaping still exposes users to harmful chemicals such as nicotine and toxic compounds that can damage the 
        lungs and heart. In the Philippines, vape use among adolescents has significantly increased, raising concerns about addiction 
        and the risk of transitioning to regular smoking. Cases of vape-related illnesses and even deaths highlight the serious health 
        dangers linked to e-cigarettes. These findings emphasize the urgent need for awareness and regulation to protect public health.
      </Text>
      
      <Text style={styles.paragraph}>
        Our product aims to address the growing concern of vaping in schools by providing a reliable and efficient way to detect 
        vape usage. It will detect and notify proper authorities when vaping is detected, ensuring a swift response to this issue.
      </Text>
      
      <TouchableOpacity 
        style={styles.joinButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.joinButtonText}>Join us now!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 34,
  },
  paragraph: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 26,
    textAlign: 'left',
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  joinButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
    minHeight: 50, // Better touch target
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  joinButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default LandPageParagraph;