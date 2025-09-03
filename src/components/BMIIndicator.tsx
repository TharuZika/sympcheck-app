import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
} from 'react-native';
import tw from 'twrnc';

interface BMIIndicatorProps {
  bmi: number;
  height?: number;
  weight?: number;
}

const BMIIndicator: React.FC<BMIIndicatorProps> = ({ bmi, height, weight }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(progressAnim, {
        toValue: Math.min(bmi / 40, 1), // 0-1 range (40 as max)
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.7)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [bmi, progressAnim, scaleAnim]);

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#EF4444', bgColor: '#FEE2E2' };
    if (bmi < 25) return { category: 'Normal', color: '#22C55E', bgColor: '#DCFCE7' };
    if (bmi < 30) return { category: 'Overweight', color: '#F59E0B', bgColor: '#FEF3C7' };
    return { category: 'Obese', color: '#EF4444', bgColor: '#FEE2E2' };
  };

  const getBMIPosition = (bmi: number) => {
    if (bmi <= 18.5) return (bmi / 18.5) * 20; //  underweight
    if (bmi <= 25) return 20 + ((bmi - 18.5) / 6.5) * 40; // normal
    if (bmi <= 30) return 60 + ((bmi - 25) / 5) * 20; // overweight
    return 80 + Math.min(((bmi - 30) / 10) * 20, 20); // obese
  };

  const { category, color, bgColor } = getBMICategory(bmi);
  const position = getBMIPosition(bmi);

  return (
    <Animated.View
      style={[
        tw`bg-white rounded-2xl p-6 mb-4`,
        {
          transform: [{ scale: scaleAnim }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        },
      ]}>
      <Text style={tw`text-xl font-bold text-center mb-2`}>BMI Analysis</Text>
      
      <View style={[tw`rounded-2xl p-4 mb-4`, { backgroundColor: bgColor }]}>
        <Text style={tw`text-3xl font-bold text-center`} numberOfLines={1}>
          {bmi.toFixed(1)}
        </Text>
        <Text style={[tw`text-lg font-semibold text-center`, { color }]}>
          {category}
        </Text>
        {height && weight && (
          <Text style={tw`text-sm text-gray-600 text-center mt-2`}>
            Height: {height}cm • Weight: {weight}kg
          </Text>
        )}
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>BMI Scale</Text>
        
        <View style={tw`h-3 rounded-full bg-gray-200 overflow-hidden mb-2`}>
          <View style={tw`flex-row h-full`}>
            <View style={[tw`flex-1`, { backgroundColor: '#EF4444' }]} />
            <View style={[tw`flex-2`, { backgroundColor: '#22C55E' }]} />
            <View style={[tw`flex-1`, { backgroundColor: '#F59E0B' }]} />
            <View style={[tw`flex-1`, { backgroundColor: '#EF4444' }]} />
          </View>
          
          <Animated.View
            style={[
              tw`absolute top-0 w-1 h-full bg-black rounded-full`,
              {
                left: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          />
        </View>

        <View style={tw`flex-row justify-between`}>
          <Text style={tw`text-xs text-gray-500`}>18.5</Text>
          <Text style={tw`text-xs text-gray-500`}>25</Text>
          <Text style={tw`text-xs text-gray-500`}>30</Text>
        </View>
        
        <View style={tw`flex-row justify-between mt-1`}>
          <Text style={tw`text-xs text-red-500 font-medium`}>Under</Text>
          <Text style={tw`text-xs text-green-500 font-medium`}>Normal</Text>
          <Text style={tw`text-xs text-yellow-500 font-medium`}>Over</Text>
          <Text style={tw`text-xs text-red-500 font-medium`}>Obese</Text>
        </View>
      </View>

      <View style={tw`bg-gray-50 rounded-xl p-3`}>
        <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Health Tip</Text>
        <Text style={tw`text-xs text-gray-600`}>
          {getHealthTip(category)}
        </Text>
      </View>
    </Animated.View>
  );
};

const getHealthTip = (category: string): string => {
  switch (category) {
    case 'Underweight':
      return 'Consider consulting a healthcare provider about healthy weight gain strategies.';
    case 'Normal':
      return 'Great! Maintain your healthy lifestyle with balanced diet and regular exercise.';
    case 'Overweight':
      return 'Consider adopting a balanced diet and regular physical activity for optimal health.';
    case 'Obese':
      return 'Consult with a healthcare provider for a personalized weight management plan.';
    default:
      return 'Maintain a balanced lifestyle for optimal health.';
  }
};

export default BMIIndicator;
