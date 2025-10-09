import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const LandPageCenter: React.FC = () => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>History of vapes and vape detectors</Text>
          <Text style={styles.cardText}>
            Learn more on the invention of vape detectors and how they have evolved over time.
          </Text>
        </View>
        <View style={styles.cardImagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>Timeline Image</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>Trends in vape and vape detection</Text>
          <Text style={styles.cardText}>
            Look into the latest news and trends about vape detectors.
          </Text>
        </View>
        <View style={styles.cardImagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>Infograph Image</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>How our vape detector is made</Text>
          <Text style={styles.cardText}>
            Discover the technology and processes behind our innovative vape detection system.
          </Text>
        </View>
        <View style={styles.cardImagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>Detector Image</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 24,
    paddingLeft: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    width: 280,
    marginRight: 16,
  },
  cardBody: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    lineHeight: 26,
  },
  cardText: {
    fontSize: 15,
    color: '#555555',
    lineHeight: 22,
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 160,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  imagePlaceholderText: {
    color: '#6c757d',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LandPageCenter;