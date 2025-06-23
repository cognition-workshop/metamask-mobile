// Third party dependencies.
import React from 'react';
import { View, Text } from 'react-native';

// External dependencies.
import { useStyles } from '../../../hooks';

// Internal dependencies.
import styleSheet from './AmexCard.styles';
import { AmexCardProps } from './AmexCard.types';

/**
 * Format card number for display (XXXX XXXXXX XXXXX format for Amex)
 */
const formatCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{4})(\d{6})(\d{5})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return cardNumber;
};

const AmexCard: React.FC<AmexCardProps> = ({
  cardholderName,
  cardNumber,
  expirationDate,
  cvv,
  style,
  ...props
}) => {
  const { styles } = useStyles(styleSheet, { style });

  return (
    <View style={styles.container} {...props}>
      <View style={styles.header}>
        <Text style={styles.logo}>AMERICAN EXPRESS</Text>
      </View>
      
      <Text style={styles.cardNumber}>
        {formatCardNumber(cardNumber)}
      </Text>
      
      <View style={styles.footer}>
        <View>
          <Text style={styles.cardholderName}>
            {cardholderName}
          </Text>
          <Text style={styles.expirationDate}>
            {expirationDate}
          </Text>
        </View>
        <View>
          <Text style={styles.cvv}>
            CVV: {cvv}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AmexCard;
