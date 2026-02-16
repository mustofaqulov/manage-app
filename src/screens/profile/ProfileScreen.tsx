import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useTranslation} from 'react-i18next'
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {useGetSubscriptionQuery} from '../../store/api'
import {logout} from '../../store/slices/authSlice'
import {colors, typography, spacing, borderRadius} from '../../theme'

export default function ProfileScreen() {
  const {t} = useTranslation()
  const dispatch = useAppDispatch()
  const {user} = useAppSelector(state => state.auth)
  const {data: subscription, isLoading: subscriptionLoading} = useGetSubscriptionQuery()

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleUpgrade = () => {
    // TODO: Navigate to subscription/upgrade screen
    Alert.alert('Coming Soon', 'Subscription upgrade feature will be available soon.')
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>

        {/* Subscription Card */}
        {subscription && (
          <View
            style={[
              styles.subscriptionCard,
              subscription.isSubscribed ? styles.subscriptionActive : styles.subscriptionInactive,
            ]}>
            <View style={styles.subscriptionHeader}>
              <Text style={styles.subscriptionTitle}>
                {subscription.isSubscribed ? '✅ Premium Active' : '🔒 Free Plan'}
              </Text>
              {!subscription.isSubscribed && (
                <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
                  <Text style={styles.upgradeButtonText}>Upgrade</Text>
                </TouchableOpacity>
              )}
            </View>

            {subscription.isSubscribed && (
              <View style={styles.subscriptionDetails}>
                <View style={styles.dateRow}>
                  <Text style={styles.dateLabel}>Start Date:</Text>
                  <Text style={styles.dateValue}>{formatDate(subscription.startDate)}</Text>
                </View>
                <View style={styles.dateRow}>
                  <Text style={styles.dateLabel}>End Date:</Text>
                  <Text style={styles.dateValue}>{formatDate(subscription.endDate)}</Text>
                </View>
              </View>
            )}

            {!subscription.isSubscribed && (
              <Text style={styles.subscriptionDescription}>
                Upgrade to Premium to access all tests and features
              </Text>
            )}
          </View>
        )}

        {/* User Info Card */}
        {user && (
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>
              {user.firstName} {user.lastName}
            </Text>

            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user.phone}</Text>

            {user.email && (
              <>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t('auth.logout')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_DARK,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    ...typography.headlineLarge,
    marginBottom: spacing.xl,
  },
  subscriptionCard: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  subscriptionActive: {
    backgroundColor: colors.SUCCESS + '20',
    borderColor: colors.SUCCESS,
  },
  subscriptionInactive: {
    backgroundColor: colors.CARD_GLASS,
    borderColor: colors.CARD_BORDER,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  subscriptionTitle: {
    ...typography.titleLarge,
    fontWeight: '600',
  },
  upgradeButton: {
    backgroundColor: colors.PRIMARY_ORANGE,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  upgradeButtonText: {
    ...typography.labelSmall,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  subscriptionDetails: {
    marginTop: spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.xs,
  },
  dateLabel: {
    ...typography.bodyMedium,
    opacity: 0.7,
  },
  dateValue: {
    ...typography.bodyMedium,
    fontWeight: '500',
  },
  subscriptionDescription: {
    ...typography.bodyMedium,
    opacity: 0.7,
    marginTop: spacing.xs,
  },
  infoCard: {
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  infoLabel: {
    ...typography.labelSmall,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography.titleLarge,
  },
  logoutButton: {
    backgroundColor: colors.ERROR,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  logoutText: {
    ...typography.labelLarge,
    color: '#FFFFFF',
  },
})
