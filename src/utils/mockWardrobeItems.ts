import { ClothingItem } from '../types';

export const mockWardrobeItems: ClothingItem[] = [
  {
    id: '1',
    name: "Man's Blue Shirt",
    category: 'tops',
    color: 'blue',
    imagePath: 'https://m.media-amazon.com/images/I/519-6fgzdQL._UY1000_.jpg',
    dateAdded: new Date().toISOString(),
    tags: [],
  },
  {
    id: '2',
    name: 'White T-Shirt',
    category: 'tops',
    color: 'white',
    imagePath: 'https://cdn.pixabay.com/photo/2016/03/31/19/56/t-shirt-1296314_1280.png',
    dateAdded: new Date().toISOString(),
    tags: [],
  },
  {
    id: '3',
    name: 'Jeans',
    category: 'bottoms',
    color: 'blue',
    imagePath: 'https://example.com/jeans-placeholder.jpg',
    dateAdded: new Date().toISOString(),
    tags: [],
  },
];
