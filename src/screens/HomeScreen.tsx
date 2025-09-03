import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import tw from 'twrnc';
import { SymptomAnalysisRequest, SymptomAnalysisResponse } from '../types/api';
import { getApiUrl } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import ModernInput from '../components/ModernInput';
import ModernButton from '../components/ModernButton';
import ModernCard from '../components/ModernCard';
import AnimatedLoader from '../components/AnimatedLoader';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { user, isLoggedIn } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    "Analyzing your symptoms...",
    "This may take a while...",
    "Processing your request...",
    "Consulting AI medical database...",
    "Generating health insights...",
    "Almost done, please wait..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000); // 2 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, loadingMessages.length]);

  const quickSymptoms = [
    'headache', 'fever', 'cough', 'fatigue', 'nausea', 
    'sore throat', 'runny nose', 'muscle pain'
  ];

  const addQuickSymptom = (symptom: string) => {
    if (symptoms.trim()) {
      setSymptoms(prev => prev + ', ' + symptom);
    } else {
      setSymptoms(symptom);
    }
  };

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      Alert.alert('Error', 'Please enter your symptoms');
      return;
    }

    setIsLoading(true);

    let symptomList: string[] = [];

    if (symptoms) {
      symptoms.split(',').forEach(symptom => {
        symptomList.push(symptom.trim());
      });
    }
    
    try {
      const payload: SymptomAnalysisRequest = {
        symptomps: symptoms,
        sympList: symptomList,
        age: user?.age?.toString() || "25"
      };

      const API_URL = getApiUrl('/api/v1/symptoms/analyze');
      
      const headers: any = {
        'Content-Type': 'application/json',
      };

      if (isLoggedIn) {
        const token = authService.getToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.status === 'success' && apiResponse.data) {
        const predictions = apiResponse.data.predictions || [];
        const topPrediction = predictions[0];
        
        const transformedData: any = {
          status: apiResponse.status,
          topDisease: {
            name: topPrediction?.disease || 'Unknown Condition',
            probability: topPrediction?.probability || 50,
            critical_level: topPrediction?.medical_advice?.critical_level || 'Medium',
            medical_advice: topPrediction?.medical_advice || {
              general_care: ['Monitor symptoms closely', 'Stay hydrated', 'Get adequate rest'],
              seek_attention: 'Consult healthcare provider if symptoms worsen',
              precautions: ['Follow medical advice', 'Avoid self-medication'],
              next_steps: 'Schedule appointment with healthcare provider',
              disclaimer: 'This is not professional medical advice'
            }
          },
          otherDiseases: predictions.slice(1).map((prediction: any) => ({
            name: prediction.disease,
            probability: prediction.probability,
            critical_level: prediction.medical_advice?.critical_level || 'Medium'
          })),
          possibleConditions: predictions.map((prediction: any) => ({
            name: prediction.disease,
            probability: prediction.medical_advice?.critical_level || 'Medium',
            description: `${prediction.probability}% confidence`
          })),
          recommendations: topPrediction?.medical_advice?.general_care || [
            'Monitor symptoms closely and track any changes',
            'Stay hydrated with water and clear fluids',
            'Get adequate rest and avoid strenuous activities',
            'Consult healthcare provider if symptoms worsen'
          ],
          condition: topPrediction?.probability || 50,
          age: parseInt(apiResponse.data.age || user?.age?.toString() || '25'),
          timestamp: apiResponse.data.timestamp,
          originalInput: apiResponse.data.original_input,
          inputSymptoms: apiResponse.data.input_symptoms
        };
        
        navigation.navigate('Results', { analysisData: transformedData });
      } else {
        Alert.alert('Error', 'Failed to analyze symptoms. Please try again.');
      }
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      Alert.alert('Error', 'Failed to connect to the server. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gradient-to-br from-blue-50 to-indigo-100`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw`flex-1`}>
        <ScrollView 
          contentContainerStyle={tw`flex-grow p-6`}
          showsVerticalScrollIndicator={false}>
          
          <View style={tw`items-center mb-8`}>
            <View style={tw`w-24 h-24 bg-blue-500 rounded-full items-center justify-center mb-4 shadow-lg`}>
            <Image
              source={require('../../assets/logo-test.jpg')} 
              style={tw`w-24 h-24 rounded-full mb-4`} 
            />
            </View>
            <Text style={tw`text-4xl font-bold text-gray-800 mb-2`}>SympCheck</Text>
            <Text style={tw`text-gray-600 text-center mb-4`}>
              AI-powered symptom analysis for better health decisions
            </Text>
            
            {isLoggedIn && user && (
              <ModernCard variant="glass" style={tw`w-full`}>
                <View style={tw`flex-row items-center`}>
                  <View style={tw`w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3`}>
                    <Text style={tw`text-white font-bold`}>
                      {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
                    </Text>
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`font-semibold text-gray-800`}>
                      Welcome back, {user.name || 'there'}! 👋
                    </Text>
                    <Text style={tw`text-sm text-gray-600`}>
                      Ready for your health check?
                    </Text>
                  </View>
                </View>
              </ModernCard>
            )}
          </View>

          <ModernCard variant="elevated" style={tw`mb-6`}>
            <View style={tw`mb-4`}>
              <Text style={tw`text-xl font-bold text-gray-800 mb-2`}>
                🩺 Describe Your Symptoms
              </Text>
              <Text style={tw`text-gray-600 text-sm`}>
                Tell us what you're experiencing. Be as detailed as possible for better analysis.
              </Text>
            </View>

            <ModernInput
              label="Symptoms Description"
              value={symptoms}
              onChangeText={setSymptoms}
              placeholder="I have a headache, fever, and feel tired..."
              multiline
              numberOfLines={4}
              leftIcon=""
              style={tw`mb-4`}
            />

            <View style={tw`mb-4`}>
              <Text style={tw`text-sm font-medium text-gray-700 mb-3`}>
                Quick suggestions:
              </Text>
              <View style={tw`flex-row flex-wrap gap-2`}>
                {quickSymptoms.map((symptom, index) => (
                  <ModernButton
                    key={index}
                    title={symptom}
                    variant="ghost"
                    size="small"
                    onPress={() => addQuickSymptom(symptom)}
                  />
                ))}
              </View>
            </View>
          </ModernCard>


          <ModernButton
            title="Analyze Symptoms"
            leftIcon=""
            loading={isLoading}
            onPress={analyzeSymptoms}
            fullWidth
            size="large"
            style={tw`mb-6`}
          />

          <View style={tw`flex-row mb-6`}>
            <ModernButton
              title={isLoggedIn ? 'Account' : 'Sign In'}
              leftIcon={isLoggedIn ? '' : ''}
              variant="outline"
              onPress={() => navigation.navigate('Auth')}
              style={tw`flex-1 mr-2`}
            />
            <ModernButton
              title="History"
              leftIcon=""
              variant="outline"
              onPress={() => {
                if (isLoggedIn) {
                  navigation.navigate('Profile');
                } else {
                  Alert.alert(
                    'Sign In Required 🔐', 
                    'Please sign in to view your symptom history and get personalized insights.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Sign In', onPress: () => navigation.navigate('Auth') }
                    ]
                  );
                }
              }}
              style={tw`flex-1 ml-2`}
            />
          </View>

          <ModernCard variant="default" style={tw`mb-6`}>
            <View style={tw`flex-row items-center mb-3`}>
              <Text style={tw`text-lg font-semibold text-gray-800`}>💡 Health Tips</Text>
            </View>
            <View style={tw`space-y-3`}>
              <View style={tw`flex-row items-start`}>
                <Text style={tw`text-green-500 mr-2`}>✓</Text>
                <Text style={tw`text-gray-600 text-sm flex-1`}>
                  Describe symptoms as specifically as possible
                </Text>
              </View>
              <View style={tw`flex-row items-start`}>
                <Text style={tw`text-green-500 mr-2`}>✓</Text>
                <Text style={tw`text-gray-600 text-sm flex-1`}>
                  Include duration and severity of symptoms
                </Text>
              </View>
              <View style={tw`flex-row items-start`}>
                <Text style={tw`text-green-500 mr-2`}>✓</Text>
                <Text style={tw`text-gray-600 text-sm flex-1`}>
                  Always consult healthcare professionals for serious concerns
                </Text>
              </View>
              <View style={tw`flex-row items-start`}>
                <Text style={tw`text-green-500 mr-2`}>✓</Text>
                <Text style={tw`text-gray-600 text-sm flex-1`}>
                  This is an AI-powered app, so the results may not be 100% accurate.
                </Text>
              </View>
            </View>
          </ModernCard>

        </ScrollView>
        
        {isLoading && (
          <View style={[
            tw`absolute inset-0 bg-black bg-opacity-50 items-center justify-center`,
            { zIndex: 999, elevation: 999 }
          ]}>
            <View style={tw`bg-white rounded-2xl p-6 shadow-2xl items-center mx-6`}>
              <AnimatedLoader 
                size="large" 
                text={loadingMessages[loadingMessageIndex]}
                color="#3B82F6"
              />
              <Text style={tw`text-gray-600 text-sm mt-3 text-center`}>
                Please be patient while we analyze your symptoms
              </Text>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen; 