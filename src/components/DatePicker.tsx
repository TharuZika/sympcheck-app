import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Modal,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import tw from 'twrnc';

interface DatePickerProps {
  value: Date | null;
  onDateChange: (date: Date) => void;
  placeholder?: string;
  label?: string;
  style?: any;
  error?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onDateChange,
  placeholder = 'Select Date',
  label,
  style,
  error,
}) => {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());

  const onChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    
    if (selectedDate && event.type !== 'dismissed') {
      setTempDate(selectedDate);
      if (Platform.OS === 'android') {
        onDateChange(selectedDate);
      }
    }
  };

  const onConfirm = () => {
    onDateChange(tempDate);
    setShow(false);
  };

  const onCancel = () => {
    setTempDate(value || new Date());
    setShow(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return placeholder;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <View style={style}>
      {label && (
        <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        style={[
          tw`bg-white border rounded-xl p-4 flex-row justify-between items-center`,
          error ? tw`border-red-300` : tw`border-gray-300`,
          {
            minHeight: 48,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          },
        ]}
        onPress={() => setShow(true)}>
        <View style={tw`flex-1`}>
          <Text
            style={[
              tw`text-base`,
              value ? tw`text-gray-900` : tw`text-gray-500`,
            ]}>
            {formatDate(value)}
          </Text>
          {value && (
            <Text style={tw`text-sm text-gray-500 mt-1`}>
              Age: {getAge(value)} years
            </Text>
          )}
        </View>
        
        <View style={tw`ml-3`}>
          <Text style={tw`text-blue-500 text-2xl`}>📅</Text>
        </View>
      </TouchableOpacity>

      {error && (
        <Text style={tw`text-red-500 text-sm mt-1`}>{error}</Text>
      )}

      {show && (
        <>
          {Platform.OS === 'ios' ? (
            <Modal
              transparent
              animationType="slide"
              visible={show}
              onRequestClose={onCancel}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={tw`flex-row justify-between items-center p-4 border-b border-gray-200`}>
                    <TouchableOpacity onPress={onCancel}>
                      <Text style={tw`text-blue-500 text-lg`}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={tw`text-lg font-semibold`}>Select Birthday</Text>
                    <TouchableOpacity onPress={onConfirm}>
                      <Text style={tw`text-blue-500 text-lg font-semibold`}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="spinner"
                    onChange={onChange}
                    maximumDate={new Date()}
                    minimumDate={new Date(1900, 0, 1)}
                    style={{ backgroundColor: 'white' }}
                  />
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="default"
              onChange={onChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
});

export default DatePicker;
