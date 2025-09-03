import React from 'react';
import {
  View,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import tw from 'twrnc';

interface ModernCardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
  onPress?: () => void;
}

const ModernCard: React.FC<ModernCardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  style,
  onPress,
  ...props
}) => {
  const getCardStyle = () => {
    const baseStyle = tw`rounded-2xl`;
    
    switch (variant) {
      case 'elevated':
        return [
          baseStyle,
          tw`bg-white shadow-lg shadow-gray-300/50`,
          {
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          },
        ];
      case 'outlined':
        return [
          baseStyle,
          tw`bg-white border border-gray-200`,
        ];
      case 'glass':
        return [
          baseStyle,
          tw`bg-white/80 border border-white/30`,
          {
            backdropFilter: 'blur(10px)',
          },
        ];
      default:
        return [
          baseStyle,
          tw`bg-white shadow-sm shadow-gray-200/50`,
          {
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
          },
        ];
    }
  };

  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return tw`p-0`;
      case 'small':
        return tw`p-3`;
      case 'large':
        return tw`p-6`;
      default:
        return tw`p-4`;
    }
  };

  const cardStyles = [
    ...getCardStyle(),
    getPaddingStyle(),
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.7}
        {...props}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles}>
      {children}
    </View>
  );
};

export default ModernCard;
