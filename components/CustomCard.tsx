import React from 'react';
import { View, Text, Image } from 'react-native';

interface CardProps {
  text1: string;
  text2: string;
  image: any; // Replace with actual image source type
  instruction?: string;
  recyclable?: "r" | "w";
}

const PackagingPart = ({ text1, text2, image, instruction, recyclable }: CardProps) => {
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
            <Text className="text-sm font-bold uppercase">{text1}</Text>
            <Text className="text-sm text-gray-500">{text2}</Text>
          </View>
            {recyclable? (<Image
                                source={
                                recyclable
                                    ? require('@/assets/icons/recycle.png') // Add your recycle icon
                                    : require('@/assets/icons/bin.png')   // Add your trash icon
                                }
                                className="w-6 h-6"
                                resizeMode="contain"
                            />) : undefined
            }
        </View>
        {instruction? (<Text className="text-sm text-gray-600 mt-2">{instruction}</Text>) : undefined}   

      </View>
    </View>
  );
};

export default PackagingPart;