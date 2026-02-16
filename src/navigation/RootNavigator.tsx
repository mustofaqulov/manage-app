import React, {useEffect} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {useAppSelector, useAppDispatch} from '../store/hooks'
import {hydrateAuth} from '../store/slices/authSlice'
import StorageService from '../services/StorageService'

// Screens
import LoginScreen from '../screens/auth/LoginScreen'
import HomeScreen from '../screens/home/HomeScreen'
import TestsScreen from '../screens/tests/TestsScreen'
import ExamFlowScreen from '../screens/exam/ExamFlowScreen'
import HistoryScreen from '../screens/history/HistoryScreen'
import ProfileScreen from '../screens/profile/ProfileScreen'

export type RootStackParamList = {
  Login: undefined
  Home: undefined
  Tests: undefined
  ExamFlow: {testId: string}
  History: undefined
  Profile: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export function RootNavigator() {
  const {isAuthenticated} = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Hydrate auth state from AsyncStorage
    const loadAuthState = async () => {
      const token = await StorageService.getAuthToken()
      const user = await StorageService.getUser()
      const legacyUser = await StorageService.getLegacyUser()

      dispatch(hydrateAuth({token, user, legacyUser}))
    }

    loadAuthState()
  }, [dispatch])

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: '#050505'},
        }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Tests" component={TestsScreen} />
            <Stack.Screen name="ExamFlow" component={ExamFlowScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
