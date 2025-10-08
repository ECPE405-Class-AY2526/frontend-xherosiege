import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LandPageBottom: React.FC = () => {
  return (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          <Text style={styles.link}>Vape Detection Solutions</Text>
          <Text style={styles.link}>Installation & Integration</Text>
          <Text style={styles.link}>Maintenance & Support</Text>
          <Text style={styles.link}>Data Analytics & Reporting</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company</Text>
          <Text style={styles.link}>About us</Text>
          <Text style={styles.link}>Contact</Text>
          <Text style={styles.link}>Careers</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <Text style={styles.link}>Terms of use</Text>
          <Text style={styles.link}>Privacy policy</Text>
          <Text style={styles.link}>Cookie policy</Text>
        </View>
      </View>
      
      <View style={styles.bottomSection}>
        <Text style={styles.copyright}>
          © 2024 XHero Siege. All rights reserved.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#f8f9fa',
    marginTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  section: {
    marginBottom: 20,
    minWidth: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  link: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    textDecorationLine: 'underline',
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
    alignItems: 'center',
  },
  copyright: {
    fontSize: 12,
    color: '#999999',
  },
});

export default LandPageBottom;