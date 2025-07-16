import { ClothingItem } from '../types';

export const mockWardrobeItems: ClothingItem[] = [
  {
    id: '1',
    name: "Blue Shirt",
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
    imagePath: 'https://m.media-amazon.com/images/I/41uF42-1WwL._UY1000_.jpg',
    dateAdded: new Date().toISOString(),
    tags: [],
  },
  {
    id: '3',
    name: 'Shorts',
    category: 'bottoms',
    color: 'black',
    imagePath: 'https://m.media-amazon.com/images/I/618l+TYkF3L._AC_SX679_.jpg',
    dateAdded: new Date().toISOString(),
    tags: [],
  },
  {
    id: '4',
    name: 'Fishing Short',
    category: 'bottoms',
    color: 'beige',
    imagePath: 'https://m.media-amazon.com/images/I/51ZoGBlWEgL._AC_SX679_.jpg',
    dateAdded: new Date().toISOString(),
    tags: [],
  }
];
