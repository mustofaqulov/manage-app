import React from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useNavigation} from '@react-navigation/native'
import type {CompositeNavigationProp} from '@react-navigation/native'
import type {NativeStackNavigationProp} from '@react-navigation/native-stack'
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs'
import LinearGradient from 'react-native-linear-gradient'
import {useAppSelector} from '../../store/hooks'
import {useGetAttemptHistoryQuery, useGetSubscriptionQuery} from '../../store/api'
import type {RootStackParamList, TabParamList} from '../../navigation/RootNavigator'
import {colors, typography, spacing, borderRadius} from '../../theme'

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>()
  const {user} = useAppSelector(state => state.auth)
  const {data: history} = useGetAttemptHistoryQuery({size: 5})
  const {data: subscription} = useGetSubscriptionQuery()

  const attempts = history?.items || []
  const totalExams = attempts.length
  const avgScore =
    totalExams > 0
      ? attempts.reduce((sum, a) => sum + (a.scorePercentage || 0), 0) / totalExams
      : 0
  const bestScore = totalExams > 0 ? Math.max(...attempts.map(a => a.scorePercentage || 0)) : 0

  const isSubscribed = subscription?.isSubscribed || false

  const quickActions = [
    {
      icon: '📋',
      label: 'Full Exam',
      desc: 'To\'liq imtihon',
      color: '#3B82F6',
      onPress: () => navigation.navigate('MockExam'),
    },
    {
      icon: '🎲',
      label: 'Random',
      desc: 'Tasodifiy savol',
      color: '#8B5CF6',
      onPress: () => navigation.navigate('MockExam'),
    },
    {
      icon: '⚙️',
      label: 'Custom',
      desc: 'O\'zim sozlayman',
      color: colors.PRIMARY_ORANGE,
      onPress: () => navigation.navigate('CustomExam'),
    },
    {
      icon: '🏆',
      label: 'Reyting',
      desc: 'Top o\'rinlar',
      color: '#F59E0B',
      onPress: () => navigation.navigate('Leaderboard'),
    },
  ]

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Xayrli tong'
    if (h < 17) return 'Xayrli kun'
    return 'Xayrli kech'
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.userName}>
              {user?.firstName ? `${user.firstName} 👋` : 'Foydalanuvchi 👋'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.subscriptionBadge, isSubscribed ? styles.premiumBadge : styles.freeBadge]}
            onPress={() => navigation.navigate('Subscribe')}>
            <Text style={styles.subscriptionBadgeText}>
              {isSubscribed ? '⭐ Premium' : '🔒 Free'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        {totalExams > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalExams}</Text>
              <Text style={styles.statLabel}>Imtihon</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{avgScore.toFixed(0)}%</Text>
              <Text style={styles.statLabel}>O'rtacha</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, {color: colors.PRIMARY_ORANGE}]}>{bestScore.toFixed(0)}%</Text>
              <Text style={styles.statLabel}>Eng yuqori</Text>
            </View>
          </View>
        )}

        {/* Hero CTA */}
        <TouchableOpacity
          onPress={() => navigation.navigate('MockExam')}
          activeOpacity={0.9}>
          <LinearGradient
            colors={[colors.PRIMARY_ORANGE, '#FF4500']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.heroCta}>
            <View>
              <Text style={styles.heroCtaLabel}>Tayyor bo'lsangiz</Text>
              <Text style={styles.heroCtaTitle}>Imtihonni boshlang</Text>
            </View>
            <View style={styles.heroCtaIcon}>
              <Text style={{fontSize: 32}}>▶</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Tezkor amallar</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickActionCard}
              onPress={action.onPress}
              activeOpacity={0.8}>
              <View style={[styles.quickActionIconBox, {backgroundColor: action.color + '20'}]}>
                <Text style={styles.quickActionIcon}>{action.icon}</Text>
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
              <Text style={styles.quickActionDesc}>{action.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Attempts */}
        {attempts.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>So'nggi natijalar</Text>
              <TouchableOpacity onPress={() => navigation.navigate('History')}>
                <Text style={styles.seeAll}>Barchasi →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.recentList}>
              {attempts.slice(0, 3).map(attempt => (
                <View key={attempt.id} style={styles.recentCard}>
                  <View style={styles.recentLeft}>
                    <Text style={styles.recentTitle} numberOfLines={1}>{attempt.testTitle}</Text>
                    <Text style={styles.recentDate}>
                      {new Date(attempt.startedAt).toLocaleDateString('uz')}
                    </Text>
                  </View>
                  {attempt.scorePercentage != null ? (
                    <Text style={styles.recentScore}>{attempt.scorePercentage.toFixed(0)}%</Text>
                  ) : (
                    <View style={styles.statusChip}>
                      <Text style={styles.statusChipText}>{attempt.status}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        {/* Navigation Cards */}
        <Text style={styles.sectionTitle}>Boshqa imkoniyatlar</Text>
        <View style={styles.navCards}>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('CourseDetail')}>
            <Text style={styles.navCardIcon}>🎓</Text>
            <Text style={styles.navCardTitle}>Kurs</Text>
            <Text style={styles.navCardDesc}>IELTS Speaking to'liq kurs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('About')}>
            <Text style={styles.navCardIcon}>ℹ️</Text>
            <Text style={styles.navCardTitle}>Haqida</Text>
            <Text style={styles.navCardDesc}>Platforma haqida ma'lumot</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.BACKGROUND_DARK},
  content: {padding: spacing.lg, gap: spacing.xl, paddingBottom: spacing.xxl},
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {...typography.bodyMedium, opacity: 0.5},
  userName: {...typography.headlineMedium, fontWeight: '800'},
  subscriptionBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  premiumBadge: {backgroundColor: colors.PRIMARY_ORANGE + '20', borderColor: colors.PRIMARY_ORANGE},
  freeBadge: {backgroundColor: colors.CARD_GLASS, borderColor: colors.CARD_BORDER},
  subscriptionBadgeText: {...typography.labelSmall, fontWeight: '700'},
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  statItem: {flex: 1, alignItems: 'center'},
  statValue: {...typography.headlineSmall, fontWeight: '800'},
  statLabel: {...typography.labelSmall, opacity: 0.4, marginTop: 2},
  statDivider: {width: 1, height: 30, backgroundColor: colors.CARD_BORDER},
  heroCta: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroCtaLabel: {...typography.bodySmall, color: 'rgba(255,255,255,0.7)'},
  heroCtaTitle: {...typography.headlineMedium, color: '#fff', fontWeight: '800'},
  heroCtaIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {...typography.titleLarge, fontWeight: '700'},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  seeAll: {...typography.labelMedium, color: colors.PRIMARY_ORANGE},
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickActionCard: {
    width: '47.5%',
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  quickActionIconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  quickActionIcon: {fontSize: 22},
  quickActionLabel: {...typography.labelLarge, fontWeight: '700'},
  quickActionDesc: {...typography.bodySmall, opacity: 0.4},
  recentList: {gap: spacing.sm},
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  recentLeft: {flex: 1},
  recentTitle: {...typography.labelLarge, fontWeight: '600'},
  recentDate: {...typography.bodySmall, opacity: 0.4, marginTop: 2},
  recentScore: {...typography.headlineSmall, fontWeight: '800', color: colors.PRIMARY_ORANGE},
  statusChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  statusChipText: {...typography.labelSmall, opacity: 0.5},
  navCards: {flexDirection: 'row', gap: spacing.sm},
  navCard: {
    flex: 1,
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  navCardIcon: {fontSize: 28},
  navCardTitle: {...typography.labelLarge, fontWeight: '700'},
  navCardDesc: {...typography.bodySmall, opacity: 0.4},
})
