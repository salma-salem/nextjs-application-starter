import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClothingItem, ClothingCategory } from '../types';
import { getClothingItems, deleteClothingItem } from '../services/database';
import { resetWardrobeItems } from '../utils/addClothes';
import { mockWardrobeItems } from '../utils/mockWardrobeItems';
import { addClothingItem } from '../services/database';

const categories: ClothingCategory[] = ['tops', 'bottoms', 'shoes', 'accessories', 'outerwear'];

const WardrobeScreen = () => {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [addedMockClothes, setAddedMockClothes] = useState(false);

  const loadClothingItems = async () => {
    try {
      const items = await getClothingItems();
      setClothingItems(items);
    } catch (error) {
      console.error('Error loading clothing items:', error);
    }
  };

  const handleAddMockWardrobeItems = async () => {
    setLoadingAdd(true);
    try {
      await resetWardrobeItems();
      await loadClothingItems();
      setAddedMockClothes(true);
    } catch (error) {
      console.error('Error adding mock wardrobe items:', error);
    }
    setLoadingAdd(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClothingItems();
    setRefreshing(false);
  };

  useEffect(() => {
    loadClothingItems();
  }, []);

  const filteredItems = selectedCategory === 'all' 
    ? clothingItems 
    : clothingItems.filter(item => item.category === selectedCategory);

  const handleDeleteItem = (item: ClothingItem) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteClothingItem(item.id);
              await loadClothingItems();
            } catch (error) {
              console.error('Error deleting item:', error);
            }
          },
        },
      ]
    );
  };

  const handleAddMockClothes = async () => {
    setLoadingAdd(true);
    try {
      await addClothes();
      await loadClothingItems();
      setAddedMockClothes(true);
    } catch (error) {
      console.error('Error adding mock clothes:', error);
    }
    setLoadingAdd(false);
  };

  const renderClothingItem = ({ item }: { item: ClothingItem }) => {
    const imageUri = item.imagePath && item.imagePath.trim() !== '' 
      ? item.imagePath 
      : 'https://via.placeholder.com/150';

    return (
      <View className="bg-white rounded-lg shadow-md m-2 p-3 flex-1">
        <Image
          source={{ uri: imageUri }}
          className="w-full h-32 rounded-lg mb-2"
          resizeMode="cover"
        />
        <Text className="font-semibold text-gray-800 mb-1">{item.name}</Text>
        <Text className="text-sm text-gray-600 mb-1 capitalize">{item.category}</Text>
        <Text className="text-sm text-gray-500">{item.color}</Text>
        <TouchableOpacity
          onPress={() => handleDeleteItem(item)}
          className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
        >
          <Ionicons name="trash-outline" size={16} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCategoryButton = (category: ClothingCategory | 'all') => (
    <TouchableOpacity
      key={category}
      onPress={() => setSelectedCategory(category)}
      className={`px-4 py-2 rounded-full mr-2 ${
        selectedCategory === category
          ? 'bg-blue-500'
          : 'bg-gray-200'
      }`}
    >
      <Text
        className={`capitalize ${
          selectedCategory === category
            ? 'text-white font-semibold'
            : 'text-gray-700'
        }`}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Category Filter */}
      <View className="bg-white p-4 shadow-sm">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['all', ...categories]}
          renderItem={({ item }) => renderCategoryButton(item as ClothingCategory | 'all')}
          keyExtractor={(item) => item}
        />
      </View>

      {/* Add Mock Clothes Button */}
      <View className="p-4">
        <Button title={loadingAdd ? "Adding Clothes..." : ""} onPress={handleAddMockWardrobeItems} disabled={loadingAdd || addedMockClothes} />
      </View>

      {/* Clothing Items Grid */}
      {filteredItems.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="shirt-outline" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4">No items in your wardrobe</Text>
          <Text className="text-gray-400 text-center mt-2 px-8">
            Start by scanning some clothes using the camera tab
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderClothingItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default WardrobeScreen;
