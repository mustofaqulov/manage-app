import React from 'react'
import {View, Text, StyleSheet, FlatList, Alert} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useNavigation} from '@react-navigation/native'
import type {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {useGetTestsQuery, useGetSubscriptionQuery} from '../../store/api'
import type {RootStackParamList} from '../../navigation/RootNavigator'
import {colors, typography, spacing} from '../../theme'
import TestCard from '../../components/common/TestCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorView from '../../components/common/ErrorView'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export default function TestsScreen() {
  const navigation = useNavigation<NavigationProp>()
  const {data, isLoading, error, refetch} = useGetTestsQuery({})
  const {data: subscription, isLoading: subscriptionLoading} = useGetSubscriptionQuery()

  const handleTestPress = (testId: string) => {
    // Check if user has subscription for premium tests
    if (!subscription?.isSubscribed) {
      Alert.alert(
        'Premium Content',
        'This test requires a premium subscription. Please upgrade to access all tests.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Upgrade',
            onPress: () => {
              // TODO: Navigate to subscription/upgrade screen
              Alert.alert('Coming Soon', 'Subscription upgrade feature will be available soon.')
            },
          },
        ],
      )
      return
    }
    navigation.navigate('ExamFlow', {testId})
  }

  if (isLoading || subscriptionLoading) {
    return <LoadingSpinner text="Loading tests..." />
  }

  if (error) {
    return <ErrorView message="Failed to load tests" onRetry={refetch} />
  }

  const isSubscribed = subscription?.isSubscribed || false

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Test</Text>
        <Text style={styles.subtitle}>Choose your IELTS speaking mock exam</Text>
      </View>

      <FlatList
        data={data?.items || []}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <TestCard
            test={item}
            onPress={() => handleTestPress(item.id)}
            isPremium={!isSubscribed}
            showLock={!isSubscribed}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tests available</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_DARK,
  },
  header: {
    padding: spacing.lg,
  },
  title: {
    ...typography.headlineLarge,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodyMedium,
  },
  list: {
    padding: spacing.lg,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.bodyLarge,
  },
})
