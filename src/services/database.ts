import * as SQLite from 'expo-sqlite';
import { ClothingItem, Outfit } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('wardrobe.db');
  }
  return db;
};

export const initDatabase = async (): Promise<void> => {
  try {
    console.log('Initializing database...');
    const database = await getDatabase();
    
    console.log('Creating clothes table...');
    // Create clothes table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS clothes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        color TEXT NOT NULL,
        imagePath TEXT NOT NULL,
        dateAdded TEXT NOT NULL,
        tags TEXT
      );
    `);

    console.log('Creating outfits table...');
    // Create outfits table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS outfits (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        items TEXT NOT NULL,
        createdDate TEXT NOT NULL,
        imagePreview TEXT
      );
    `);

    // Verify tables were created
    console.log('Verifying table creation...');
    const clothesTableInfo = await database.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='clothes';"
    );
    const outfitsTableInfo = await database.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='outfits';"
    );

    if (clothesTableInfo.length === 0) {
      throw new Error('Failed to create clothes table');
    }
    if (outfitsTableInfo.length === 0) {
      throw new Error('Failed to create outfits table');
    }

    console.log('Database initialization completed successfully');
    console.log('Tables created:', { clothes: clothesTableInfo.length > 0, outfits: outfitsTableInfo.length > 0 });
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export const addClothingItem = async (item: ClothingItem): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT INTO clothes (id, name, category, color, imagePath, dateAdded, tags) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [item.id, item.name, item.category, item.color, item.imagePath, item.dateAdded, JSON.stringify(item.tags || [])]
  );
};

export const getClothingItems = async (): Promise<ClothingItem[]> => {
  const database = await getDatabase();
  const rows = await database.getAllAsync('SELECT * FROM clothes ORDER BY dateAdded DESC');
  
  return rows.map((row: any) => ({
    ...row,
    tags: JSON.parse(row.tags || '[]')
  })) as ClothingItem[];
};

export const deleteClothingItem = async (id: string): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM clothes WHERE id = ?', [id]);
};

export const addOutfit = async (outfit: Outfit): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT INTO outfits (id, name, items, createdDate, imagePreview) VALUES (?, ?, ?, ?, ?)',
    [outfit.id, outfit.name, JSON.stringify(outfit.items), outfit.createdDate, outfit.imagePreview || '']
  );
};

export const getOutfits = async (): Promise<Outfit[]> => {
  const database = await getDatabase();
  const rows = await database.getAllAsync('SELECT * FROM outfits ORDER BY createdDate DESC');
  
  return rows.map((row: any) => ({
    ...row,
    items: JSON.parse(row.items)
  })) as Outfit[];
};

export const deleteOutfit = async (id: string): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM outfits WHERE id = ?', [id]);
};
