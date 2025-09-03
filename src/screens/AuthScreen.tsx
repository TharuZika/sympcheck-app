import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import tw from 'twrnc';
import { useAuth } from '../contexts/AuthContext';
import ModernInput from '../components/ModernInput';
import ModernButton from '../components/ModernButton';
import ModernCard from '../components/ModernCard';
import DatePicker from '../components/DatePicker';
import AnimatedLoader from '../components/AnimatedLoader';

const AuthScreen = ({ navigation }: { navigation: any }) => {
  const { login, register, logout, user, isLoggedIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }

      if (weight && (isNaN(parseFloat(weight)) || parseFloat(weight) <= 0)) {
        newErrors.weight = 'Please enter a valid weight';
      }

      if (height && (isNaN(parseFloat(height)) || parseFloat(height) <= 0)) {
        newErrors.height = 'Please enter a valid height';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await login({ email, password });
        Alert.alert('Welcome Back!', 'You have been logged in successfully.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await register({
          email,
          password,
          name: fullName,
          birthday: birthday?.toISOString().split('T')[0],
          weight: weight ? parseFloat(weight) : undefined,
          height: height ? parseFloat(height) : undefined,
        });
        Alert.alert('Account Created!', 'Welcome to SympCheck! Your account has been created successfully.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Oops! Something went wrong', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setBirthday(null);
    setWeight('');
    setHeight('');
    setErrors({});
  };

  const switchMode = (loginMode: boolean) => {
    setIsLogin(loginMode);
    resetForm();
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return '(Underweight)';
    if (bmi < 25) return '(Normal)';
    if (bmi < 30) return '(Overweight)';
    return '(Obese)';
  };

  const getBMIColor = (bmi: number): string => {
    if (bmi < 18.5) return '#EF4444';
    if (bmi < 25) return '#22C55E';
    if (bmi < 30) return '#F59E0B';
    return '#EF4444';
  };

  const calculatePreviewBMI = (): number => {
    if (!weight || !height) return 0;
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; //  cm to m
    return parseFloat((w / (h * h)).toFixed(1));
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
      <SafeAreaView style={tw`flex-1 bg-gradient-to-br from-blue-50 to-indigo-100`}>
        <ScrollView contentContainerStyle={tw`flex-grow justify-center p-6`}>
          <View style={tw`items-center mb-8`}>
            <View style={tw`w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-4`}>
              <Text style={tw`text-white text-2xl font-bold`}>
                {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </Text>
            </View>
            <Text style={tw`text-3xl font-bold text-gray-800 mb-2`}>
              Welcome Back!
            </Text>
            <Text style={tw`text-gray-600 text-center`}>
              Good to see you again, {user.name || 'there'}
            </Text>
          </View>

          <ModernCard variant="elevated" style={tw`mb-6`}>
            <View style={tw`items-center`}>
              <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Account Information</Text>
              
              <View style={tw`w-full`}>
                <InfoRow icon="" label="Email" value={user.email} />
                {user.name && <InfoRow icon="" label="Name" value={user.name} />}
                {user.age && <InfoRow icon="" label="Age" value={`${user.age} years`} />}
                {user.weight && <InfoRow icon="" label="Weight" value={`${user.weight} kg`} />}
                {user.height && <InfoRow icon="" label="Height" value={`${user.height} cm`} />}
                {user.bmi && (
                  <InfoRow 
                    icon="" 
                    label="BMI" 
                    value={`${user.bmi} ${getBMICategory(user.bmi)}`}
                    valueColor={getBMIColor(user.bmi)}
                  />
                )}
              </View>
            </View>
          </ModernCard>

          <View style={tw`flex-row mb-4`}>
            <ModernButton
              title="View Profile"
              leftIcon=""
              variant="primary"
              onPress={() => navigation.navigate('Profile')}
              style={tw`flex-1 mr-2`}
            />
            <ModernButton
              title="History"
              leftIcon=""
              variant="outline"
              onPress={() => navigation.navigate('Profile')}
              style={tw`flex-1 ml-2`}
            />
          </View>

          <ModernButton
            title="Logout"
            leftIcon=""
            variant="danger"
            onPress={handleLogout}
            fullWidth
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gradient-to-br from-blue-50 to-indigo-100`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw`flex-1`}>
        <ScrollView 
          contentContainerStyle={tw`flex-grow justify-center p-6`}
          showsVerticalScrollIndicator={false}>
          
          <View style={tw`items-center mb-8`}>
            <Image 
              source={require('../../assets/logo-test.jpg')} 
              style={tw`w-24 h-24 rounded-full mb-4`} 
            />
            <Text style={tw`text-3xl font-bold text-gray-800 mb-2`}>
              {isLogin ? 'Welcome Back!' : 'Join SympCheck'}
            </Text>
            <Text style={tw`text-gray-600 text-center`}>
              {isLogin ? 'Sign in to continue your health journey' : 'Create your account to get started'}
            </Text>
          </View>

          <ModernCard variant="elevated" style={tw`mb-6`}>
            <View style={tw`flex-row bg-gray-100 rounded-xl p-1`}>
              <ModernButton
                title="Login"
                variant={isLogin ? 'primary' : 'ghost'}
                size="small"
                onPress={() => switchMode(true)}
                style={tw`flex-1 mr-1`}
              />
              <ModernButton
                title="Register"
                variant={!isLogin ? 'primary' : 'ghost'}
                size="small"
                onPress={() => switchMode(false)}
                style={tw`flex-1 ml-1`}
              />
            </View>
          </ModernCard>

          {/* Form */}
          <ModernCard variant="elevated" style={tw`mb-6`}>
            <ModernInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="📧"
              error={errors.email}
              placeholder="Enter your email"
            />

            <ModernInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftIcon="🔒"
              rightIcon={showPassword ? "🙈" : "👁️"}
              onRightIconPress={() => setShowPassword(!showPassword)}
              error={errors.password}
              placeholder="Enter your password"
            />

            {!isLogin && (
              <>
                <ModernInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  leftIcon="🔒"
                  rightIcon={showConfirmPassword ? "🙈" : "👁️"}
                  onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  error={errors.confirmPassword}
                  placeholder="Confirm your password"
                />

                <ModernInput
                  label="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  leftIcon="👤"
                  error={errors.fullName}
                  placeholder="Enter your full name"
                />

                <DatePicker
                  label="Birthday (Optional)"
                  value={birthday}
                  onDateChange={setBirthday}
                  placeholder="Select your birthday"
                  style={tw`mb-4`}
                />

                <View style={tw`flex-row`}>
                  <ModernInput
                    label="Weight (kg)"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    leftIcon="⚖️"
                    error={errors.weight}
                    placeholder="70"
                    style={tw`flex-1 mr-2`}
                  />

                  <ModernInput
                    label="Height (cm)"
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                    leftIcon="📏"
                    error={errors.height}
                    placeholder="170"
                    style={tw`flex-1 ml-2`}
                  />
                </View>

                {weight && height && (
                  <View style={tw`bg-blue-50 rounded-xl p-3 mt-2`}>
                    <Text style={tw`text-sm text-blue-600 text-center`}>
                      Your BMI will be: {calculatePreviewBMI()} 
                      <Text style={tw`font-semibold`}> {getBMICategory(calculatePreviewBMI())}</Text>
                    </Text>
                  </View>
                )}
              </>
            )}
          </ModernCard>

          <ModernButton
            title={isLogin ? 'Sign In' : 'Create Account'}
            leftIcon={isLogin ? '' : ''}
            loading={isLoading}
            onPress={handleSubmit}
            fullWidth
            size="large"
          />

          {isLoading && (
            <View style={tw`absolute inset-0 bg-black/20 items-center justify-center`}>
              <AnimatedLoader 
                size="large" 
                text={isLogin ? 'Signing you in...' : 'Creating your account...'}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const InfoRow: React.FC<{
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
}> = ({ icon, label, value, valueColor }) => (
  <View style={tw`flex-row items-center py-2 border-b border-gray-100`}>
    <Text style={tw`text-lg mr-3`}>{icon}</Text>
    <Text style={tw`text-gray-600 flex-1`}>{label}</Text>
    <Text 
      style={[
        tw`font-semibold`,
        { color: valueColor || '#374151' }
      ]}>
      {value}
    </Text>
  </View>
);

export default AuthScreen; 