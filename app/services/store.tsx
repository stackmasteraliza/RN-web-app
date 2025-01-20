import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

class SecureStorage {
  // Save data
  static async saveData(key: string, value: string) {
    try {
      if (Platform.OS === 'web') {
        await localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
      console.log(`Data saved with key: ${key}`);
    } catch (error) {
      console.log('Error saving data:', error);
    }
  }

  // Retrieve data
  static async getData(key: string) {
    try {
      if (Platform.OS === 'web') {
        return await localStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.log('Error retrieving data:', error);
      return null;
    }
  }

  // Remove data
  static async removeData(key: string) {
    try {
      if (Platform.OS === 'web') {
        await localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
      console.log(`Data removed with key: ${key}`);
    } catch (error) {
      console.log('Error removing data:', error);
    }
  }
}

export default SecureStorage;
