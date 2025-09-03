import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import tw from 'twrnc';
import { useAuth } from '../contexts/AuthContext';
import historyService, { SymptomHistoryItem, AnalyticsData } from '../services/historyService';
import ModernCard from '../components/ModernCard';
import ModernButton from '../components/ModernButton';
import BMIIndicator from '../components/BMIIndicator';
import AnimatedLoader from '../components/AnimatedLoader';

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

  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const getBMIStatus = (bmi: number): { status: string; color: string; bgColor: string; description: string } => {
    if (bmi < 18.5) {
      return {
        status: "You're Underweight",
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        description: 'Consider consulting a healthcare professional about healthy weight gain.'
      };
    } else if (bmi >= 18.5 && bmi < 25) {
      return {
        status: "You're at Normal Weight",
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        description: 'Great! You have a healthy weight. Keep maintaining your current lifestyle.'
      };
    } else if (bmi >= 25 && bmi < 30) {
      return {
        status: "You're Overweight",
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        description: 'Consider a balanced diet and regular exercise to reach a healthier weight.'
      };
    } else {
      return {
        status: "You're Obese",
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        description: 'It\'s important to consult a healthcare professional for a personalized plan.'
      };
    }
  };

  const renderHistoryItem = ({ item }: { item: SymptomHistoryItem }) => (
    <ModernCard 
      variant="default" 
      style={tw`mb-4`}
      onPress={() => {
        Alert.alert(
          'Symptom Check Details',
          `Date: ${new Date(item.timestamp).toLocaleDateString()}\n\nSymptoms: ${item.originalInput}\n\nProcessed: ${item.processedSymptoms.join(', ')}`,
          [{ text: 'OK' }]
        );
      }}>
      <View style={tw`flex-row items-center mb-3`}>
        <View style={tw`w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3`}>
          <Text style={tw`text-red-600 text-lg`}>+</Text>
        </View>
        <View style={tw`flex-1`}>
          <Text style={tw`text-base font-bold text-gray-800`}>
            {new Date(item.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
          <Text style={tw`text-sm text-gray-500`}>
            {item.processedSymptoms.length} symptoms analyzed
          </Text>
        </View>
        <View style={tw`bg-green-100 rounded-full px-2 py-1`}>
          <Text style={tw`text-green-600 text-xs font-medium`}>✓ Complete</Text>
        </View>
      </View>
      <Text style={tw`text-sm text-gray-700 bg-gray-50 rounded-lg p-3`} numberOfLines={2}>
        {item.originalInput}
      </Text>
    </ModernCard>
  );

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gradient-to-br from-blue-50 to-indigo-100`}>
        <View style={tw`flex-1 justify-center items-center p-6`}>
          <View style={tw`w-24 h-24 bg-blue-500 rounded-full items-center justify-center mb-6`}>
            <Text style={tw`text-white text-3xl`}>🔒</Text>
          </View>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-4`}>Access Required</Text>
          <Text style={tw`text-gray-600 text-center mb-8 leading-6`}>
            Please sign in to view your profile and health analytics
          </Text>
          <ModernButton
            title="Sign In"
            leftIcon="🚪"
            onPress={() => navigation.navigate('Auth')}
            size="large"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gradient-to-br from-blue-50 to-indigo-100`}>
      <ScrollView 
        contentContainerStyle={tw`p-6`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        
          
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <View>
            <Text style={tw`text-3xl font-bold text-gray-800`}>My Profile</Text>
            <Text style={tw`text-gray-600`}>Manage your health journey</Text>
          </View>
          <ModernButton
            title="Logout"
            leftIcon=""
            variant="danger"
            size="small"
            onPress={handleLogout}
          />
        </View>

        
        <ModernCard variant="elevated" style={tw`mb-6`}>
          <View style={tw`items-center mb-6`}>
            <View style={tw`w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-4`}>
              <Text style={tw`text-white text-2xl font-bold`}>
                {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </Text>
            </View>
            <Text style={tw`text-xl font-bold text-gray-800`}>{user?.name || 'User'}</Text>
            <Text style={tw`text-gray-600 mb-4`}>{user?.email}</Text>
          </View>

          
          <View style={tw`mb-6`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Personal Information</Text>
            <View style={tw`bg-gray-50 rounded-xl p-4`}>
              <View style={tw`flex-row justify-between items-center py-2`}>
                <Text style={tw`text-gray-600 font-medium`}>Full Name</Text>
                <Text style={tw`font-semibold text-gray-800`}>{user?.name || 'Not provided'}</Text>
              </View>
              <View style={tw`flex-row justify-between items-center py-2 border-t border-gray-200`}>
                <Text style={tw`text-gray-600 font-medium`}>Email</Text>
                <Text style={tw`font-semibold text-gray-800`}>{user?.email}</Text>
              </View>
              <View style={tw`flex-row justify-between items-center py-2 border-t border-gray-200`}>
                <Text style={tw`text-gray-600 font-medium`}>Age</Text>
                <Text style={tw`font-semibold text-gray-800`}>
                  {user?.age ? `${user.age} years` : 'Not provided'}
                </Text>
              </View>
            </View>
          </View>

          
          <View style={tw`mb-6`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Health Metrics</Text>
            <View style={tw`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4`}>
              <View style={tw`flex-row justify-between items-center py-2`}>
                <Text style={tw`text-gray-700 font-medium`}>Weight</Text>
                <Text style={tw`font-bold text-gray-800 text-lg`}>
                  {user?.weight ? `${user.weight} kg` : 'Not provided'}
                </Text>
              </View>
              <View style={tw`flex-row justify-between items-center py-2 border-t border-blue-100`}>
                <Text style={tw`text-gray-700 font-medium`}>Height</Text>
                <Text style={tw`font-bold text-gray-800 text-lg`}>
                  {user?.height ? `${user.height} cm` : 'Not provided'}
                </Text>
              </View>
              
              {user?.weight && user?.height && (
                <>
                  <View style={tw`flex-row justify-between items-center py-2 border-t border-blue-100`}>
                    <Text style={tw`text-gray-700 font-medium`}>BMI</Text>
                    <Text style={tw`font-bold text-gray-800 text-lg`}>
                      {user?.bmi || calculateBMI(user.weight, user.height)}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {user?.weight && user?.height && (
            <View style={tw`mb-4`}>
              <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>BMI Status</Text>
              {(() => {
                const currentBMI = user?.bmi || calculateBMI(user.weight, user.height);
                const bmiStatus = getBMIStatus(currentBMI);
                return (
                  <View style={tw`${bmiStatus.bgColor} rounded-xl p-4 border-l-4 border-current`}>
                    <View style={tw`flex-row items-center justify-between mb-3`}>
                      <Text style={tw`text-xl font-bold ${bmiStatus.color}`}>
                        {bmiStatus.status}
                      </Text>
                      <View style={tw`bg-white rounded-full px-3 py-1`}>
                        <Text style={tw`font-bold text-gray-800`}>BMI: {currentBMI}</Text>
                      </View>
                    </View>
                    <Text style={tw`text-gray-700 leading-5`}>
                      {bmiStatus.description}
                    </Text>
                    
                    <View style={tw`mt-4`}>
                      <Text style={tw`text-sm font-medium text-gray-600 mb-2`}>BMI Scale</Text>
                      <View style={tw`flex-row h-2 rounded-full overflow-hidden`}>
                        <View style={tw`flex-1 bg-blue-300`} />
                        <View style={tw`flex-1 bg-green-300`} />
                        <View style={tw`flex-1 bg-yellow-300`} />
                        <View style={tw`flex-1 bg-red-300`} />
                      </View>
                      <View style={tw`flex-row justify-between mt-1`}>
                        <Text style={tw`text-xs text-gray-500`}>Underweight</Text>
                        <Text style={tw`text-xs text-gray-500`}>Normal</Text>
                        <Text style={tw`text-xs text-gray-500`}>Overweight</Text>
                        <Text style={tw`text-xs text-gray-500`}>Obese</Text>
                      </View>
                    </View>
                  </View>
                );
              })()}
            </View>
          )}

          <ModernButton
            title="Update Profile"
            leftIcon="✏️"
            variant="outline"
            size="small"
            fullWidth
            onPress={() => {
              Alert.alert('Coming Soon', 'Profile editing will be available soon!');
            }}
          />
        </ModernCard>

       
        {analytics && (
          <ModernCard variant="elevated" style={tw`mb-6`}>
            <View style={tw`items-center mb-4`}>
              <Text style={tw`text-xl font-bold text-gray-800 mb-2`}>Health Analytics</Text>
              <Text style={tw`text-gray-600 text-center mb-4`}>
                Your symptom check insights
              </Text>
            </View>
            
            <View style={tw`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4`}>
              <View style={tw`flex-row justify-between items-center mb-3`}>
                <Text style={tw`text-gray-700 font-medium`}>Total Health Checks</Text>
                <View style={tw`bg-blue-500 rounded-full w-8 h-8 items-center justify-center`}>
                  <Text style={tw`text-white font-bold text-sm`}>{analytics.totalChecks}</Text>
                </View>
              </View>
            </View>

            {analytics.topSymptoms.length > 0 && (
              <View>
                <Text style={tw`font-semibold text-gray-800 mb-3`}>Most Common Symptoms</Text>
                {analytics.topSymptoms.slice(0, 3).map((symptom, index) => (
                  <View key={index} style={tw`flex-row items-center justify-between py-2 px-3 bg-gray-50 rounded-lg mb-2`}>
                    <Text style={tw`text-gray-700 flex-1`}>• {symptom.symptom}</Text>
                    <View style={tw`bg-blue-100 rounded-full px-2 py-1`}>
                      <Text style={tw`text-blue-600 text-xs font-medium`}>{symptom.count}x</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ModernCard>
        )}

        
        <ModernCard variant="elevated" style={tw`mb-6`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <Text style={tw`text-xl font-bold text-gray-800`}>Recent History</Text>
            <View style={tw`bg-blue-100 rounded-full px-3 py-1`}>
              <Text style={tw`text-blue-600 text-sm font-medium`}>{history.length} checks</Text>
            </View>
          </View>
          
          {isLoading ? (
            <View style={tw`items-center py-8`}>
              <AnimatedLoader size="medium" text="Loading your history..." />
            </View>
          ) : history.length > 0 ? (
            <View>
              {history.map((item) => renderHistoryItem({ item }))}
              {history.length >= 10 && (
                <ModernButton
                  title="View All History"
                  variant="outline"
                  size="small"
                  fullWidth
                  onPress={() => {
                    Alert.alert('Coming Soon', 'Full history view will be available soon!');
                  }}
                />
              )}
            </View>
          ) : (
            <View style={tw`items-center py-8`}>
              <View style={tw`w-16 h-16 bg-gray-200 rounded-full items-center justify-center mb-4`}>
                <Text style={tw`text-red-400 text-2xl`}>+</Text>
              </View>
              <Text style={tw`text-gray-600 text-center font-medium mb-2`}>No symptom checks yet</Text>
              <Text style={tw`text-gray-500 text-center text-sm mb-4`}>
                Start by checking your symptoms on the home screen!
              </Text>
              <ModernButton
                title="Check Symptoms"
                leftIcon=""
                size="small"
                onPress={() => navigation.navigate('Home')}
              />
            </View>
          )}
        </ModernCard>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen; 