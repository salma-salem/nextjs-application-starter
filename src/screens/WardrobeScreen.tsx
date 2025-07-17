import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import { ClothingItem, ClothingCategory } from '../types';
import { getClothingItems, deleteClothingItem, addClothingItem } from '../services/database';
import { mockWardrobeItems } from '../utils/mockWardrobeItems';

const categories: ClothingCategory[] = ['tops', 'bottoms', 'shoes', 'accessories', 'outerwear'];

const WardrobeScreen = () => {
  const navigation = useNavigation();
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showCameraOptions, setShowCameraOptions] = useState(false);

  const loadClothingItems = async () => {
    try {
      const items = await getClothingItems();
      setClothingItems(items);
    } catch (error) {
      console.error('Error loading clothing items:', error);
    }
  };

  const initializeWardrobe = async () => {
    try {
      const existingItems = await getClothingItems();
      if (existingItems.length === 0) {
        for (const item of mockWardrobeItems) {
          await addClothingItem(item);
        }
      }
    } catch (error) {
      console.error('Error initializing wardrobe:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClothingItems();
    setRefreshing(false);
  };

  useEffect(() => {
    (async () => {
      await initializeWardrobe();
      await loadClothingItems();
    })();
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

  const handleOpenCameraOptions = () => {
    setShowCameraOptions(true);
  };

  const handleCloseCameraOptions = () => {
    setShowCameraOptions(false);
  };

  const handleTakePhoto = async () => {
    setShowCameraOptions(false);
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to take a photo.');
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaType.IMAGE, // <-- cambiado aquí
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      navigation.navigate('ScanClothesScreen', { imageUri: result.assets[0].uri });
    }
  };
  
  const handleChooseFromGallery = async () => {
    setShowCameraOptions(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Gallery access is required to select an image.');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.IMAGE, // <-- cambiado aquí también
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      navigation.navigate('ScanClothesScreen', { imageUri: result.assets[0].uri });
    }
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
        selectedCategory === category ? '' : 'bg-gray-200'
      }`}
      style={selectedCategory === category ? { backgroundColor: '#89CFF0' } : undefined}
    >
      <Text
        className={`capitalize ${
          selectedCategory === category ? 'text-white font-semibold' : 'text-gray-700'
        }`}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

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
