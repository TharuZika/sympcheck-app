import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import tw from 'twrnc';

const ResultsScreen = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView contentContainerStyle={tw`p-5`}>
        <Text style={tw`text-2xl font-bold mb-2.5`}>Check Results</Text>
        <Text style={tw`text-base text-gray-500 mb-5`}>
          Probably condition detected
        </Text>

        <View style={tw`bg-white rounded-2xl p-5 mb-5 shadow`}>
          <Text style={tw`text-lg font-bold mb-4`}>Probably Condition</Text>
          <View style={tw`items-center`}>
            <View style={tw`h-2.5 w-full bg-gray-200 rounded-full overflow-hidden flex-row`}>
              <View style={tw`h-full w-2/5 bg-red-500`} />
            </View>
            <View style={tw`flex-row justify-between w-full mt-2.5`}>
              <View style={tw`bg-red-100 py-1 px-2.5 rounded-full`}>
                <Text style={tw`text-sm font-bold text-red-800`}>
                  Critical
                </Text>
              </View>
              <View style={tw`bg-green-100 py-1 px-2.5 rounded-full`}>
                <Text style={tw`text-sm font-bold text-green-800`}>
                  Non-critical
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={tw`bg-white rounded-2xl p-5 mb-5 shadow`}>
          <Text style={tw`text-lg font-bold mb-4`}>
            Recommended Medicines & Home-care Tips
          </Text>
          {/* need to add more details here */}
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