import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';
import tw from 'twrnc';

interface AnimatedLoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  visible?: boolean;
}

const AnimatedLoader: React.FC<AnimatedLoaderProps> = ({
  size = 'medium',
  color = '#3B82F6',
  text = 'Loading...',
  visible = true,
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 0.8,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      Animated.timing(fadeValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, spinValue, scaleValue, fadeValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small':
        return 30;
      case 'large':
        return 60;
      default:
        return 40;
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        tw`items-center justify-center`,
        {
          opacity: fadeValue,
        },
      ]}>
      <Animated.View
        style={[
          {
            width: getSize(),
            height: getSize(),
            borderRadius: getSize() / 2,
            borderWidth: 3,
            borderColor: color,
            borderTopColor: 'transparent',
            transform: [
              { rotate: spin },
              { scale: scaleValue },
            ],
          },
        ]}
      />
      {text && (
        <Animated.Text
          style={[
            tw`mt-3 text-base font-medium`,
            {
              color: color,
              opacity: fadeValue,
            },
          ]}>
          {text}
        </Animated.Text>
      )}
      
      <View style={tw`flex-row mt-2`}>
        {[0, 1, 2].map((index) => (
          <PulsingDot
            key={index}
            delay={index * 200}
            color={color}
          />
        ))}
      </View>
    </Animated.View>
  );
};

interface PulsingDotProps {
  delay: number;
  color: string;
}

const PulsingDot: React.FC<PulsingDotProps> = ({ delay, color }) => {
  const pulseValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 0.3,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    const timer = setTimeout(pulse, delay);
    return () => clearTimeout(timer);
  }, [pulseValue, delay]);

  return (
    <Animated.View
      style={[
        tw`w-2 h-2 rounded-full mx-1`,
        {
          backgroundColor: color,
          opacity: pulseValue,
        },
      ]}
    />
  );
};

export default AnimatedLoader;
