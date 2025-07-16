import { getDatabase } from '../services/database';

export const testDatabaseTables = async (): Promise<void> => {
  try {
    const database = await getDatabase();
    
    // Check if tables exist
    const tables = await database.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table';"
    );
    
    console.log('Available tables:', tables);
    
    // Check clothes table structure
    const clothesSchema = await database.getAllAsync(
      "PRAGMA table_info(clothes);"
    );
    console.log('Clothes table schema:', clothesSchema);
    
    // Check outfits table structure
    const outfitsSchema = await database.getAllAsync(
      "PRAGMA table_info(outfits);"
    );
    console.log('Outfits table schema:', outfitsSchema);
    
    // Test inserting and retrieving a sample item
    const testItem = {
      id: 'test-' + Date.now(),
      name: 'Test Item',
      category: 'tops' as const,
      color: 'blue',
      imagePath: '/test/path',
      dateAdded: new Date().toISOString(),
      tags: ['test']
    };
    
    await database.runAsync(
      'INSERT INTO clothes (id, name, category, color, imagePath, dateAdded, tags) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [testItem.id, testItem.name, testItem.category, testItem.color, testItem.imagePath, testItem.dateAdded, JSON.stringify(testItem.tags)]
    );
    
    const retrievedItems = await database.getAllAsync('SELECT * FROM clothes WHERE id = ?', [testItem.id]);
    console.log('Test item inserted and retrieved:', retrievedItems);
    
    // Clean up test item
    await database.runAsync('DELETE FROM clothes WHERE id = ?', [testItem.id]);
    console.log('Test item cleaned up');
    
    console.log('✅ Database test completed successfully!');
  } catch (error) {
    console.error('❌ Database test failed:', error);
    throw error;
  }
};
