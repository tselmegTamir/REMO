import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '@/FirebaseConfig';
import SettingsItem from '@/components/SettingsItem';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/sign-in'); // Redirect to sign-in screen after sign-out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <SafeAreaView className='flex-1'>
        <ScrollView className="flex-1 bg-gray-100">
        {/* Header */}
        <View className="p-4 flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
            <Image
                source={require('@/assets/icons/left-arrow.png')} // Add your back arrow icon
                className="w-6 h-6 mr-3"
                resizeMode="contain"
            />
            </TouchableOpacity>
            <Text className="text-2xl font-bold">Тохиргоо</Text>
        </View>

        {/* Settings Items */}
        <SettingsItem
            icon={require('@/assets/icons/payment-method.png')} // Add your payment icon
            title="Төлбөр"
            onPress={() => {}}
        />
        <SettingsItem
            icon={require('@/assets/icons/info.png')} // Add your about icon
            title="Тухай"
            onPress={() => {}}
        />
        <SettingsItem
            icon={require('@/assets/icons/person.png')} // Add your profile icon
            title="Хувийн мэдээлэл"
            onPress={() => {}}
        />
        <SettingsItem
            icon={require('@/assets/icons/notification.png')} // Add your notification icon
            title="Мэдэгдэл"
            onPress={() => {}}
        />
        <SettingsItem
            icon={require('@/assets/icons/languages.png')} // Add your language icon
            title="Хэл солих"
            rightIcon={require('@/assets/icons/monogolia.png')} // Add your flag icon
            onPress={() => {}}
        />
        <SettingsItem
            icon={require('@/assets/icons/exit.png')} // Add your sign-out icon
            title="Гарах"
            onPress={handleSignOut}
        />
        </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;