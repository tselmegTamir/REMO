import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface BalanceCardProps {
  balance: number;
}

const BalanceCard = ({ balance }: BalanceCardProps) => {
  return (
    <View className="bg-white mx-4 p-4 rounded-lg shadow-lg">
      <Text className="text-gray-500 text-sm">Дансны үлдэгдэл:</Text>
      <Text className="text-2xl font-bold">
        {balance.toLocaleString()}
      </Text>
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity className="bg-green-100 py-2 px-4 rounded-full">
          <Text className="text-green-600 font-semibold">Дэлгэрэнгүй</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-green-600 py-2 px-4 rounded-full">
          <Text className="text-white font-semibold">Гүйлгээ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BalanceCard;