import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import tw from 'twrnc';
import { useAuth } from '../contexts/AuthContext';

const AuthScreen = ({ navigation }: { navigation: any }) => {
  const { login, register, logout, user, isLoggedIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await login({ email, password });
        Alert.alert('Success', 'Logged in successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await register({
          email,
          password,
          name: fullName || undefined,
          age: age ? parseInt(age) : undefined
        });
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
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

  if (isLoggedIn && user) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-100`}>
        <View style={tw`flex-1 justify-center p-5`}>
          <Text style={tw`text-2xl font-bold mb-8 text-center`}>
            Account
          </Text>

          <View style={tw`bg-white rounded-2xl p-6 mb-6`}>
            <Text style={tw`text-lg font-bold mb-2`}>Welcome back!</Text>
            <Text style={tw`text-gray-600 mb-1`}>Email: {user.email}</Text>
            {user.name && <Text style={tw`text-gray-600 mb-1`}>Name: {user.name}</Text>}
            {user.age && <Text style={tw`text-gray-600 mb-1`}>Age: {user.age}</Text>}
          </View>

          <TouchableOpacity
            style={tw`bg-blue-500 rounded-full py-4 items-center mb-4`}
            onPress={() => navigation.navigate('Profile')}>
            <Text style={tw`text-white text-lg font-bold`}>View Profile & History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`bg-red-500 rounded-full py-4 items-center`}
            onPress={handleLogout}>
            <Text style={tw`text-white text-lg font-bold`}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-1 justify-center p-5`}>
        <Text style={tw`text-2xl font-bold mb-8 text-center`}>
          Login/Register
        </Text>

        <View style={tw`flex-row justify-center mb-5 bg-gray-200 rounded-full p-1`}>
          <TouchableOpacity
            style={tw`flex-1 py-2.5 rounded-full items-center ${isLogin ? 'bg-blue-500' : ''}`}
            onPress={() => setIsLogin(true)}>
            <Text style={tw`text-base font-bold ${isLogin ? 'text-white' : 'text-gray-600'}`}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-1 py-2.5 rounded-full items-center ${!isLogin ? 'bg-blue-500' : ''}`}
            onPress={() => setIsLogin(false)}>
            <Text style={tw`text-base font-bold ${!isLogin ? 'text-white' : 'text-gray-600'}`}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={tw`bg-white border border-gray-300 rounded-lg p-4 mb-4 text-base`}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={tw`bg-white border border-gray-300 rounded-lg p-4 mb-4 text-base`}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {!isLogin && (
          <>
            <TextInput
              style={tw`bg-white border border-gray-300 rounded-lg p-4 mb-4 text-base`}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <TextInput
              style={tw`bg-white border border-gray-300 rounded-lg p-4 mb-4 text-base`}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={tw`bg-white border border-gray-300 rounded-lg p-4 mb-4 text-base`}
              placeholder="Age (optional)"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </>
        )}

        <TouchableOpacity 
          style={tw`bg-blue-500 rounded-full py-4 items-center mt-5 ${isLoading ? 'opacity-50' : ''}`}
          onPress={handleSubmit}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={tw`text-white text-lg font-bold`}>
              {isLogin ? 'Login' : 'Register'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen; 