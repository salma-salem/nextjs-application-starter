import { v4 as uuidv4 } from 'uuid';
import { addClothingItem, deleteClothingItem, getClothingItems } from '../services/database';
import { ClothingItem } from '../types';
import { mockWardrobeItems } from './mockWardrobeItems';

export const resetWardrobeItems = async () => {
  try {
    // Delete all existing clothes
    const existingItems = await getClothingItems();
    for (const item of existingItems) {
      await deleteClothingItem(item.id);
    }

    const clothesToAdd: ClothingItem[] = mockWardrobeItems;

    for (const item of clothesToAdd) {
      await addClothingItem(item);
      console.log(`Added ${item.name} to wardrobe.`);
    }
  } catch (error) {
    console.error('Error resetting wardrobe items:', error);
  }
};
