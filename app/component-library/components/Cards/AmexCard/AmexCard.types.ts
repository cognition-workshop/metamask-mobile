// Third party dependencies.
import { ViewProps } from 'react-native';

/**
 * AmexCard component props.
 */
export interface AmexCardProps extends ViewProps {
  /**
   * Card holder name.
   */
  cardholderName: string;
  /**
   * Card number (will be formatted for display).
   */
  cardNumber: string;
  /**
   * Expiration date in MM/YY format.
   */
  expirationDate: string;
  /**
   * CVV code.
   */
  cvv: string;
}

/**
 * Style sheet input parameters.
 */
export type AmexCardStyleSheetVars = Pick<AmexCardProps, 'style'>;
