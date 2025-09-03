import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  TextInputProps,
} from 'react-native';
import tw from 'twrnc';

interface ModernInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
}

const ModernInput: React.FC<ModernInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'default',
  size = 'medium',
  value,
  onFocus,
  onBlur,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.timing(borderAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, labelAnim, borderAnim]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { height: 40, fontSize: 14, paddingHorizontal: 12 };
      case 'large':
        return { height: 56, fontSize: 18, paddingHorizontal: 16 };
      default:
        return { height: 48, fontSize: 16, paddingHorizontal: 14 };
    }
  };

  const getVariantStyles = () => {
    const baseStyles = tw`rounded-xl`;
    
    switch (variant) {
      case 'outlined':
        return [
          baseStyles,
          tw`bg-transparent border-2`,
          error ? tw`border-red-300` : 
          isFocused ? tw`border-blue-500` : tw`border-gray-300`,
        ];
      case 'filled':
        return [
          baseStyles,
          tw`bg-gray-100 border`,
          error ? tw`border-red-300` : 
          isFocused ? tw`border-blue-500 bg-blue-50` : tw`border-transparent`,
        ];
      default:
        return [
          baseStyles,
          tw`bg-white border`,
          error ? tw`border-red-300` : 
          isFocused ? tw`border-blue-500` : tw`border-gray-300`,
          {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          },
        ];
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[tw`mb-4`, style]}>
      {label && (
        <Text style={[
          tw`text-sm font-medium mb-2`,
          error ? tw`text-red-500` : isFocused ? tw`text-blue-500` : tw`text-gray-700`
        ]}>
          {label}
        </Text>
      )}

      <View style={tw`relative`}>
        {leftIcon && (
          <View style={tw`absolute left-3 top-0 h-full justify-center z-10`}>
            <Text style={tw`text-xl`}>{leftIcon}</Text>
          </View>
        )}

        <View
          style={[
            ...getVariantStyles(),
            {
              borderColor: error ? '#EF4444' : isFocused ? '#3B82F6' : '#D1D5DB',
              borderWidth: 1,
            },
          ]}>
          <TextInput
            style={[
              tw`text-gray-900`,
              {
                height: sizeStyles.height,
                fontSize: sizeStyles.fontSize,
                paddingHorizontal: leftIcon ? sizeStyles.paddingHorizontal + 30 : sizeStyles.paddingHorizontal,
                paddingRight: rightIcon ? sizeStyles.paddingHorizontal + 30 : sizeStyles.paddingHorizontal,
                paddingVertical: 0,
              },
            ]}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor="#9CA3AF"
            {...props}
          />
        </View>

        {rightIcon && (
          <TouchableOpacity
            style={tw`absolute right-3 top-0 h-full justify-center`}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}>
            <Text style={tw`text-xl`}>{rightIcon}</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={tw`mt-1`}>
          <Text style={tw`text-red-500 text-sm`}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ModernInput;
