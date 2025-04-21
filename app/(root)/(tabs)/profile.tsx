// import React, { useState, useEffect } from 'react';
// import { View, Text, Button } from 'react-native';
// import { db, auth } from '@/FirebaseConfig';
// import { doc, onSnapshot } from 'firebase/firestore';
// import { useRouter } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const ProfileScreen = () => {
//   const router = useRouter();
//   const [userStats, setUserStats] = useState({
//     plastic: 0,
//     glass: 0,
//     metal: 0,
//     other: 0,
//   });

//   useEffect(() => {
//     if (!auth.currentUser) {
//       console.log('No user signed in on Profile screen');
//       return;
//     }

//     const userRef = doc(db, 'users', auth.currentUser.uid);
//     const unsubscribe = onSnapshot(
//       userRef,
//       (doc) => {
//         if (doc.exists()) {
//           const data = doc.data();

//           const roundedStats = {
//             plastic: Number(data.plastic.toFixed(1)),
//             glass: Number(data.glass.toFixed(1)),
//             metal: Number(data.metal.toFixed(1)),
//             other: Number(data.other.toFixed(1)),
//             score: Number(data.score.toFixed(1)),
//           };

//           setUserStats(roundedStats);
//           console.log('Profile screen stats updated:', data);
//         } else {
//           if(auth.currentUser)
//             console.log('User document does not exist for UID:', auth.currentUser.uid);
//         }
//       },
//       (error) => {
//         console.error('Error listening to user stats:', error);
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   const handleSignOut = async () => {
//     try {
//       await auth.signOut();
//       router.push('/(auth)/sign-in');
//     } catch (error) {
//       console.error('Sign out error:', error);
//     }
//   };

//   if (!auth.currentUser) {
//     return <Text className="text-center mt-10">Please sign in</Text>;
//   }

//   return (
//     <SafeAreaView className="flex-1 p-4">
//       <Text className="text-2xl font-bold mb-4">Профайл</Text>
//       <Text className="text-lg">Таны дахин боловсруулах статистик:</Text>
//       <Text>Хуванцар: {userStats.plastic}</Text>
//       <Text>Шил: {userStats.glass}</Text>
//       <Text>Металл: {userStats.metal}</Text>
//       <Text>Бусад: {userStats.other}</Text>
//       <View className="mt-4">
//         <Button title="Гарах" onPress={handleSignOut} />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ProfileScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { PieChart } from 'react-native-chart-kit';
import { db, auth } from '../../../FirebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import CustomCard from '@/components/CustomCard';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserStats {
  plastic: number;
  glass: number;
  metal: number;
  other: number;
  score: number;
}

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [pieData, setPieData] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const userRef = doc(db, 'users', auth.currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as UserStats;
        const roundedStats = {
          plastic: Number(data.plastic.toFixed(1)),
          glass: Number(data.glass.toFixed(1)),
          metal: Number(data.metal.toFixed(1)),
          other: Number(data.other.toFixed(1)),
          score: Number(data.score.toFixed(1)),
        };
        setStats(roundedStats);

        // Calculate total weight and percentages for pie chart
        const total = roundedStats.plastic + roundedStats.glass + roundedStats.metal + roundedStats.other;
        if (total > 0) {
          const pieChartData = [
            {
              name: 'Хуванцар',
              weight: roundedStats.plastic,
              color: '#FF6347',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
            {
              name: 'Шил',
              weight: roundedStats.glass,
              color: '#4682B4',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
            {
              name: 'Метал',
              weight: roundedStats.metal,
              color: '#FFD700',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
            {
              name: 'Бусад',
              weight: roundedStats.other,
              color: '#32CD32',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
          ].map(item => ({
            ...item,
            weight: (item.weight / total) * 100, // Convert to percentage
          }));
          setPieData(pieChartData);
        }
      } else {
        console.log('User document does not exist');
      }
    }, (error) => {
      console.error('Error fetching user stats:', error);
    });

    return () => unsubscribe();
  }, []);

  if (!stats) {
    return <Text className="text-center mt-10">Loading...</Text>;
  }

  return (
    <SafeAreaView className='flex-1'>
      {/* Split Background */}
      <View className="absolute top-0 left-0 right-0 h-[25%] bg-green-600" />
      <View className="absolute bottom-0 left-0 right-0 h-[75%] bg-white" />

      <ScrollView className="flex-1 bg-white ">
        {/* Header */}
        <View className="p-4 flex-row justify-between items-center">
          <Text className="text-2xl font-bold">Профайл</Text>
          <TouchableOpacity onPress={() => router.push('../settings')}>
            <Image
              source={require('@/assets/icons/settings.png')} // Add your settings icon
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* User Photo */}
        <View className="items-center mt-4">
          <Image
            source={require('@/assets/images/user.png')} // Add your user photo
            className="w-24 h-24 rounded-full"
            resizeMode="cover"
          />
        </View>

        {/* Pie Chart */}
        <View className="items-center mt-6">
          <Text className="text-lg font-bold mb-2">Статистик</Text>
          {pieData.length > 0 ? (
            <PieChart
              data={pieData}
              width={width - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="weight"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          ) : (
            <Text className="text-gray-500">No recycling data available</Text>
          )}
        </View>

        {/* Material Cards (2x2 Grid) */}
        <View className="mx-4 mt-6 mb-4">
          <Text className="text-lg font-bold mb-2">Материалын статистик</Text>
          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] mb-4">
              <CustomCard
                image={require('@/assets/bins/plastic.jpg')} // Add your plastic bin icon
                text1="Plastic"
                text2={true? `${stats.plastic}kg` : ""}
              />
            </View>
            <View className="w-[48%] mb-4">
              <CustomCard
                image={require('@/assets/bins/glass.jpg')} // Add your plastic bin icon
                text1="Шил"
                text2={true? `${stats.glass}kg` : ""}
              />
            </View>
            <View className="w-[48%] mb-4">
              <CustomCard
                image={require('@/assets/bins/metal.jpg')} // Add your plastic bin icon
                text1="Метал"
                text2={true? `${stats.metal}kg` : ""}
              />
            </View>
            <View className="w-[48%] mb-4">
              <CustomCard
                image={require('@/assets/bins/other.jpg')} // Add your plastic bin icon
                text1="Бусад"
                text2={true? `${stats.other}kg` : ""}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;