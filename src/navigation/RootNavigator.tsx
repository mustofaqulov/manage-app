import React, {useEffect} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import type {NavigatorScreenParams} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {View, Text, StyleSheet} from 'react-native'
import {useAppSelector, useAppDispatch} from '../store/hooks'
import {hydrateAuth} from '../store/slices/authSlice'
import StorageService from '../services/StorageService'
import {colors} from '../theme'

// Screens
import LoginScreen from '../screens/auth/LoginScreen'
import HomeScreen from '../screens/home/HomeScreen'
import MockExamScreen from '../screens/tests/MockExamScreen'
import ExamFlowScreen from '../screens/exam/ExamFlowScreen'
import HistoryScreen from '../screens/history/HistoryScreen'
import ProfileScreen from '../screens/profile/ProfileScreen'
import AboutScreen from '../screens/about/AboutScreen'
import SubscribeScreen from '../screens/subscribe/SubscribeScreen'
import CourseDetailScreen from '../screens/course/CourseDetailScreen'
import LeaderboardScreen from '../screens/leaderboard/LeaderboardScreen'
import CustomExamScreen from '../screens/exam/CustomExamScreen'

export type RootStackParamList = {
  Login: undefined
  Main: NavigatorScreenParams<TabParamList> | undefined
  ExamFlow: {testId: string; mode?: 'full' | 'random' | 'custom'; selectedSectionIds?: string[]}
  CustomExam: undefined
  About: undefined
  Subscribe: undefined
  CourseDetail: undefined
  Leaderboard: undefined
}

export type TabParamList = {
  Home: undefined
  MockExam: undefined
  History: undefined
  Profile: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<TabParamList>()

function TabIcon({name, focused}: {name: string; focused: boolean}) {
  const icons: Record<string, string> = {
    Home: '🏠',
    MockExam: '📝',
    History: '📊',
    Profile: '👤',
  }
  return (
    <View style={styles.tabIcon}>
      <Text style={styles.tabEmoji}>{icons[name]}</Text>
      {focused && <View style={styles.tabDot} />}
    </View>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.PRIMARY_ORANGE,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({focused}) => <TabIcon name={route.name} focused={focused} />,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{tabBarLabel: 'Bosh sahifa'}} />
      <Tab.Screen name="MockExam" component={MockExamScreen} options={{tabBarLabel: 'Imtihon'}} />
      <Tab.Screen name="History" component={HistoryScreen} options={{tabBarLabel: 'Tarix'}} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{tabBarLabel: 'Profil'}} />
    </Tab.Navigator>
  )
}

export function RootNavigator() {
  const {isAuthenticated} = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
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
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="ExamFlow" component={ExamFlowScreen} />
            <Stack.Screen name="CustomExam" component={CustomExamScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Subscribe" component={SubscribeScreen} />
            <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0A0A0A',
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
    height: 70,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  tabIcon: {
    alignItems: 'center',
  },
  tabEmoji: {
    fontSize: 22,
  },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.PRIMARY_ORANGE,
    marginTop: 2,
  },
})
