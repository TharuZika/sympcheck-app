import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import tw from 'twrnc';
import { SymptomAnalysisResponse, PossibleCondition } from '../types/api';

const ResultsScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { analysisData }: { analysisData: SymptomAnalysisResponse } = route.params || {};
  
  const getProbabilityColor = (probability: string) => {
    switch (probability.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getProbabilityText = (probability: string) => {
    switch (probability.toLowerCase()) {
      case 'high':
        return 'High Risk';
      case 'medium':
        return 'Medium Risk';
      case 'low':
        return 'Low Risk';
      default:
        return 'Unknown';
    }
  };

  const getConditionSeverity = (condition: number) => {
    if (condition >= 80) return { level: 'Critical', color: 'bg-red-500', textColor: 'text-red-800', bgColor: 'bg-red-100' };
    if (condition >= 60) return { level: 'High', color: 'bg-orange-500', textColor: 'text-orange-800', bgColor: 'bg-orange-100' };
    if (condition >= 40) return { level: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-800', bgColor: 'bg-yellow-100' };
    return { level: 'Low', color: 'bg-green-500', textColor: 'text-green-800', bgColor: 'bg-green-100' };
  };

  if (!analysisData) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50`}>
        <View style={tw`flex-1 items-center justify-center p-5`}>
          <Text style={tw`text-xl text-gray-500`}>No analysis data available</Text>
          <TouchableOpacity 
            style={tw`bg-blue-500 rounded-full py-3 px-6 mt-5`}
            onPress={() => navigation.goBack()}>
            <Text style={tw`text-white font-bold`}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const severity = getConditionSeverity(analysisData.condition);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView contentContainerStyle={tw`p-5`}>
        <Text style={tw`text-2xl font-bold mb-2.5`}>Check Results</Text>
        <Text style={tw`text-base text-gray-500 mb-5`}>
          Condition severity: {severity.level}
        </Text>

        <View style={tw`bg-white rounded-2xl p-5 mb-5 shadow`}>
          <Text style={tw`text-lg font-bold mb-4`}>Condition Severity</Text>
          <View style={tw`items-center`}>
            <View style={tw`h-2.5 w-full bg-gray-200 rounded-full overflow-hidden flex-row`}>
              <View style={[tw`h-full ${severity.color}`, { width: `${analysisData.condition}%` }]} />
            </View>
            <View style={tw`flex-row justify-between w-full mt-2.5`}>
              <View style={tw`${severity.bgColor} py-1 px-2.5 rounded-full`}>
                <Text style={tw`text-sm font-bold ${severity.textColor}`}>
                  {severity.level}
                </Text>
              </View>
              <Text style={tw`text-sm text-gray-600`}>
                {analysisData.condition}% severity
              </Text>
            </View>
          </View>
        </View>

        <View style={tw`bg-white rounded-2xl p-5 mb-5 shadow`}>
          <Text style={tw`text-lg font-bold mb-4`}>Possible Conditions</Text>
          {analysisData.possibleConditions?.map((condition: PossibleCondition, index: number) => (
            <View key={index} style={tw`mb-4 p-4 border border-gray-200 rounded-lg`}>
              <View style={tw`flex-row justify-between items-center mb-2`}>
                <Text style={tw`text-base font-bold`}>{condition.name}</Text>
                <View style={tw`${getProbabilityColor(condition.probability)} px-2 py-1 rounded-full`}>
                  <Text style={tw`text-white text-xs font-bold`}>
                    {getProbabilityText(condition.probability)}
                  </Text>
                </View>
              </View>
              <Text style={tw`text-sm text-gray-600`}>{condition.description}</Text>
            </View>
          ))}
        </View>

        <View style={tw`bg-white rounded-2xl p-5 mb-5 shadow`}>
          <Text style={tw`text-lg font-bold mb-4`}>Recommendations</Text>
          {analysisData.recommendations?.map((recommendation: string, index: number) => (
            <View key={index} style={tw`flex-row items-start mb-3`}>
              <Text style={tw`text-blue-500 mr-2 mt-1`}>•</Text>
              <Text style={tw`text-sm text-gray-700 flex-1`}>{recommendation}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={tw`bg-blue-500 rounded-full py-4 items-center mb-5`}>
          <Text style={tw`text-white text-lg font-bold`}>
            Find Nearby Medical Help
          </Text>
        </TouchableOpacity>

        <View style={tw`items-center`}>
          <Text style={tw`text-blue-500 text-base`}>Map/Geminal Help</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResultsScreen; 