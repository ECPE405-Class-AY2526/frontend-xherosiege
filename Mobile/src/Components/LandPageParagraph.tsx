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
      <Text style={styles.title}>What is Soil Fertility Monitoring?</Text>

      <Text style={styles.paragraph}>
        Soil plays a vital role in agriculture and food production, yet it is
        often overlooked despite being the foundation of every crop. In the
        Philippines, many farmlands suffer from low to moderate soil fertility
        due to unsustainable farming practices, natural disasters, and the
        overuse of synthetic fertilizers. These challenges lead to declining
        crop yields, increased production costs, and reduced income for farmers.
        Our study aims to address this issue through the development of a
        machine-learning powered soil fertility monitoring system with automated
        fertigation.
      </Text>

      <Text style={styles.paragraph}>
        This innovation combines IoT technology, real-time soil analysis, and
        smart nutrient management to help farmers make data-driven decisions.
        The system detects soil conditions such as pH, moisture, electrical
        conductivity, and NPK levels, then automatically applies the right
        amount of fertilizer when needed. By integrating advanced technology
        with sustainable agriculture, our project seeks to improve crop
        productivity, reduce resource waste, and promote long-term soil health —
        empowering farmers and contributing to food security in the Philippines.
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
