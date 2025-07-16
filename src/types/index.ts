export interface ClothingItem {
  id: string;
  name: string;
  category: 'tops' | 'bottoms' | 'shoes' | 'accessories' | 'outerwear';
  color: string;
  imagePath: string;
  dateAdded: string;
  tags?: string[];
}

export interface Outfit {
  id: string;
  name: string;
  items: ClothingItem[];
  createdDate: string;
  imagePreview?: string;
}

export interface OnlineItem {
  id: string;
  name: string;
  category: 'tops' | 'bottoms' | 'shoes' | 'accessories' | 'outerwear';
  price: number;
  imageUrl: string;
  brand: string;
  description?: string;
}

export type ClothingCategory = 'tops' | 'bottoms' | 'shoes' | 'accessories' | 'outerwear';
