import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import tw from 'twrnc';
import { useAuth } from '../contexts/AuthContext';
import historyService, { SymptomHistoryItem, AnalyticsData } from '../services/historyService';

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const { user, isLoggedIn, logout } = useAuth();
  const [history, setHistory] = useState<SymptomHistoryItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const loadData = async () => {
    if (!isLoggedIn) return;

    try {
      setIsLoading(true);
      const [historyResponse, analyticsData] = await Promise.all([
        historyService.getHistory(1, 10),
        historyService.getAnalytics(6)
      ]);
      
      setHistory(historyResponse.data.history);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading profile data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.goBack();
          }
        }
      ]
    );
  };

  const renderHistoryItem = ({ item }: { item: SymptomHistoryItem }) => (
    <TouchableOpacity 
      style={tw`bg-gray-100 rounded-2xl p-4 mb-4`}
      onPress={() => {
        Alert.alert(
          'Symptom Check Details',
          `Date: ${new Date(item.timestamp).toLocaleDateString()}\n\nSymptoms: ${item.originalInput}\n\nProcessed: ${item.processedSymptoms.join(', ')}`
        );
      }}>
      <View style={tw`flex-row items-center mb-2`}>
        <Image source={require('../../assets/icon.png')} style={tw`w-10 h-10 rounded-full mr-3`} />
        <View style={tw`flex-1`}>
          <Text style={tw`text-base font-bold`}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
          <Text style={tw`text-sm text-gray-500`}>
            {item.processedSymptoms.length} symptoms analyzed
          </Text>
        </View>
      </View>
      <Text style={tw`text-sm text-gray-700 mt-2`} numberOfLines={2}>
        {item.originalInput}
      </Text>
    </TouchableOpacity>
  );

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={tw`flex-1 bg-white`}>
        <View style={tw`flex-1 justify-center items-center p-5`}>
          <Text style={tw`text-xl font-bold mb-4`}>Login Required</Text>
          <Text style={tw`text-gray-600 text-center mb-8`}>
            Please login to view your profile and symptom history
          </Text>
          <TouchableOpacity
            style={tw`bg-blue-500 rounded-full py-3 px-8`}
            onPress={() => navigation.navigate('Auth')}>
            <Text style={tw`text-white font-bold`}>Login / Register</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView 
        contentContainerStyle={tw`p-5`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        
        {/* Header */}
        <View style={tw`flex-row justify-between items-center mb-5`}>
          <Text style={tw`text-2xl font-bold`}>Profile</Text>
          <TouchableOpacity
            style={tw`bg-red-500 rounded-full py-2 px-4`}
            onPress={handleLogout}>
            <Text style={tw`text-white font-bold text-sm`}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={tw`bg-blue-50 rounded-2xl p-4 mb-6`}>
          <View style={tw`flex-row items-center mb-3`}>
            <Image
              source={require('../../assets/icon.png')} 
              style={tw`w-16 h-16 rounded-full mr-4`}
            />
            <View style={tw`flex-1`}>
              <Text style={tw`text-lg font-bold`}>{user?.name || 'User'}</Text>
              <Text style={tw`text-gray-600`}>{user?.email}</Text>
              {user?.age && (
                <Text style={tw`text-gray-600`}>Age: {user.age}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Analytics */}
        {analytics && (
          <View style={tw`bg-green-50 rounded-2xl p-4 mb-6`}>
            <Text style={tw`text-lg font-bold mb-3`}>Your Health Analytics</Text>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-gray-600`}>Total Checks:</Text>
              <Text style={tw`font-bold`}>{analytics.totalChecks}</Text>
            </View>
            {analytics.topSymptoms.length > 0 && (
              <View style={tw`mt-3`}>
                <Text style={tw`font-semibold mb-2`}>Most Common Symptoms:</Text>
                {analytics.topSymptoms.slice(0, 3).map((symptom, index) => (
                  <Text key={index} style={tw`text-sm text-gray-600 mb-1`}>
                    • {symptom.symptom} ({symptom.count} times)
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* History */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-lg font-bold mb-3`}>Recent History</Text>
          {isLoading ? (
            <View style={tw`items-center py-8`}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={tw`text-gray-600 mt-2`}>Loading history...</Text>
            </View>
          ) : history.length > 0 ? (
            <FlatList
              data={history}
              renderItem={renderHistoryItem}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <View style={tw`bg-gray-50 rounded-2xl p-6 items-center`}>
              <Text style={tw`text-gray-600 text-center`}>
                No symptom checks yet. Start by checking your symptoms on the home screen!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen; 