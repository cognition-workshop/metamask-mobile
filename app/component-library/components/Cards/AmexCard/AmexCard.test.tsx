import React from 'react';
import { render } from '@testing-library/react-native';
import AmexCard from './AmexCard';

describe('AmexCard', () => {
  const mockProps = {
    cardholderName: 'John Doe',
    cardNumber: '378282246310005',
    expirationDate: '12/25',
    cvv: '1234',
  };

  it('renders correctly', () => {
    const { getByText } = render(<AmexCard {...mockProps} />);
    
    expect(getByText('AMERICAN EXPRESS')).toBeTruthy();
    expect(getByText('JOHN DOE')).toBeTruthy();
    expect(getByText('12/25')).toBeTruthy();
    expect(getByText('CVV: 1234')).toBeTruthy();
    expect(getByText('3782 822463 10005')).toBeTruthy();
  });
});
