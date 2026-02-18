import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type {UserResponse} from '../../api/types'
import {api} from '../api'
import {STORAGE_KEYS} from '../../config/constants'

interface AuthState {
  user: UserResponse | null
  token: string | null
  isAuthenticated: boolean
  missingInfo: boolean
  legacyUser: {
    id: string
    phone: string
    isSubscribed: boolean
    subscriptionExpiry?: string
  } | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  missingInfo: false,
  legacyUser: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{user: UserResponse; token: string}>,
    ) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      // AsyncStorage updates handled by middleware or in component
    },
    setUser: (state, action: PayloadAction<UserResponse>) => {
      state.user = action.payload
    },
    setLegacyUser: (
      state,
      action: PayloadAction<{
        id: string
        phone: string
        isSubscribed: boolean
        subscriptionExpiry?: string
      }>,
    ) => {
      state.legacyUser = action.payload
      state.isAuthenticated = true
    },
    logout: state => {
      state.user = null
      state.token = null
      state.legacyUser = null
      state.isAuthenticated = false
      state.missingInfo = false
      // Clear AsyncStorage
      AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.LEGACY_USER,
      ])
    },
    setMissingInfo: (state, action: PayloadAction<boolean>) => {
      state.missingInfo = action.payload
    },
    // Hydrate state from AsyncStorage on app start
    hydrateAuth: (
      state,
      action: PayloadAction<{
        user: UserResponse | null
        token: string | null
        legacyUser: AuthState['legacyUser']
      }>,
    ) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.legacyUser = action.payload.legacyUser
      state.isAuthenticated = !!(action.payload.token || action.payload.legacyUser)
    },
  },
  extraReducers: builder => {
    // Login mutation
    builder.addMatcher(api.endpoints.login.matchFulfilled, (state, {payload}) => {
      state.token = payload.token
      state.isAuthenticated = true
      state.missingInfo = payload.missingInfo
      AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, payload.token)
    })

    // Get me query
    builder.addMatcher(api.endpoints.getMe.matchFulfilled, (state, {payload}) => {
      state.user = payload
      AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(payload))
    })

    // Update me mutation
    builder.addMatcher(api.endpoints.updateMe.matchFulfilled, (state, {payload}) => {
      state.user = payload
      state.missingInfo = false
      AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(payload))
    })
  },
})

export const {setCredentials, setUser, setLegacyUser, logout, setMissingInfo, hydrateAuth} =
  authSlice.actions
export default authSlice.reducer
