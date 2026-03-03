import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {UserResponse} from '../../api/types'
import {api} from '../api'

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
      // AsyncStorage cleanup handled by authPersistenceMiddleware
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
    // Login mutation — update Redux state synchronously
    builder.addMatcher(api.endpoints.login.matchFulfilled, (state, {payload}) => {
      state.token = payload.token
      state.isAuthenticated = true
      state.missingInfo = payload.missingInfo
      // AsyncStorage persistence handled by authPersistenceMiddleware
    })

    // Get me query
    builder.addMatcher(api.endpoints.getMe.matchFulfilled, (state, {payload}) => {
      state.user = payload
      // AsyncStorage persistence handled by authPersistenceMiddleware
    })

    // Update me mutation
    builder.addMatcher(api.endpoints.updateMe.matchFulfilled, (state, {payload}) => {
      state.user = payload
      state.missingInfo = false
      // AsyncStorage persistence handled by authPersistenceMiddleware
    })
  },
})

export const {setCredentials, setUser, setLegacyUser, logout, setMissingInfo, hydrateAuth} =
  authSlice.actions
export default authSlice.reducer
