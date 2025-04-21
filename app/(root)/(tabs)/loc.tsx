import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { db } from '@/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Bin } from '@/types/bin'; // Adjust path to your types file

const LocScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [bins, setBins] = useState<Bin[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Location permission denied');
        return;
      }

      // Get user's current location
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      // Fetch bin locations from Firestore
      try {
        const binsCollection = collection(db, 'bins');
        const binsSnapshot = await getDocs(binsCollection);
        const binsData = binsSnapshot.docs
          .map((doc) => {
            const data = doc.data();
            // Validate required fields and types
            if (
              typeof data.latitude === 'number' &&
              typeof data.longitude === 'number' &&
              typeof data.name === 'string' &&
              !isNaN(data.latitude) &&
              !isNaN(data.longitude)
            ) {
              return {
                id: doc.id,
                latitude: data.latitude,
                longitude: data.longitude,
                name: data.name,
              } as Bin;
            }
            console.warn(`Invalid bin data for doc ${doc.id}:`, data);
            return null;
          })
          .filter((bin): bin is Bin => bin !== null); // Remove invalid entries

        console.log('Fetched bins:', binsData); // Debug log
        setBins(binsData);

        // If no bins are fetched, use mock data
        if (binsData.length === 0) {
          console.log('No bins found, using mock data');
          setBins([
            {
              id: '1',
              latitude: loc.coords.latitude + 0.01,
              longitude: loc.coords.longitude + 0.01,
              name: 'Bin 1',
            },
            {
              id: '2',
              latitude: loc.coords.latitude - 0.01,
              longitude: loc.coords.longitude - 0.01,
              name: 'Bin 2',
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching bins:', error);
        setErrorMsg('Failed to fetch bin locations');
      }
    })();
  }, []);

  if (errorMsg) {
    return <Text className="text-center text-red-500">{errorMsg}</Text>;
  }

  if (!location) {
    return <Text className="text-center">Газрын зургийг уншиж байна...</Text>;
  }

  return (
    <View className="flex-1">
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* User's location marker */}
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Таны байршил"
          description="Та энд байна"
          pinColor="blue"
        />

        {/* IoT bin markers */}
        {bins.length > 0 ? (
          bins.map((bin) => (
            <Marker
              key={bin.id}
              coordinate={{ latitude: bin.latitude, longitude: bin.longitude }}
              title={bin.name}
              description="Ухаалаг хогийн сав"
              pinColor="red"
            />
          ))
        ) : (
          <Text className="text-center text-gray-500"> Хогийн сав байхгүй байна </Text>
        )}
      </MapView>
    </View>
  );
};

export default LocScreen;