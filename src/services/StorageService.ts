import AsyncStorage from '@react-native-async-storage/async-storage'
import {STORAGE_KEYS} from '../config/constants'
import type {UserResponse} from '../api/types'

class StorageService {
  // Auth Token
  async saveAuthToken(token: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
  }

  async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  }

  async removeAuthToken(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  }

  // User Data
  async saveUser(user: UserResponse): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))
  }

  async getUser(): Promise<UserResponse | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA)
    return data ? JSON.parse(data) : null
  }

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA)
  }

  // Language
  async saveLanguage(lang: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang)
  }

  async getLanguage(): Promise<string> {
    const lang = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE)
    return lang || 'uz'
  }

  // Legacy User
  async saveLegacyUser(user: any): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LEGACY_USER, JSON.stringify(user))
  }

  async getLegacyUser(): Promise<any | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LEGACY_USER)
    return data ? JSON.parse(data) : null
  }

  // Clear all
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.LEGACY_USER,
    ])
  }
}

export default new StorageService()
