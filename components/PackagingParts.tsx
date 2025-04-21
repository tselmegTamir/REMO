import React from 'react';
import { View, Text, Image } from 'react-native';

interface PackagingPartProps {
  name: string;
  material: string;
  image: any; // Replace with actual image source type
  instruction: string;
  recyclable: boolean;
}

const PackagingPart = ({ name, material, image, instruction, recyclable }: PackagingPartProps) => {
  return (
    <View className="flex-row bg-white rounded-lg p-3 mb-3">
      <Image
        source={image}
        className="w-16 h-16 rounded-lg mr-3"
        resizeMode="contain"
      />
      <View className="flex-1">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-base font-bold uppercase">{name}</Text>
            <Text className="text-sm text-gray-500">{material}</Text>
          </View>
          <Image
            source={
              recyclable
                ? require('@/assets/icons/recycle.png') // Add your recycle icon
                : require('@/assets/icons/trash.png')   // Add your trash icon
            }
            className="w-6 h-6"
            resizeMode="contain"
          />
        </View>
        <Text className="text-sm text-gray-600 mt-2">{instruction}</Text>
      </View>
    </View>
  );
};

export default PackagingPart;