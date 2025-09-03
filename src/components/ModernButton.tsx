import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Animated,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import tw from 'twrnc';

interface ModernButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  fullWidth?: boolean;
}

const ModernButton: React.FC<ModernButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  onPress,
  style,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (loading || disabled) {
      Animated.timing(opacityAnim, {
        toValue: 0.6,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, disabled, opacityAnim]);

  const handlePressIn = () => {
    if (!loading && !disabled) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!loading && !disabled) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 14,
          iconSize: 16,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          fontSize: 18,
          iconSize: 20,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          fontSize: 16,
          iconSize: 18,
        };
    }
  };

  const getVariantStyles = () => {
    const baseStyles = tw`rounded-xl items-center justify-center flex-row`;
    
    switch (variant) {
      case 'secondary':
        return [
          baseStyles,
          tw`bg-gray-100 border border-gray-200`,
        ];
      case 'outline':
        return [
          baseStyles,
          tw`bg-transparent border-2 border-blue-500`,
        ];
      case 'ghost':
        return [
          baseStyles,
          tw`bg-transparent`,
        ];
      case 'danger':
        return [
          baseStyles,
          tw`bg-red-500 border border-red-600`,
          {
            shadowColor: '#DC2626',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          },
        ];
      default: // primary
        return [
          baseStyles,
          tw`bg-blue-500 border border-blue-600`,
          {
            shadowColor: '#3B82F6',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          },
        ];
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return tw`text-gray-700`;
      case 'outline':
        return tw`text-blue-500`;
      case 'ghost':
        return tw`text-blue-500`;
      case 'danger':
        return tw`text-white`;
      default:
        return tw`text-white`;
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Animated.View
      style={[
        fullWidth && tw`w-full`,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}>
      <TouchableOpacity
        style={[
          ...getVariantStyles(),
          {
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
          },
          fullWidth && tw`w-full`,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={loading || disabled}
        activeOpacity={0.8}
        {...props}>
        
        {loading ? (
          <View style={tw`flex-row items-center`}>
            <ActivityIndicator
              size="small"
              color={variant === 'outline' || variant === 'ghost' ? '#3B82F6' : '#FFFFFF'}
              style={tw`mr-2`}
            />
            <Text
              style={[
                getTextColor(),
                tw`font-semibold`,
                { fontSize: sizeStyles.fontSize },
              ]}>
              Loading...
            </Text>
          </View>
        ) : (
          <View style={tw`flex-row items-center`}>
            {leftIcon && (
              <Text
                style={[
                  tw`mr-2`,
                  { fontSize: sizeStyles.iconSize },
                ]}>
                {leftIcon}
              </Text>
            )}
            
            <Text
              style={[
                getTextColor(),
                tw`font-semibold`,
                { fontSize: sizeStyles.fontSize },
              ]}>
              {title}
            </Text>
            
            {rightIcon && (
              <Text
                style={[
                  tw`ml-2`,
                  { fontSize: sizeStyles.iconSize },
                ]}>
                {rightIcon}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ModernButton;
