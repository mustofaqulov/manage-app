import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import type {TestListResponse} from '../../api/types'
import {colors, typography, spacing, borderRadius, getLevelColor} from '../../theme'

interface Props {
  test: TestListResponse
  onPress: () => void
  isPremium?: boolean
  showLock?: boolean
}

export default function TestCard({test, onPress, isPremium = false, showLock = false}: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.headerRow}>
        <View style={[styles.levelBadge, {backgroundColor: getLevelColor(test.cefrLevel)}]}>
          <Text style={styles.levelText}>{test.cefrLevel}</Text>
        </View>
        {showLock && (
          <View style={styles.lockBadge}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}
      </View>

      <Text style={[styles.title, isPremium && styles.titleLocked]} numberOfLines={2}>
        {test.title}
      </Text>

      {test.description && (
        <Text style={styles.description} numberOfLines={2}>
          {test.description}
        </Text>
      )}

      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <Text style={styles.metaText}>{test.sectionCount} sections</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaText}>{test.timeLimitMinutes} min</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  levelBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  levelText: {
    ...typography.labelSmall,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  lockBadge: {
    backgroundColor: colors.WARNING + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  lockIcon: {
    fontSize: 16,
  },
  title: {
    ...typography.titleLarge,
    marginBottom: spacing.xs,
  },
  titleLocked: {
    opacity: 0.7,
  },
  description: {
    ...typography.bodyMedium,
    marginBottom: spacing.sm,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...typography.bodySmall,
  },
})
