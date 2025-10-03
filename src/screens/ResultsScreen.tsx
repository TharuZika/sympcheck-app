import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import tw from 'twrnc';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { SymptomAnalysisResponse, PossibleCondition } from '../types/api';
import ModernCard from '../components/ModernCard';
import ModernButton from '../components/ModernButton';

const { width } = Dimensions.get('window');


const ResultsScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { analysisData } = route.params || {};
  const [selectedDiseaseIndex, setSelectedDiseaseIndex] = useState<number>(0);
  
  const getCriticalLevelColors = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          badge: 'bg-red-500',
          iconName: 'error',
          iconColor: '#f44336'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          badge: 'bg-yellow-500',
          iconName: 'warning',
          iconColor: '#ff9800'
        };
      case 'low':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          badge: 'bg-green-500',
          iconName: 'check-circle',
          iconColor: '#4caf50'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          badge: 'bg-gray-500',
          iconName: 'help-outline',
          iconColor: '#757575'
        };
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return null;
      }

      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), 2000); 
      });

      const location = await Promise.race([locationPromise, timeoutPromise]);

      if (!location) {
        return null;
      }

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  };

  const openGoogleMaps = async () => {
    try {
      const searchQuery = 'medical center near me';
      
      const location = await getCurrentLocation();
      
      let url: string;
      
      if (location) {
        const { latitude, longitude } = location;
        
        if (Platform.OS === 'ios') {
          url = `maps://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&center=${latitude},${longitude}&zoom=13`;
        } else {
          url = `geo:${latitude},${longitude}?q=${encodeURIComponent(searchQuery)}`;
        }
      } else {
        if (Platform.OS === 'ios') {
          url = `maps://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}`;
        } else {
          url = `geo:0,0?q=${encodeURIComponent(searchQuery)}`;
        }
      }

      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        const webUrl = location 
          ? `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}/@${location.latitude},${location.longitude},13z`
          : `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error('Error opening Google Maps:', error);
      Alert.alert(
        'Error',
        'Unable to open Google Maps. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderMedicalSection = (
    title: string,
    content: string[] | string,
    iconName: string,
    iconColor: string,
    bgColor: string = 'bg-white'
  ) => {
    const contentArray = Array.isArray(content) ? content : [content];
    
    return (
      <ModernCard variant="elevated" style={tw`mb-4 ${bgColor}`}>
        <View style={tw`flex-row items-center mb-3`}>
          <Icon name={iconName} size={24} color={iconColor} style={tw`mr-3`} />
          <Text style={tw`text-lg font-semibold text-gray-800`}>
            {title}
          </Text>
        </View>
        
        <View>
          {contentArray.map((item, index) => (
            <View key={index} style={tw`flex-row items-start mb-3`}>
              <Icon name="circle" size={8} color="#3b82f6" style={tw`mr-3 mt-2`} />
              <Text style={tw`text-gray-700 flex-1 leading-6`}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      </ModernCard>
    );
  };

  const renderDiseaseCard = (disease: any, index: number, isSelected: boolean) => {
    const colors = getCriticalLevelColors(disease.critical_level || disease.medical_advice?.critical_level || 'Medium');
    const hasDetailedAdvice = disease.medical_advice && disease.medical_advice.general_care;
    
    return (
      <TouchableOpacity
        key={index}
        onPress={() => setSelectedDiseaseIndex(index)}
        style={tw`mb-4`}
      >
        <ModernCard 
          variant="elevated" 
          style={tw`${isSelected ? `${colors.bg} ${colors.border} border-2` : 'bg-white border border-gray-200'} overflow-hidden`}
        >
          <View style={tw`flex-row items-center justify-between p-4`}>
            <View style={tw`flex-1`}>
              <View style={tw`flex-row items-center justify-between mb-2`}>
                <Text style={tw`text-xl font-bold ${isSelected ? colors.text : 'text-gray-800'}`}>
                  {disease.name || disease.disease}
                </Text>
                {isSelected && (
                  <View style={tw`${colors.badge} px-3 py-1 rounded-full`}>
                    <Text style={tw`text-white text-xs font-bold`}>SELECTED</Text>
                  </View>
                )}
              </View>
              <View style={tw`flex-row items-center justify-between`}>
                <View style={tw`flex-row items-center`}>
                  <Icon name={colors.iconName} size={18} color={colors.iconColor} style={tw`mr-2`} />
                  <Text style={tw`text-sm font-medium ${isSelected ? colors.text : 'text-gray-600'}`}>
                    {disease.critical_level || disease.medical_advice?.critical_level || 'Medium'} Risk
                  </Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-lg font-bold ${isSelected ? colors.text : 'text-gray-700'} mr-2`}>
                    {Math.round(disease.probability || 50)}%
                  </Text>
                  <Text style={tw`text-xs ${isSelected ? colors.text : 'text-gray-500'}`}>
                    confidence
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {isSelected && hasDetailedAdvice && (
            <View style={tw`border-t ${colors.border} bg-white bg-opacity-50`}>
              <View style={tw`p-4 border-b border-gray-100`}>
                <Text style={tw`text-sm font-semibold ${colors.text} mb-2`}>
                  Medical Summary
                </Text>
                <Text style={tw`text-sm text-gray-700 leading-5`}>
                  {disease.medical_advice.seek_attention}
                </Text>
              </View>

              <View style={tw`p-4`}>
                <Text style={tw`text-lg font-bold ${colors.text} mb-4`}>
                  Complete Medical Guidance
                </Text>
                
                <View style={tw`mb-5`}>
                  <View style={tw`flex-row items-center mb-3`}>
                    <Text style={tw`font-bold text-gray-800 text-base`}>General Care Instructions</Text>
                  </View>
                  {(disease.medical_advice.general_care || []).map((item: string, idx: number) => (
                    <View key={idx} style={tw`flex-row items-start mb-2 ml-6`}>
                      <Icon name="circle" size={6} color="#3b82f6" style={tw`mr-2 mt-1`} />
                      <Text style={tw`text-sm text-gray-700 flex-1 leading-5`}>
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={tw`mb-5`}>
                  <View style={tw`flex-row items-center mb-3`}>
                    <Text style={tw`font-bold text-gray-800 text-base`}>When to Seek Medical Attention</Text>
                  </View>
                  <View style={tw`ml-6 bg-red-50 p-3 rounded-lg border-l-4 border-red-400`}>
                    <Text style={tw`text-sm text-gray-700 leading-5`}>
                      {disease.medical_advice.seek_attention}
                    </Text>
                  </View>
                </View>

                {disease.medical_advice.precautions && disease.medical_advice.precautions.length > 0 && (
                  <View style={tw`mb-5`}>
                    <View style={tw`flex-row items-center mb-3`}>
                      <Text style={tw`font-bold text-gray-800 text-base`}>Important Precautions</Text>
                    </View>
                    {disease.medical_advice.precautions.map((item: string, idx: number) => (
                      <View key={idx} style={tw`flex-row items-start mb-2 ml-6`}>
                        <Icon name="warning" size={12} color="#f59e0b" style={tw`mr-2 mt-1`} />
                        <Text style={tw`text-sm text-gray-700 flex-1 leading-5`}>
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {disease.medical_advice.next_steps && (
                  <View style={tw`mb-5`}>
                    <View style={tw`flex-row items-center mb-3`}>
                      <Text style={tw`font-bold text-gray-800 text-base`}>Recommended Next Steps</Text>
                    </View>
                    <View style={tw`ml-6 bg-green-50 p-3 rounded-lg border-l-4 border-green-400`}>
                      <Text style={tw`text-sm text-gray-700 leading-5`}>
                        {disease.medical_advice.next_steps}
                      </Text>
                    </View>
                  </View>
                )}

                {disease.medical_advice.disclaimer && (
                  <View style={tw`mt-4 p-3 bg-gray-100 rounded-lg`}>
                    <View style={tw`flex-row items-start`}>
                      <Icon name="info" size={16} color="#6b7280" style={tw`mr-2 mt-1`} />
                      <Text style={tw`text-xs text-gray-600 leading-4 flex-1`}>
                        {disease.medical_advice.disclaimer}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {!isSelected && (
            <View style={tw`px-4 pb-3`}>
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-xs text-gray-500`}>
                  {hasDetailedAdvice ? 'Detailed guidance available' : 'Basic info only'}
                </Text>
                <Text style={tw`text-xs text-blue-500`}>
                  Tap to view details →
                </Text>
              </View>
            </View>
          )}

          {isSelected && !hasDetailedAdvice && (
            <View style={tw`border-t border-gray-200 p-4 bg-gray-50`}>
              <View style={tw`flex-row items-center`}>
                <Icon name="info" size={16} color="#6b7280" style={tw`mr-2`} />
                <Text style={tw`text-sm text-gray-600`}>
                  Limited medical guidance available for this condition
                </Text>
              </View>
            </View>
          )}
        </ModernCard>
      </TouchableOpacity>
    );
  };

  if (!analysisData) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gradient-to-br from-blue-50 to-indigo-100`}>
        <View style={tw`flex-1 items-center justify-center p-6`}>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-4`}>No Results Available</Text>
          <Text style={tw`text-gray-600 text-center mb-6`}>
            We couldn't find any analysis data. Please try again.
          </Text>
          <ModernButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            leftIcon="←"
          />
        </View>
      </SafeAreaView>
    );
  }

  const allDiseases = [];
  if (analysisData.topDisease) {
    allDiseases.push(analysisData.topDisease);
  }
  if (analysisData.otherDiseases) {
    allDiseases.push(...analysisData.otherDiseases);
  }
  
  if (allDiseases.length === 0 && analysisData.possibleConditions) {
    allDiseases.push(...analysisData.possibleConditions.map((condition: any) => ({
      name: condition.name,
      disease: condition.name,
      probability: 75, // defaultprobability
      critical_level: condition.probability,
      medical_advice: null
    })));
  }

  const selectedDisease = allDiseases[selectedDiseaseIndex] || allDiseases[0];

  return (
    <SafeAreaView style={tw`flex-1 bg-gradient-to-br from-blue-50 to-indigo-100`}>
      <ScrollView contentContainerStyle={tw`p-6`} showsVerticalScrollIndicator={false}>
        
       
        <View style={tw`flex-row items-center justify-center mb-6`}>
          <Text style={tw`text-2xl font-bold text-gray-800`}>Health Analysis</Text>
          <View style={tw`w-10`} />
        </View>

       
        <View style={tw`mb-6`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-xl font-bold text-gray-800`}>
                Analysis Results
              </Text>
            </View>
            <View style={tw`bg-blue-100 px-3 py-1 rounded-full`}>
              <Text style={tw`text-blue-700 text-xs font-semibold`}>
                {allDiseases.length} condition{allDiseases.length > 1 ? 's' : ''} found
              </Text>
            </View>
          </View>
          
          <Text style={tw`text-sm text-gray-600 mb-4`}>
            Tap any condition card to view detailed medical guidance. The most likely condition is selected by default.
          </Text>
          
          {allDiseases.map((disease, index) => 
            renderDiseaseCard(disease, index, index === selectedDiseaseIndex)
          )}
        </View>

       
        <ModernCard variant="elevated" style={tw`mb-6 bg-gray-100`}>
          <View style={tw`flex-row items-start`}>
            <Icon name="info" size={24} color="#6b7280" style={tw`mr-3`} />
            <View style={tw`flex-1`}>
              <Text style={tw`text-sm font-semibold text-gray-800 mb-2`}>
                Important Disclaimer
              </Text>
              <Text style={tw`text-xs text-gray-600 leading-5`}>
                {selectedDisease?.medical_advice?.disclaimer || 
                 'This analysis is for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare professionals for proper diagnosis and treatment.'}
              </Text>
            </View>
          </View>
        </ModernCard>

        <View style={tw`flex-row mb-6`}>
          <ModernButton
            title="Find Doctor"
            variant="primary"
            style={tw`flex-1 mr-2`}
            onPress={openGoogleMaps}
          />
          {/* <ModernButton
            title="Save Results"
            leftIcon="💾"
            variant="outline"
            style={tw`flex-1 ml-2`}
            onPress={() => {
              // TODO: manual save 
            }}
          /> */}
        </View>

        <ModernButton
          title="New Analysis"
          leftIcon="🔄"
          variant="ghost"
          onPress={() => navigation.goBack()}
          fullWidth
        />

      </ScrollView>
    </SafeAreaView>
  );
};

export default ResultsScreen;