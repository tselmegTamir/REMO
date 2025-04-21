// import React from 'react';
// import {View, Image, TextInput} from "react-native";
// import { icons } from "@/constants/"

// interface Props {
//     placeholder: string;
//     value?: string;
//     onChangeText?: (text: string) => void;
//     onPress?: () => void;
// }

// const SearchBar = ({placeholder, value, onChangeText, onPress} : Props) => {
//     return (
//         <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
//             <Image
//                 source={icons.search}
//                 className="w-5 h-5"
//                 resizeMode="contain"
//                 tintColor="#AB8BFF"
//             />
//             <TextInput
//                 onPress={onPress}
//                 placeholder={placeholder}
//                 value={value}
//                 onChangeText={onChangeText}
//                 className="flex-1 ml-2 text-white"
//                 placeholderTextColor="#A8B5DB"
//             />
//         </View>
//     );
// };

// export default SearchBar;

import React from 'react';
import { View, TextInput, Image } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
  return (
    <View className="flex-row items-center bg-white border border-gray-300 rounded-lg mx-4 p-2">
      <Image
        source={require('@/assets/icons/search.png')} // Add your search icon
        className="w-6 h-6 mr-2"
        resizeMode="contain"
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Хайх"
        className="flex-1 text-base mb-3"
      />
    </View>
  );
};

export default SearchBar;