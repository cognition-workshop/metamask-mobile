// Third party dependencies.
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// External dependencies.
import { Theme } from '../../../../util/theme/models';

// Internal dependencies.
import { AmexCardStyleSheetVars } from './AmexCard.types';

/**
 * Style sheet function for AmexCard component.
 */
const styleSheet = (params: { theme: Theme; vars: AmexCardStyleSheetVars }) => {
  const { vars, theme } = params;
  const { colors } = theme;
  const { style } = vars;
  
  return StyleSheet.create({
    container: Object.assign(
      {
        width: 320,
        height: 200,
        borderRadius: 12,
        backgroundColor: colors.primary.default,
        padding: 20,
        justifyContent: 'space-between',
        shadowColor: colors.shadow.default,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      } as ViewStyle,
      style,
    ) as ViewStyle,
    
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    } as ViewStyle,
    
    logo: {
      color: colors.primary.inverse,
      fontSize: 18,
      fontWeight: 'bold',
    } as TextStyle,
    
    cardNumber: {
      color: colors.primary.inverse,
      fontSize: 18,
      fontFamily: 'monospace',
      letterSpacing: 2,
      marginVertical: 20,
    } as TextStyle,
    
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    } as ViewStyle,
    
    cardholderName: {
      color: colors.primary.inverse,
      fontSize: 14,
      fontWeight: '600',
      textTransform: 'uppercase',
    } as TextStyle,
    
    expirationDate: {
      color: colors.primary.inverse,
      fontSize: 14,
      fontFamily: 'monospace',
    } as TextStyle,
    
    cvv: {
      color: colors.primary.inverse,
      fontSize: 12,
      fontFamily: 'monospace',
    } as TextStyle,
  });
};

export default styleSheet;
