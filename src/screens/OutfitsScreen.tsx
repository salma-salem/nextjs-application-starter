import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClothingItem, Outfit } from '../types';
import { getOutfits, addOutfit, deleteOutfit } from '../services/database';
import { getClothingItems } from '../services/database';

const OutfitsScreen = () => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [outfitName, setOutfitName] = useState('');

  const loadData = async () => {
    try {
      const [outfitsData, clothingData] = await Promise.all([
        getOutfits(),
        getClothingItems(),
      ]);
      setOutfits(outfitsData);
      setClothingItems(clothingData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOutfit = () => {
    setSelectedItems([]);
    setOutfitName('');
    setShowCreateModal(true);
  };

  const toggleItemSelection = (item: ClothingItem) => {
    setSelectedItems(prev => {
      const isSelected = prev.find(selected => selected.id === item.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const saveOutfit = async () => {
    if (!outfitName.trim()) {
      Alert.alert('Error', 'Please provide a name for the outfit');
      return;
    }

    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please select at least one item');
      return;
    }

    try {
      const newOutfit: Outfit = {
        id: Date.now().toString(),
        name: outfitName.trim(),
        items: selectedItems,
        createdDate: new Date().toISOString(),
      };

      await addOutfit(newOutfit);
      await loadData();
      
      setOutfitName('');
      setSelectedItems([]);
      setShowCreateModal(false);
      
      Alert.alert('Success', 'Outfit created successfully!');
    } catch (error) {
      console.error('Error saving outfit:', error);
      Alert.alert('Error', 'Failed to save outfit');
    }
  };

  const handleDeleteOutfit = (outfit: Outfit) => {
    Alert.alert(
      'Delete Outfit',
      `Are you sure you want to delete "${outfit.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteOutfit(outfit.id);
              await loadData();
            } catch (error) {
              console.error('Error deleting outfit:', error);
            }
          },
        },
      ]
    );
  };

  const renderOutfit = ({ item: outfit }: { item: Outfit }) => (
    <View className="bg-white rounded-lg shadow-md m-2 p-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold text-gray-800">{outfit.name}</Text>
        <TouchableOpacity
          onPress={() => handleDeleteOutfit(outfit)}
          className="bg-red-500 rounded-full p-1"
        >
          <Ionicons name="trash-outline" size={16} color="white" />
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row">
          {outfit.items.map((item, index) => (
            <View key={item.id} className="mr-2">
              <Image
                source={{ uri: item.imagePath }}
                className="w-16 h-16 rounded-lg"
                resizeMode="cover"
              />
              <Text className="text-xs text-gray-600 mt-1 text-center w-16" numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <Text className="text-sm text-gray-500 mt-2">
        {outfit.items.length} items • Created {new Date(outfit.createdDate).toLocaleDateString()}
      </Text>
    </View>
  );

  const renderClothingItem = ({ item }: { item: ClothingItem }) => {
    const isSelected = selectedItems.find(selected => selected.id === item.id);
    
    return (
      <TouchableOpacity
        onPress={() => toggleItemSelection(item)}
        className={`m-1 rounded-lg ${isSelected ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white'}`}
      >
        <Image
          source={{ uri: item.imagePath }}
          className="w-20 h-20 rounded-lg"
          resizeMode="cover"
        />
        {isSelected && (
          <View className="absolute top-1 right-1 bg-blue-500 rounded-full">
            <Ionicons name="checkmark" size={16} color="white" />
          </View>
        )}
        <Text className="text-xs text-gray-600 mt-1 text-center px-1" numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {outfits.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="layers-outline" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4">No outfits created yet</Text>
          <Text className="text-gray-400 text-center mt-2 px-8">
            Create your first outfit by combining items from your wardrobe
          </Text>
        </View>
      ) : (
        <FlatList
          data={outfits}
          renderItem={renderOutfit}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 8 }}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleCreateOutfit}
        className="absolute bottom-6 right-6 bg-blue-500 rounded-full w-14 h-14 justify-center items-center shadow-lg"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Create Outfit Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text className="text-blue-500 text-lg">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-lg font-semibold">Create Outfit</Text>
            <TouchableOpacity onPress={saveOutfit}>
              <Text className="text-blue-500 text-lg font-semibold">Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView className="flex-1 p-4">
            <Text className="text-lg font-semibold mb-2">Outfit Name</Text>
            <TextInput
              value={outfitName}
              onChangeText={setOutfitName}
              placeholder="Enter outfit name"
              className="border border-gray-300 rounded-lg p-3 mb-4"
            />
            
            <Text className="text-lg font-semibold mb-2">
              Select Items ({selectedItems.length} selected)
            </Text>
            
            {clothingItems.length === 0 ? (
              <View className="flex-1 justify-center items-center py-8">
                <Text className="text-gray-500">No items in your wardrobe</Text>
                <Text className="text-gray-400 text-center mt-2">
                  Add some clothes first to create outfits
                </Text>
              </View>
            ) : (
              <FlatList
                data={clothingItems}
                renderItem={renderClothingItem}
                keyExtractor={(item) => item.id}
                numColumns={4}
                scrollEnabled={false}
              />
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default OutfitsScreen;
