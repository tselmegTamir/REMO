import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface SettingsItemProps {
  icon: any; // Replace with actual image source type
  title: string;
  rightIcon?: any; // Optional custom right icon (e.g., flag for language)
  onPress: () => void;
}

const SettingsItem = ({ icon, title, rightIcon, onPress }: SettingsItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-white rounded-lg shadow mx-4 my-2 p-3"
    >
      <Image
        source={icon}
        className="w-6 h-6 mr-3"
        resizeMode="contain"
      />
      <Text className="flex-1 text-base">{title}</Text>
      <Image
        source={
          rightIcon || require('@/assets/icons/right-arrow.png') // Default to chevron-right
        }
        className="w-6 h-6"
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default SettingsItem;