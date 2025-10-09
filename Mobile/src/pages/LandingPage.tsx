import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import LandPageNav from '../Components/LandPageNav';
import LandPageParagraph from '../Components/LandPageParagraph';
import LandPagePicture from '../Components/LandPagePicture';
import LandPageCenter from '../Components/LandPageCenter';
import LandPageBottom from '../Components/LandPageBottom';

const LandingPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <LandPageNav />
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <LandPageParagraph />
        </View>
        <View style={styles.imageSection}>
          <LandPagePicture />
        </View>
        <LandPageCenter />
        <LandPageBottom />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  imageSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
});

export default LandingPage;