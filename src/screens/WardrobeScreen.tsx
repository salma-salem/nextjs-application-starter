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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ClothingItem, ClothingCategory } from '../types';
import { getClothingItems, deleteClothingItem } from '../services/database';
import { resetWardrobeItems } from '../utils/addClothes';
import { mockWardrobeItems } from '../utils/mockWardrobeItems';
import { addClothingItem } from '../services/database';

const categories: ClothingCategory[] = ['tops', 'bottoms', 'shoes', 'accessories', 'outerwear'];

const WardrobeScreen = () => {
  const navigation = useNavigation();
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [addedMockClothes, setAddedMockClothes] = useState(false);
  const [showCameraOptions, setShowCameraOptions] = useState(false);

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

  // Removed unused handleAddMockClothes function to fix error

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
          ? ''
          : 'bg-gray-200'
      }`}
      style={selectedCategory === category ? { backgroundColor: '#89CFF0' } : undefined}
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

  const handleOpenCameraOptions = () => {
    setShowCameraOptions(true);
  };

  const handleCloseCameraOptions = () => {
    setShowCameraOptions(false);
  };

  const handleTakePhoto = () => {
    setShowCameraOptions(false);
    navigation.navigate('ScanClothesScreen');
  };

  const handleChooseFromGallery = () => {
    setShowCameraOptions(false);
    navigation.navigate('ScanClothesScreen');
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Category Filter and Scan Clothes Button */}
      <View className="bg-white p-4 shadow-sm flex-row justify-between items-center">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['all', ...categories]}
          renderItem={({ item }) => renderCategoryButton(item as ClothingCategory | 'all')}
          keyExtractor={(item) => item}
          className="flex-grow"
        />
        <TouchableOpacity
          onPress={handleOpenCameraOptions}
          className="ml-4 p-2 rounded"
          style={{ backgroundColor: '#89CFF0' }}
        >
          <Ionicons name="camera-outline" size={24} color="white" />
        </TouchableOpacity>
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

      {/* Camera Options Modal */}
      <Modal
        visible={showCameraOptions}
        transparent
        animationType="fade"
        onRequestClose={handleCloseCameraOptions}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1}
          onPress={handleCloseCameraOptions}
        >
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
            <TouchableOpacity
              onPress={handleTakePhoto}
              className="py-4"
            >
              <Text className="text-lg text-center text-blue-500">Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleChooseFromGallery}
              className="py-4"
            >
              <Text className="text-lg text-center text-blue-500">Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCloseCameraOptions}
              className="py-4"
            >
              <Text className="text-lg text-center text-red-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default WardrobeScreen;
