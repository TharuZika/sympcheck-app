import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import tw from 'twrnc';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [symptoms, setSymptoms] = useState('');

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-1 items-center justify-center p-5`}>
        <Image
          source={require('../../assets/logo-test.jpg')}
          style={tw`w-20 h-20 mb-2.5`}
        />
        <Text style={tw`text-3xl font-bold mb-10`}>SympCheck</Text>

        <Text style={tw`text-xl mb-5 self-start`}>Enter your symptoms</Text>
        <View style={tw`flex-row items-center mb-5 w-full`}>
          <TextInput
            style={tw`flex-1 border border-gray-300 rounded-lg p-4 mr-2.5 bg-white`}
            placeholder="I have a ..."
            value={symptoms}
            onChangeText={setSymptoms}
          />
          <TouchableOpacity style={tw`bg-blue-500 rounded-lg p-4`}>
            <Text style={tw`text-white text-xl font-bold`}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={tw`bg-blue-500 rounded-full py-4 px-8 w-full items-center mb-10`}
          onPress={() => navigation.navigate('Results')}>
          <Text style={tw`text-white text-lg font-bold`}>Check Symptoms</Text>
        </TouchableOpacity>

        <View style={tw`flex-row justify-between w-full absolute bottom-10`}>
          <TouchableOpacity
            style={tw`bg-white border border-blue-500 rounded-full py-4 px-8 w-[48%] items-center`}
            onPress={() => navigation.navigate('Auth')}>
            <Text style={tw`text-blue-500 text-base font-bold`}>
              Login/Register
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-white border border-blue-500 rounded-full py-4 px-8 w-[48%] items-center`}
            onPress={() => navigation.navigate('Profile')}>
            <Text style={tw`text-blue-500 text-base font-bold`}>History</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen; 