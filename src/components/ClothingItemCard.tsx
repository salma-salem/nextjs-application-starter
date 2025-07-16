import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClothingItem } from '../types';

interface ClothingItemCardProps {
  item: ClothingItem;
  onPress?: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
  selected?: boolean;
}

const ClothingItemCard: React.FC<ClothingItemCardProps> = ({
  item,
  onPress,
  onDelete,
  showDelete = false,
  selected = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white rounded-lg shadow-md m-2 p-3 flex-1 ${
        selected ? 'border-2 border-blue-500' : ''
      }`}
    >
      <Image
        source={{ uri: item.imagePath }}
        className="w-full h-32 rounded-lg mb-2"
        resizeMode="cover"
      />
      <Text className="font-semibold text-gray-800 mb-1" numberOfLines={2}>
        {item.name}
      </Text>
      <Text className="text-sm text-gray-600 mb-1 capitalize">
        {item.category}
      </Text>
      <Text className="text-sm text-gray-500">{item.color}</Text>
      
      {selected && (
        <View className="absolute top-2 left-2 bg-blue-500 rounded-full p-1">
          <Ionicons name="checkmark" size={16} color="white" />
        </View>
      )}
      
      {showDelete && onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
        >
          <Ionicons name="trash-outline" size={16} color="white" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default ClothingItemCard;
