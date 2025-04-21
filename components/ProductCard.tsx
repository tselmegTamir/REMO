import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface ProductCardProps {
  image: any; // Replace with actual image source type
  name: string;
  category: string;
  onPress: () => void;
}

const ProductCard = ({ image, name, category, onPress }: ProductCardProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row bg-white rounded-lg shadow mx-4 my-2 p-3">
        <Image
          source={image}
          className="w-16 h-16 rounded-lg mr-3"
          resizeMode="contain"
        />
        <View className="flex-1 justify-center">
          <Text className="text-base font-bold">{name}</Text>
          <Text className="text-sm text-gray-500">{category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;