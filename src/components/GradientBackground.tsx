import React from 'react';
import { View, ViewStyle } from 'react-native';
import tw from 'twrnc';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  style?: ViewStyle;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  variant = 'primary',
  style,
}) => {
  const getGradientStyle = () => {
    switch (variant) {
      case 'primary':
        return tw`bg-gradient-to-br from-blue-400 to-blue-600`;
      case 'secondary':
        return tw`bg-gradient-to-br from-gray-400 to-gray-600`;
      case 'success':
        return tw`bg-gradient-to-br from-green-400 to-green-600`;
      case 'warning':
        return tw`bg-gradient-to-br from-yellow-400 to-orange-500`;
      case 'danger':
        return tw`bg-gradient-to-br from-red-400 to-red-600`;
      default:
        return tw`bg-gradient-to-br from-blue-400 to-blue-600`;
    }
  };

  return (
    <View style={[getGradientStyle(), style]}>
      {children}
    </View>
  );
};

export default GradientBackground;
