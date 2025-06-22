import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import tw from 'twrnc';

const historyData = [
  {
    id: '1',
    year: 'Flest 2021',
    symptoms: 'Click ton symptom check - Htime-ame lviags',
    avatar: require('../../assets/icon.png'), 
  },
  {
    id: '2',
    year: 'Flest 2021',
    symptoms: 'Click ton sympbin chees- Htime-oaro i-tteis',
    avatar: require('../../assets/icon.png'), 
  },
  {
    id: '3',
    year: 'Flest 2023',
    symptoms: 'Click ton sympom cheos- Ainaaitia a Harymitess',
    avatar: require('../../assets/icon.png'), 
  },
];

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const renderHistoryItem = ({ item }: { item: any }) => (
    <View style={tw`bg-gray-100 rounded-2xl p-4 mb-4 flex-row items-center`}>
      <Image source={item.avatar} style={tw`w-12 h-12 rounded-full mr-4`} />
      <View style={tw`flex-1`}>
        <Text style={tw`text-base font-bold mb-1`}>{item.year}</Text>
        <Text style={tw`text-sm text-gray-500`}>{item.symptoms}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`p-5`}>
        <Text style={tw`text-2xl font-bold mb-5`}>Profile</Text>

        <View style={tw`items-center mb-8`}>
          <Image
            source={require('../../assets/icon.png')} 
            style={tw`w-48 h-36`}
            resizeMode="contain"
          />
        </View>

        <FlatList
          data={historyData}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen; 