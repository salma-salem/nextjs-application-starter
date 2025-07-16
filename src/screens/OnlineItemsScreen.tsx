import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OnlineItem, ClothingCategory } from '../types';

// Mock online items data
const mockOnlineItems: OnlineItem[] = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    category: 'tops',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    brand: 'StyleCo',
    description: 'Comfortable cotton t-shirt perfect for everyday wear',
  },
  {
    id: '2',
    name: 'Denim Jeans',
    category: 'bottoms',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    brand: 'DenimPlus',
    description: 'Classic blue jeans with a modern fit',
  },
  {
    id: '3',
    name: 'Leather Sneakers',
    category: 'shoes',
    price: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    brand: 'FootWear',
    description: 'Premium leather sneakers for casual wear',
  },
  {
    id: '4',
    name: 'Wool Sweater',
    category: 'tops',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
    brand: 'WarmWear',
    description: 'Cozy wool sweater for cold weather',
  },
  {
    id: '5',
    name: 'Black Dress',
    category: 'tops',
    price: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    brand: 'ElegantStyle',
    description: 'Elegant black dress for special occasions',
  },
  {
    id: '6',
    name: 'Leather Jacket',
    category: 'outerwear',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    brand: 'RockStyle',
    description: 'Classic leather jacket with modern styling',
  },
];

const categories: ClothingCategory[] = ['tops', 'bottoms', 'shoes', 'accessories', 'outerwear'];

const OnlineItemsScreen = () => {
  const [items, setItems] = useState<OnlineItem[]>(mockOnlineItems);
  const [filteredItems, setFilteredItems] = useState<OnlineItem[]>(mockOnlineItems);
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    filterItems();
  }, [selectedCategory, searchQuery, items]);

  const filterItems = () => {
    let filtered = items;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const handleAddToWishlist = (item: OnlineItem) => {
    Alert.alert(
      'Add to Wishlist',
      `Would you like to add "${item.name}" to your wishlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: () => {
            Alert.alert('Success', 'Item added to wishlist!');
          },
        },
      ]
    );
  };

  const renderOnlineItem = ({ item }: { item: OnlineItem }) => (
    <View className="bg-white rounded-lg shadow-md m-2 p-3 flex-1">
      <Image
        source={{ uri: item.imageUrl }}
        className="w-full h-32 rounded-lg mb-2"
        resizeMode="cover"
      />
      <Text className="font-semibold text-gray-800 mb-1" numberOfLines={2}>
        {item.name}
      </Text>
      <Text className="text-sm text-gray-600 mb-1">{item.brand}</Text>
      <Text className="text-sm text-gray-500 mb-2 capitalize">{item.category}</Text>
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-bold text-green-600">
          ${item.price.toFixed(2)}
        </Text>
        <TouchableOpacity
          onPress={() => handleAddToWishlist(item)}
          className="bg-blue-500 rounded-full p-2"
        >
          <Ionicons name="heart-outline" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
      {/* Search Bar */}
      <View className="bg-white p-4 shadow-sm">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-3">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search items..."
            className="flex-1 ml-2 text-gray-700"
          />
        </View>
        
        {/* Category Filter */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['all', ...categories]}
          renderItem={({ item }) => renderCategoryButton(item as ClothingCategory | 'all')}
          keyExtractor={(item) => item}
        />
      </View>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="storefront-outline" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4">No items found</Text>
          <Text className="text-gray-400 text-center mt-2 px-8">
            Try adjusting your search or category filter
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderOnlineItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
        />
      )}
    </View>
  );
};

export default OnlineItemsScreen;
