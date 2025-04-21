// import React, { useState, useEffect } from 'react';
// import { View, Text } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { db, auth } from '@/FirebaseConfig'; // Adjust path as needed
// import { doc, onSnapshot } from 'firebase/firestore';

// const HomeScreen = () => {
//   const [score, setScore] = useState(0);

//   useEffect(() => {
//     if (!auth.currentUser) {
//       console.log('No user signed in on Home screen');
//       return;
//     }

//     const userRef = doc(db, 'users', auth.currentUser.uid);
//     const unsubscribe = onSnapshot(
//       userRef,
//       (doc) => {
//         if (doc.exists()) {
//           const data = doc.data();
//           setScore(data.score);
//           console.log('Home screen stats updated:', data);
//         } else {
//           if(auth.currentUser)
//             console.log('User document does not exist for UID:', auth.currentUser.uid);
//         }
//       },
//       (error: any) => {
//         console.error('Error listening to user stats:', error);
//       }
//     );

//     return () => unsubscribe(); // Clean up listener on unmount
//   }, []);

//   if (!auth.currentUser) {
//     return <Text className="text-center mt-10">Please sign in</Text>;
//   }

//   return (
//     <SafeAreaView className="flex-1 p-4">
//       {/* Score Display like a Bank Balance */}
//       <View className="bg-green-100 p-6 rounded-lg mb-4">
//         <Text className="text-4xl font-bold text-center">
//           {score.toLocaleString()} Оноо
//         </Text>
//         <Text className="text-center text-gray-600">Таны дансны үлдэгдэл</Text>
//       </View>

//       {/* General Sorting Information */}
//       <View>
//         <Text className="text-lg font-semibold mb-2">Ангилах зөвлөмжүүд</Text>
//         <Text>Хуванцар: Угааж, тагийг нь салгаарай.</Text>
//         <Text>Шилэн сав: Боломжтой бол өнгөөр нь ангилаарай.</Text>
//         <Text>Металл: Лааз, тугалган цаасыг цэвэрлээрэй.</Text>
//         <Text>Бусад: Орон нутгийн зааврыг шалгаарай.</Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default HomeScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { db, auth } from '../../../FirebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import BalanceCard from '../../../components/BalanceCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

const nearbyBins = [
    {
      id: 1,
      icon: require("@/assets/bins/metal.jpg"),
      name: "Ulaan",
      count: 3,
    },
    {
      id: 2,
      icon: require("@/assets/bins/glass.jpg"),
      name: "Tsenher",
      count: 5,
    },
    {
      id: 3,
      icon: require("@/assets/bins/plastic.jpg"),
      name: "Nogoon",
      count: 7,
    },
    {
      id: 4,
      icon: require("@/assets/bins/other.jpg"),
      name: "Har",
      count: 77,
    }
]

const news = [
  {
    id: 1,
    image: require("@/assets/bins/metal.jpg"),
    title: "Ulaan",
    description: "metal hiine shu"
  },
  {
    id: 2,
    image: require("@/assets/bins/glass.jpg"),
    title: "Tsenher",
    description: "shil hiine",
  },
  {
    id: 4,
    image: require("@/assets/bins/other.jpg"),
    title: "Har",
    description: "other",
  }
]

const HomeScreen = () => {

  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) {
      console.log('No user signed in on Home screen');
      return;
    }

    const userRef = doc(db, 'users', auth.currentUser.uid);
    const unsubscribe = onSnapshot(
      userRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setScore(data.score);
          console.log('Home screen stats updated:', data);
        } else {
          if(auth.currentUser)
            console.log('User document does not exist for UID:', auth.currentUser.uid);
        }
      },
      (error: any) => {
        console.error('Error listening to user stats:', error);
      }
    );

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  if (!auth.currentUser) {
    return <Text className="text-center mt-10">Please sign in</Text>;
  }
  
  return (
    <SafeAreaView className="flex-1">
      {/* Split Background */}
      <View className="absolute top-0 left-0 right-0 h-[25%] bg-green-600" />
      <View className="absolute bottom-0 left-0 right-0 h-[75%] bg-white" />

      <ScrollView className="flex-1">
        {/* Logo */}
        <View className=" p-4 flex-row justify-between items-center">
          <View className='flex flex-row bold'>
            <Image
              source={require('@/assets/icons/recycle.png')} // Add your REMO logo
              className="w-24 h-10"
              resizeMode="contain"
            />
            <Text className='text-3xl text-white font-bold'>RE</Text>
            <Text className='text-3xl text-green font-bold'>MO</Text>
          </View>

        </View>

        {/* Balance Card */}
        <BalanceCard balance={score} />

        {/* News Swiper */}
        <View className="mx-4 mt-6 mb-4">
          <Text className="text-lg font-bold mb-2">Борко</Text>
          <Swiper
            style={{ height: 150 }}
            showsButtons={false}
            showsPagination={true}
            dotStyle={{ backgroundColor: 'gray', width: 8, height: 8, borderRadius: 4 }}
            activeDotStyle={{ backgroundColor: 'green', width: 8, height: 8, borderRadius: 4 }}
          >
            {news.map((item) => (
              <View
                key={item.id}
                className="bg-white p-4 rounded-lg shadow flex-row"
              >
                <Image
                  source={item.image}
                  className="w-24 h-24 rounded-lg mr-4"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="text-base font-bold">{item.title}</Text>
                  <Text className="text-sm text-gray-500 mt-1">{item.description}</Text>
                  <Text className="text-blue-500 text-xs mt-2">Дэлгэрэнгүй</Text>
                </View>
              </View>
            ))}
          </Swiper>
        </View>
        

        {/* News Swiper */}
        <View className="mx-4 mt-6 mb-4">
          <Text className="text-lg font-bold mb-2">Шинэ мэдээлэл</Text>
          <Swiper
            style={{ height: 150 }}
            showsButtons={false}
            showsPagination={true}
            dotStyle={{ backgroundColor: 'gray', width: 8, height: 8, borderRadius: 4 }}
            activeDotStyle={{ backgroundColor: 'green', width: 8, height: 8, borderRadius: 4 }}
          >
            {news.map((item) => (
              <View
                key={item.id}
                className="bg-white p-4 rounded-lg shadow flex-row"
              >
                <Image
                  source={item.image}
                  className="w-24 h-24 rounded-lg mr-4"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="text-base font-bold">{item.title}</Text>
                  <Text className="text-sm text-gray-500 mt-1">{item.description}</Text>
                  <Text className="text-blue-500 text-xs mt-2">Дэлгэрэнгүй</Text>
                </View>
              </View>
            ))}
          </Swiper>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;