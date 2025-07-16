import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { ClothingItem, ClothingCategory } from '../types';
import { addClothingItem } from '../services/database';
import { saveImage } from '../services/storage';

const categories: ClothingCategory[] = ['tops', 'bottoms', 'shoes', 'accessories', 'outerwear'];
const colors = ['black', 'white', 'gray', 'red', 'blue', 'green', 'yellow', 'pink', 'purple', 'brown', 'orange'];

const ScanClothesScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [itemName, setItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory>('tops');
  const [selectedColor, setSelectedColor] = useState('black');
  const cameraRef = useRef<Camera>(null);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      setShowCamera(true);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
      setShowCamera(false);
      setShowAddModal(true);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      setShowAddModal(true);
    }
  };

  const saveClothingItem = async () => {
    if (!capturedImage || !itemName.trim()) {
      Alert.alert('Error', 'Please provide a name for the item');
      return;
    }

    try {
      const filename = `${Date.now()}.jpg`;
      const savedImagePath = await saveImage(capturedImage, filename);
      
      const newItem: ClothingItem = {
        id: Date.now().toString(),
        name: itemName.trim(),
        category: selectedCategory,
        color: selectedColor,
        imagePath: savedImagePath,
        dateAdded: new Date().toISOString(),
      };

      await addClothingItem(newItem);
      
      // Reset form
      setItemName('');
      setSelectedCategory('tops');
      setSelectedColor('black');
      setCapturedImage(null);
      setShowAddModal(false);
      
      Alert.alert('Success', 'Item added to your wardrobe!');
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('Error', 'Failed to save item');
    }
  };

  if (showCamera) {
    return (
      <View className="flex-1">
        <Camera
          ref={cameraRef}
          style={{ flex: 1 }}
          type="back"
        >
          <View className="flex-1 justify-end items-center pb-8">
            <View className="flex-row justify-around w-full px-8">
              <TouchableOpacity
                onPress={() => setShowCamera(false)}
                className="bg-gray-600 rounded-full p-4"
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={takePicture}
                className="bg-white rounded-full p-6 border-4 border-gray-300"
              >
                <View className="w-16 h-16 bg-white rounded-full" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={pickImage}
                className="bg-gray-600 rounded-full p-4"
              >
                <Ionicons name="images" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center items-center px-8">
        <Ionicons name="camera-outline" size={80} color="#9CA3AF" />
        <Text className="text-2xl font-bold text-gray-800 mt-6 mb-4">
          Add New Item
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Take a photo of your clothing item or select from your gallery
        </Text>
        
        <TouchableOpacity
          onPress={requestCameraPermission}
          className="bg-blue-500 rounded-lg px-8 py-4 mb-4 w-full"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="camera" size={24} color="white" />
            <Text className="text-white font-semibold ml-2 text-lg">
              Take Photo
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={pickImage}
          className="bg-gray-600 rounded-lg px-8 py-4 w-full"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="images" size={24} color="white" />
            <Text className="text-white font-semibold ml-2 text-lg">
              Choose from Gallery
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Add Item Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text className="text-blue-500 text-lg">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-lg font-semibold">Add Item</Text>
            <TouchableOpacity onPress={saveClothingItem}>
              <Text className="text-blue-500 text-lg font-semibold">Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView className="flex-1 p-4">
            <Text className="text-lg font-semibold mb-2">Item Name</Text>
            <TextInput
              value={itemName}
              onChangeText={setItemName}
              placeholder="Enter item name"
              className="border border-gray-300 rounded-lg p-3 mb-4"
            />
            
            <Text className="text-lg font-semibold mb-2">Category</Text>
            <View className="flex-row flex-wrap mb-4">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                    selectedCategory === category
                      ? 'bg-blue-500'
                      : 'bg-gray-200'
                  }`}
                >
                  <Text
                    className={`capitalize ${
                      selectedCategory === category
                        ? 'text-white'
                        : 'text-gray-700'
                    }`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text className="text-lg font-semibold mb-2">Color</Text>
            <View className="flex-row flex-wrap">
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                    selectedColor === color
                      ? 'bg-blue-500'
                      : 'bg-gray-200'
                  }`}
                >
                  <Text
                    className={`capitalize ${
                      selectedColor === color
                        ? 'text-white'
                        : 'text-gray-700'
                    }`}
                  >
                    {color}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default ScanClothesScreen;
