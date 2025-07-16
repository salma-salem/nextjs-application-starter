import * as FileSystem from 'expo-file-system';

const WARDROBE_DIR = `${FileSystem.documentDirectory}wardrobe/`;

export const initStorage = async () => {
  const dirInfo = await FileSystem.getInfoAsync(WARDROBE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(WARDROBE_DIR, { intermediates: true });
  }
};

export const saveImage = async (uri: string, filename: string): Promise<string> => {
  await initStorage();
  const newPath = `${WARDROBE_DIR}${filename}`;
  await FileSystem.copyAsync({
    from: uri,
    to: newPath,
  });
  return newPath;
};

export const deleteImage = async (path: string): Promise<void> => {
  const fileInfo = await FileSystem.getInfoAsync(path);
  if (fileInfo.exists) {
    await FileSystem.deleteAsync(path);
  }
};

export const getImageUri = (path: string): string => {
  return path;
};
