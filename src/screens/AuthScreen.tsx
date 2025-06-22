import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import tw from 'twrnc';

const AuthScreen = ({ navigation }: { navigation: any }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

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
          </>
        )}

        <TouchableOpacity style={tw`bg-blue-500 rounded-full py-4 items-center mt-5`}>
          <Text style={tw`text-white text-lg font-bold`}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen; 