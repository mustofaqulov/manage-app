import React from 'react'
import {StatusBar, StyleSheet} from 'react-native'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {Provider as ReduxProvider} from 'react-redux'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'

import {store} from './store'
import {colors} from './theme'
import {RootNavigator} from './navigation/RootNavigator'
import './i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
})

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <StatusBar
              barStyle="light-content"
              backgroundColor={colors.BACKGROUND_DARK}
            />
            <RootNavigator />
            <Toast />
          </SafeAreaProvider>
        </QueryClientProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default App
