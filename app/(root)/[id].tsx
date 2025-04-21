import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '@/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import CustomCard from '@/components/CustomCard';
import { Product } from '../../types/product';
import { SafeAreaView } from 'react-native-safe-area-context';

// Map asset paths to local images
const imageMap: Record<string, any> = {
  '@/assets/products/coke.jpg': require('../../assets/products/coke.jpg'),
  '@/assets/rc/mcs.png': require('../../assets/rc/mcs.png'),
  '@/assets/cats/drinksCat.jpg': require('../../assets/cats/drinksCat.jpg'),
  '@/assets/products/mainBody.jpg': require('../../assets/products/mainBody.jpg'),
  '@/assets/products/cap.jpg': require('../../assets/products/cap.jpg'),
  '@/assets/products/label.jpg': require('../../assets/products/label.jpg'),
  // Add more mappings as needed
};

const ProductDetailsScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || typeof id !== 'string') {
        setError('Invalid product ID');
        return;
      }

      try {
        const productDoc = await getDoc(doc(db, 'Products', id));
        if (productDoc.exists()) {
          const productData = productDoc.data();
          // Convert Timestamps to ISO strings
          const product: Product = {
            ...productData,
            createdAt:
                productData.createdAt.toDate().toISOString(),
            updatedAt:
                productData.updatedAt.toDate().toISOString()
          } as Product;
          setProduct(product);
        } else {
          setError('Product not found');
        }
      } catch (error) {
        setError('Error fetching product: ' + (error as Error).message);
        console.error('Product fetch error:', error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <Text className="text-center mt-10">Loading...</Text>;
  }

  if (error) {
    return <Text className="text-center mt-10">{error}</Text>;
  }

  const recyclableParts = product.packagingParts.filter((part) => part.recyclable);
  const unrecyclableParts = product.packagingParts.filter((part) => !part.recyclable);

  return (
    <SafeAreaView className='flex-1'>
      <ScrollView className="flex-1 bg-gray-100 mt-1">

        {/* Header */}
          <View className="p-4 flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Image
                source={require('@/assets/icons/left-arrow.png')} // Add your back arrow icon
                className="w-4 h-4 mr-3"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text className="text-[20px] font-bold">Мэдээлэл</Text>
          </View>  

        <CustomCard
          image={imageMap[product.img]}
          text1={product.name}
          text2={product.productCategory}
        />

        {/* Swiper: Sorting Guide and Product Info */}
        <Swiper
          style={{ height: 600 }} // Adjust height based on content
          showsButtons={false}
          showsPagination={true}
          dotStyle={{ backgroundColor: 'gray', width: 8, height: 8, borderRadius: 4 }}
          activeDotStyle={{ backgroundColor: 'green', width: 8, height: 8, borderRadius: 4 }}
        >
          {/* Sorting Guide Page */}
          <ScrollView className="flex-1 bg-gray-100">
            <View className="p-4">
              <Text className="text-lg font-bold mb-2">Sorting Guide</Text>

              {/* Recyclable Section (Green Box) */}
              {recyclableParts.length > 0 && (
                <View className="bg-green-100 border border-green-500 rounded-lg p-4 mb-4">
                  <Text className="text-base font-semibold text-green-700 mb-2">Recycling</Text>
                  {recyclableParts.map((part) => (
                    <CustomCard
                      key={part.name}
                      text1={part.name}
                      text2={part.material}
                      image={imageMap[part.img]}
                      instruction={part.instruction}
                      recyclable={part.recyclable? "r" : "w"}
                    />
                  ))}
                </View>
              )}

              {/* Unrecyclable Section (Black Box) */}
              {unrecyclableParts.length > 0 && (
                <View className="bg-gray-800 rounded-lg p-4">
                  <Text className="text-base font-semibold text-white mb-2">Waste</Text>
                  {unrecyclableParts.map((part) => (
                    <CustomCard
                      key={part.name}
                      text1={part.name}
                      text2={part.material}
                      image={imageMap[part.img]}
                      instruction={part.instruction}
                      recyclable={part.recyclable? "r" : "w"}
                    />
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Product Information Page */}
          <View className="p-4">
            <Text className="text-lg font-bold mb-2">Product Info</Text>
            <CustomCard
              image={imageMap[product.responsibleCompanyLogo]}
              text1={product.responsibleCompanyName}
              text2="manifacturer"
            />
            <CustomCard
              image={require("@/assets/cats/drinksCat.jpg")}
              text1={product.productCategory}
              text2={product.productType}
            />
          </View>
        </Swiper>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetailsScreen;