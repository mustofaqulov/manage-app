import {createListenerMiddleware, isAnyOf} from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {STORAGE_KEYS} from '../../config/constants'
import {logout, setLegacyUser} from '../slices/authSlice'
import {api} from '../api'

export const authPersistenceMiddleware = createListenerMiddleware()

// Persist token after login
authPersistenceMiddleware.startListening({
  matcher: api.endpoints.login.matchFulfilled,
  effect: async action => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, action.payload.token)
    } catch (err) {
      console.warn('Failed to persist auth token:', err)
    }
  },
})

// Persist user after getMe or updateMe
authPersistenceMiddleware.startListening({
  matcher: isAnyOf(api.endpoints.getMe.matchFulfilled, api.endpoints.updateMe.matchFulfilled),
  effect: async action => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(action.payload))
    } catch (err) {
      console.warn('Failed to persist user data:', err)
    }
  },
})

// Persist legacy user
authPersistenceMiddleware.startListening({
  actionCreator: setLegacyUser,
  effect: async action => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LEGACY_USER, JSON.stringify(action.payload))
    } catch (err) {
      console.warn('Failed to persist legacy user:', err)
    }
  },
})

// Clear storage on logout
authPersistenceMiddleware.startListening({
  actionCreator: logout,
  effect: async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.LEGACY_USER,
      ])
    } catch (err) {
      console.warn('Failed to clear auth storage:', err)
    }
  },
})
