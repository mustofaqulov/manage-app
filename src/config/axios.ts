import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {API_BASE_URL, STORAGE_KEYS} from './constants'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: Add auth token
apiClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => Promise.reject(error),
)

// Response interceptor: Handle 401 errors
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA)
      // Navigation will be handled by Redux state change
    }

    return Promise.reject(error)
  },
)

export default apiClient
