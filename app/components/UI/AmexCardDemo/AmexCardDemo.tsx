import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AmexCard from '../../../component-library/components/Cards/AmexCard';
import Text from '../../../component-library/components/Texts/Text';

const AmexCardDemo: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>American Express Card Demo</Text>
        
        <View style={styles.cardContainer}>
          <AmexCard
            cardholderName="John Doe"
            cardNumber="378282246310005"
            expirationDate="12/25"
            cvv="1234"
          />
        </View>
        
        <View style={styles.cardContainer}>
          <AmexCard
            cardholderName="Jane Smith"
            cardNumber="371449635398431"
            expirationDate="08/26"
            cvv="5678"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  cardContainer: {
    marginBottom: 30,
  },
});

export default AmexCardDemo;
