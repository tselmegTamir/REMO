import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '@/FirebaseConfig';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { Product } from '@/types/product';
import debounce from 'lodash.debounce';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';

// Map asset paths to local images
const imageMap: Record<string, any> = {
  '@/assets/products/coke.jpg': require('@/assets/products/coke.jpg'),
  '@/assets/rc/mcs.png': require('@/assets/rc/mcs.png'),
  '@/assets/cats/drinksCat.jpg': require('@/assets/cats/drinksCat.jpg'),
  '@/assets/products/mainBody.jpg': require('@/assets/products/mainBody.jpg'),
  '@/assets/products/cap.jpg': require('@/assets/products/cap.jpg'),
  '@/assets/products/label.jpg': require('@/assets/products/label.jpg'),
  // Add more mappings as needed
};

const SearchScreen = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term.trim()) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const q = query(
          collection(db, 'Products'),
          where('name', '>=', term),
          where('name', '<=', term + '\uf8ff'),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const results: Product[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate().toISOString(),
            updatedAt: data.updatedAt.toDate().toISOString()
          } as Product;
        });
        setProducts(results);
      } catch (error) {
        console.error('Search error:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }, 500), // 500ms debounce delay
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel(); // Clean up debounce on unmount
  }, [searchTerm, debouncedSearch]);

  return (
    <SafeAreaView className="flex-1 p-4">
        <ScrollView className="flex-1 bg-gray-100">
            <View className="p-4">
                <Text className="text-2xl font-bold">Хайх</Text>
            </View>

            <SearchBar
                value={searchTerm}
                onChangeText={setSearchTerm}
            />

            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" className="mt-4" />
            ) : products.length > 0 ? (
                <View className="mt-4">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            image={imageMap[product.img]}
                            name={product.name}
                            category={product.productCategory}
                            onPress={() => {router.push(`../${product.id}`)}}
                        />
                    ))}
                </View>
            ) : (
                <Text className="text-center text-gray-500 mt-4">
                {searchTerm.trim() ? 'No results found' : 'Enter a product name to search'}
                </Text>
            )}
      
        </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
