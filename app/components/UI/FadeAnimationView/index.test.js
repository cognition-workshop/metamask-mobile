import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Animated, View, Text } from 'react-native';
import FadeAnimationView from './index';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

const mockStart = jest.fn((callback) => callback && callback());
const mockTiming = jest.fn(() => ({ start: mockStart }));
const mockSequence = jest.fn(() => ({ start: mockStart }));

Animated.timing = mockTiming;
Animated.sequence = mockSequence;

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

describe('FadeAnimationView', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(
      <FadeAnimationView valueToWatch="test">
        <Text>Test Children</Text>
      </FadeAnimationView>
    );
    
    expect(getByText('Test Children')).toBeTruthy();
  });

  it('applies style prop correctly', () => {
    const testStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(
      <FadeAnimationView 
        valueToWatch="test" 
        style={testStyle}
        testID="fade-animation-view"
      >
        <Text>Test</Text>
      </FadeAnimationView>
    );
    
    const animatedView = getByTestId('fade-animation-view');
    expect(animatedView.props.style).toEqual(expect.objectContaining({
      ...testStyle,
      opacity: expect.any(Object) // Animated.Value
    }));
  });

  it('triggers animation when valueToWatch changes and animateOnChange is true', () => {
    const { rerender } = render(
      <FadeAnimationView 
        valueToWatch="initial"
        animateOnChange={true}
      >
        <Text>Test</Text>
      </FadeAnimationView>
    );

    rerender(
      <FadeAnimationView 
        valueToWatch="changed"
        animateOnChange={true}
      >
        <Text>Test</Text>
      </FadeAnimationView>
    );

    expect(mockSequence).toHaveBeenCalled();
    expect(mockStart).toHaveBeenCalled();
  });

  it('does not trigger animation when animateOnChange is false', () => {
    const { rerender } = render(
      <FadeAnimationView 
        valueToWatch="initial"
        animateOnChange={false}
      >
        <Text>Test</Text>
      </FadeAnimationView>
    );

    rerender(
      <FadeAnimationView 
        valueToWatch="changed"
        animateOnChange={false}
      >
        <Text>Test</Text>
      </FadeAnimationView>
    );

    expect(mockSequence).not.toHaveBeenCalled();
  });

  it('calls onAnimationStart when animation begins', () => {
    const onAnimationStart = jest.fn();
    const { rerender } = render(
      <FadeAnimationView 
        valueToWatch="initial"
        animateOnChange={true}
        onAnimationStart={onAnimationStart}
      >
        <Text>Test</Text>
      </FadeAnimationView>
    );

    rerender(
      <FadeAnimationView 
        valueToWatch="changed"
        animateOnChange={true}
        onAnimationStart={onAnimationStart}
      >
        <Text>Test</Text>
      </FadeAnimationView>
    );

    expect(onAnimationStart).toHaveBeenCalled();
  });

  it('calls onAnimationEnd when animation completes', () => {
    const onAnimationEnd = jest.fn();
    const { rerender } = render(
      <FadeAnimationView 
        valueToWatch="initial"
        animateOnChange={true}
        onAnimationEnd={onAnimationEnd}
      >
        <Text>Test</Text>
      </FadeAnimationView>
    );

    rerender(
      <FadeAnimationView 
        valueToWatch="changed"
        animateOnChange={true}
        onAnimationEnd={onAnimationEnd}
      >
        <Text>Test</Text>
      </FadeAnimationView>
    );

    expect(onAnimationEnd).toHaveBeenCalled();
  });

  it('uses custom animationTime when provided', () => {
    const customTime = 2000;
    const { rerender } = render(
      <FadeAnimationView 
        valueToWatch="initial"
        animateOnChange={true}
        animationTime={customTime}
      >
        <Text>Test</Text>
      </FadeAnimationView>
    );

    rerender(
      <FadeAnimationView 
        valueToWatch="changed"
        animateOnChange={true}
        animationTime={customTime}
      >
        <Text>Test</Text>
      </FadeAnimationView>
    );

    expect(mockTiming).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ time: customTime / 6 })
    );
  });

  it('sets pointerEvents to none during animation', () => {
    const { getByTestId, rerender } = render(
      <FadeAnimationView 
        valueToWatch="initial"
        animateOnChange={true}
        testID="fade-animation-view"
      >
        <Text>Test</Text>
      </FadeAnimationView>
    );

    rerender(
      <FadeAnimationView 
        valueToWatch="changed"
        animateOnChange={true}
        testID="fade-animation-view"
      >
        <Text>Test</Text>
      </FadeAnimationView>
    );

    const animatedView = getByTestId('fade-animation-view');
    expect(animatedView.props.pointerEvents).toBe('none');
  });

  it('shows last children during animation', () => {
    const { getByText, rerender } = render(
      <FadeAnimationView 
        valueToWatch="initial"
        animateOnChange={true}
      >
        <Text>Initial Children</Text>
      </FadeAnimationView>
    );

    rerender(
      <FadeAnimationView 
        valueToWatch="changed"
        animateOnChange={true}
      >
        <Text>New Children</Text>
      </FadeAnimationView>
    );

    expect(getByText('Initial Children')).toBeTruthy();
  });

  it('shows current children when not animating', () => {
    const { getByText } = render(
      <FadeAnimationView 
        valueToWatch="test"
        animateOnChange={true}
      >
        <Text>Current Children</Text>
      </FadeAnimationView>
    );

    expect(getByText('Current Children')).toBeTruthy();
  });

  it('uses default animation time when not provided', () => {
    const DEFAULT_TIME = 3900;
    const { rerender } = render(
      <FadeAnimationView 
        valueToWatch="initial"
        animateOnChange={true}
      >
        <Text>Test</Text>
      </FadeAnimationView>
    );

    rerender(
      <FadeAnimationView 
        valueToWatch="changed"
        animateOnChange={true}
      >
        <Text>Test</Text>
      </FadeAnimationView>
    );

    expect(mockTiming).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ time: DEFAULT_TIME / 6 })
    );
  });
});
