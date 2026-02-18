import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useNavigation} from '@react-navigation/native'
import type {CompositeNavigationProp} from '@react-navigation/native'
import type {NativeStackNavigationProp} from '@react-navigation/native-stack'
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs'
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {useGetSubscriptionQuery} from '../../store/api'
import {logout} from '../../store/slices/authSlice'
import type {RootStackParamList, TabParamList} from '../../navigation/RootNavigator'
import {colors, typography, spacing, borderRadius} from '../../theme'

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>

function MenuRow({
  icon,
  label,
  desc,
  onPress,
  danger,
}: {
  icon: string
  label: string
  desc?: string
  onPress: () => void
  danger?: boolean
}) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <Text style={styles.menuIconText}>{icon}</Text>
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
        {desc && <Text style={styles.menuDesc}>{desc}</Text>}
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  )
}

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>()
  const dispatch = useAppDispatch()
  const {user} = useAppSelector(state => state.auth)
  const {data: subscription} = useGetSubscriptionQuery()

  const isSubscribed = subscription?.isSubscribed || false

  const handleLogout = () => {
    Alert.alert(
      'Chiqish',
      'Hisobdan chiqmoqchimisiz?',
      [
        {text: 'Bekor qilish', style: 'cancel'},
        {text: 'Chiqish', style: 'destructive', onPress: () => dispatch(logout())},
      ],
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric', month: 'short', day: 'numeric',
    })
  }

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
      : user?.firstName?.charAt(0) || '?'

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar & Name */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials.toUpperCase()}</Text>
          </View>
          <Text style={styles.fullName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.phone}>{user?.phone}</Text>
          {user?.email && <Text style={styles.email}>{user.email}</Text>}

          {/* Subscription badge */}
          <TouchableOpacity
            style={[styles.subBadge, isSubscribed ? styles.subBadgePremium : styles.subBadgeFree]}
            onPress={() => navigation.navigate('Subscribe')}>
            <Text style={styles.subBadgeText}>
              {isSubscribed ? '⭐ Premium faol' : '🔒 Bepul tarif — Yangilash'}
            </Text>
            {isSubscribed && subscription?.endDate && (
              <Text style={styles.subBadgeDate}>
                {formatDate(subscription.endDate)} gacha
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Menu Groups */}
        <View style={styles.menuGroup}>
          <Text style={styles.menuGroupTitle}>Imtihonlar</Text>
          <View style={styles.menuCard}>
            <MenuRow
              icon="📊"
              label="Natijalar tarixi"
              desc="Barcha imtihon natijalarim"
              onPress={() => navigation.navigate('History')}
            />
            <View style={styles.divider} />
            <MenuRow
              icon="🏆"
              label="Reyting jadvali"
              desc="Top o'rinlar va raqobat"
              onPress={() => navigation.navigate('Leaderboard')}
            />
            <View style={styles.divider} />
            <MenuRow
              icon="⚙️"
              label="Custom imtihon"
              desc="O'z imtihonimni sozlayman"
              onPress={() => navigation.navigate('CustomExam')}
            />
          </View>
        </View>

        <View style={styles.menuGroup}>
          <Text style={styles.menuGroupTitle}>O'rganish</Text>
          <View style={styles.menuCard}>
            <MenuRow
              icon="🎓"
              label="IELTS kursi"
              desc="To'liq tayyorgarlik kursi"
              onPress={() => navigation.navigate('CourseDetail')}
            />
            <View style={styles.divider} />
            <MenuRow
              icon="⭐"
              label="Premium obuna"
              desc={isSubscribed ? 'Faol obuna' : 'Barcha imkoniyatlarni oching'}
              onPress={() => navigation.navigate('Subscribe')}
            />
          </View>
        </View>

        <View style={styles.menuGroup}>
          <Text style={styles.menuGroupTitle}>Ilova</Text>
          <View style={styles.menuCard}>
            <MenuRow
              icon="ℹ️"
              label="Ilova haqida"
              desc="Platforma va aloqa ma'lumotlari"
              onPress={() => navigation.navigate('About')}
            />
            <View style={styles.divider} />
            <MenuRow
              icon="🚪"
              label="Chiqish"
              onPress={handleLogout}
              danger
            />
          </View>
        </View>

        <Text style={styles.version}>Manage LC v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.BACKGROUND_DARK},
  content: {padding: spacing.lg, gap: spacing.xl, paddingBottom: spacing.xxl},
  profileHeader: {alignItems: 'center', gap: spacing.sm},
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.PRIMARY_ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {fontSize: 32, fontWeight: '900', color: '#000'},
  fullName: {...typography.headlineMedium, fontWeight: '700', textAlign: 'center'},
  phone: {...typography.bodyMedium, opacity: 0.5},
  email: {...typography.bodySmall, opacity: 0.4},
  subBadge: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
  },
  subBadgePremium: {
    backgroundColor: colors.PRIMARY_ORANGE + '20',
    borderColor: colors.PRIMARY_ORANGE,
  },
  subBadgeFree: {
    backgroundColor: colors.CARD_GLASS,
    borderColor: colors.CARD_BORDER,
  },
  subBadgeText: {...typography.labelMedium, fontWeight: '700'},
  subBadgeDate: {...typography.labelSmall, opacity: 0.5, marginTop: 2},
  menuGroup: {gap: spacing.sm},
  menuGroupTitle: {...typography.labelSmall, opacity: 0.4, letterSpacing: 1, fontWeight: '700'},
  menuCard: {
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconDanger: {backgroundColor: 'rgba(239,68,68,0.15)'},
  menuIconText: {fontSize: 18},
  menuContent: {flex: 1},
  menuLabel: {...typography.labelLarge, fontWeight: '600'},
  menuLabelDanger: {color: '#EF4444'},
  menuDesc: {...typography.bodySmall, opacity: 0.4, marginTop: 2},
  menuArrow: {fontSize: 20, opacity: 0.2, fontWeight: '300'},
  divider: {height: 1, backgroundColor: colors.CARD_BORDER, marginLeft: 54 + spacing.md},
  version: {...typography.bodySmall, opacity: 0.2, textAlign: 'center'},
})
