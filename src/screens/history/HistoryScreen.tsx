import React from 'react'
import {View, Text, StyleSheet, FlatList} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useGetAttemptHistoryQuery} from '../../store/api'
import {colors, typography, spacing, borderRadius} from '../../theme'
import {format} from 'date-fns'

export default function HistoryScreen() {
  const {data, isLoading} = useGetAttemptHistoryQuery({})

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    )
  }

  const attempts = data?.items || []

  // Calculate stats
  const totalExams = attempts.length
  const avgScore =
    attempts.reduce((sum, a) => sum + (a.scorePercentage || 0), 0) / totalExams || 0
  const bestScore = Math.max(...attempts.map(a => a.scorePercentage || 0))

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalExams}</Text>
          <Text style={styles.statLabel}>Total Exams</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{avgScore.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Avg Score</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{bestScore.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Best Score</Text>
        </View>
      </View>

      <FlatList
        data={attempts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <View style={styles.attemptCard}>
            <Text style={styles.attemptTitle}>{item.testTitle || 'Test'}</Text>
            <Text style={styles.attemptDate}>
              {format(new Date(item.startedAt), 'dd MMM yyyy, HH:mm')}
            </Text>
            {item.scorePercentage != null && (
              <Text style={styles.attemptScore}>{item.scorePercentage.toFixed(1)}%</Text>
            )}
            <Text style={styles.attemptStatus}>{item.status}</Text>
          </View>
        )}
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
  },
  loadingText: {
    ...typography.bodyLarge,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    ...typography.headlineMedium,
    color: colors.PRIMARY_ORANGE,
  },
  statLabel: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  attemptCard: {
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  attemptTitle: {
    ...typography.titleLarge,
    marginBottom: spacing.xs,
  },
  attemptDate: {
    ...typography.bodySmall,
    marginBottom: spacing.sm,
  },
  attemptScore: {
    ...typography.headlineSmall,
    color: colors.PRIMARY_ORANGE,
    marginBottom: spacing.xs,
  },
  attemptStatus: {
    ...typography.labelSmall,
    textTransform: 'uppercase',
  },
})
