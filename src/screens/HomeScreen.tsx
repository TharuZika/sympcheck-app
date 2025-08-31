import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import tw from 'twrnc';
import { SymptomAnalysisRequest, SymptomAnalysisResponse } from '../types/api';
import { getApiUrl } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { user, isLoggedIn } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        age: "21"
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

      const data: SymptomAnalysisResponse = await response.json();
      
      if (data.status === 'success') {
        navigation.navigate('Results', { analysisData: data });
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
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-1 items-center justify-center p-5`}>
        <Image
          source={require('../../assets/logo-test.jpg')}
          style={tw`w-20 h-20 mb-2.5`}
        />
        <Text style={tw`text-3xl font-bold mb-2`}>SympCheck</Text>
        {isLoggedIn && user && (
          <Text style={tw`text-sm text-gray-600 mb-8 text-center`}>
            Welcome back, {user.name || user.email}!
          </Text>
        )}

        <Text style={tw`text-xl mb-5 self-start`}>Enter your symptoms</Text>
        <View style={tw`flex-row items-center mb-5 w-full`}>
          <TextInput
            style={tw`flex-1 border border-gray-300 rounded-lg p-4 mr-2.5 bg-white`}
            placeholder="I have a ..."
            value={symptoms}
            onChangeText={setSymptoms}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity style={tw`bg-blue-500 rounded-lg p-4`}>
            <Text style={tw`text-white text-xl font-bold`}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={tw`bg-blue-500 rounded-full py-4 px-8 w-full items-center mb-10 ${isLoading ? 'opacity-50' : ''}`}
          onPress={analyzeSymptoms}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={tw`text-white text-lg font-bold`}>Check Symptoms</Text>
          )}
        </TouchableOpacity>

        <View style={tw`flex-row justify-between w-full absolute bottom-10`}>
          <TouchableOpacity
            style={tw`bg-white border border-blue-500 rounded-full py-4 px-8 w-[48%] items-center`}
            onPress={() => navigation.navigate('Auth')}>
            <Text style={tw`text-blue-500 text-base font-bold`}>
              {isLoggedIn ? 'Account' : 'Login/Register'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-white border border-blue-500 rounded-full py-4 px-8 w-[48%] items-center ${!isLoggedIn ? 'opacity-50' : ''}`}
            onPress={() => {
              if (isLoggedIn) {
                navigation.navigate('Profile');
              } else {
                Alert.alert('Login Required', 'Please login to view your history');
              }
            }}>
            <Text style={tw`text-blue-500 text-base font-bold`}>History</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen; 