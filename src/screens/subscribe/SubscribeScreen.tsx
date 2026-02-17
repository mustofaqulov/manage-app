import React from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useNavigation} from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import {useGetSubscriptionQuery} from '../../store/api'
import {colors, typography, spacing, borderRadius} from '../../theme'

const FREE_FEATURES = [
  '1 ta bepul test',
  'Asosiy statistika',
  'Natijalar tarixi',
]

const PREMIUM_FEATURES = [
  'Barcha testlarga kirish (A1-C2)',
  'Cheksiz imtihonlar',
  'AI baholash va fikr-mulohaza',
  'Batafsil rubrik ballari',
  'Audio yuklab olish',
  'Reyting jadvaliga kirish',
  'Custom imtihon rejimi',
  'Ustunlik belgisi (🏅)',
]

export default function SubscribeScreen() {
  const navigation = useNavigation()
  const {data: subscription, isLoading} = useGetSubscriptionQuery()

  const handleSubscribe = () => {
    Linking.openURL('https://t.me/managelcbot').catch(() => {
      Alert.alert('Xatolik', 'Telegram botga ulanishda xatolik yuz berdi')
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Premium</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current status */}
        {subscription && (
          <View
            style={[
              styles.statusCard,
              subscription.isSubscribed ? styles.statusActive : styles.statusInactive,
            ]}>
            <Text style={styles.statusIcon}>{subscription.isSubscribed ? '✅' : '🔒'}</Text>
            <View>
              <Text style={styles.statusTitle}>
                {subscription.isSubscribed ? 'Premium faol' : 'Bepul tarif'}
              </Text>
              {subscription.isSubscribed && subscription.endDate && (
                <Text style={styles.statusDate}>
                  Tugash sanasi: {new Date(subscription.endDate).toLocaleDateString('uz')}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Hero */}
        <LinearGradient
          colors={[colors.PRIMARY_ORANGE + '30', 'transparent']}
          style={styles.heroCard}>
          <Text style={styles.heroIcon}>🏆</Text>
          <Text style={styles.heroTitle}>Premium obuna</Text>
          <Text style={styles.heroSubtitle}>
            IELTS band 7.0+ ga erishish uchun barcha imkoniyatlardan foydalaning
          </Text>
        </LinearGradient>

        {/* Comparison */}
        <View style={styles.comparisonContainer}>
          {/* Free Plan */}
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Bepul</Text>
              <Text style={styles.planPrice}>0 so'm</Text>
            </View>
            {FREE_FEATURES.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          {/* Premium Plan */}
          <LinearGradient
            colors={[colors.PRIMARY_ORANGE + '20', colors.PRIMARY_ORANGE + '05']}
            style={[styles.planCard, styles.premiumCard]}>
            <View style={[styles.premiumBadge]}>
              <Text style={styles.premiumBadgeText}>TAVSIYA</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={[styles.planName, styles.premiumName]}>Premium</Text>
              <Text style={[styles.planPrice, styles.premiumPrice]}>Telegram orqali</Text>
            </View>
            {PREMIUM_FEATURES.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <Text style={[styles.featureCheck, styles.premiumCheck]}>⭐</Text>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </LinearGradient>
        </View>

        {/* CTA */}
        {!subscription?.isSubscribed && (
          <TouchableOpacity onPress={handleSubscribe} activeOpacity={0.85}>
            <LinearGradient
              colors={[colors.PRIMARY_ORANGE, '#FF4500']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.ctaButton}>
              <Text style={styles.ctaText}>📱 Telegram orqali obuna bo'lish</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <Text style={styles.note}>
          Obuna bo'lish uchun @managelcbot ga yozing. To'lov va aktivatsiya Telegram orqali amalga oshiriladi.
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.BACKGROUND_DARK},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: {width: 40, height: 40, justifyContent: 'center'},
  backIcon: {fontSize: 22, color: colors.PRIMARY_ORANGE},
  headerTitle: {...typography.headlineSmall},
  content: {padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl},
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  statusActive: {backgroundColor: '#10B98120', borderColor: '#10B981'},
  statusInactive: {backgroundColor: colors.CARD_GLASS, borderColor: colors.CARD_BORDER},
  statusIcon: {fontSize: 24},
  statusTitle: {...typography.titleLarge, fontWeight: '600'},
  statusDate: {...typography.bodySmall, opacity: 0.6},
  heroCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.PRIMARY_ORANGE + '40',
  },
  heroIcon: {fontSize: 48, marginBottom: spacing.md},
  heroTitle: {...typography.headlineMedium, fontWeight: '800', textAlign: 'center'},
  heroSubtitle: {
    ...typography.bodyMedium,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  comparisonContainer: {gap: spacing.md},
  planCard: {
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  premiumCard: {borderColor: colors.PRIMARY_ORANGE + '60', position: 'relative'},
  premiumBadge: {
    position: 'absolute',
    top: -12,
    right: spacing.lg,
    backgroundColor: colors.PRIMARY_ORANGE,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  premiumBadgeText: {fontSize: 10, fontWeight: '800', color: '#000', letterSpacing: 1},
  planHeader: {marginBottom: spacing.sm},
  planName: {...typography.titleLarge, fontWeight: '700', marginBottom: spacing.xs},
  premiumName: {color: colors.PRIMARY_ORANGE},
  planPrice: {...typography.headlineSmall, opacity: 0.5},
  premiumPrice: {color: colors.PRIMARY_ORANGE, opacity: 1},
  featureRow: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm},
  featureCheck: {fontSize: 14, color: '#10B981', marginTop: 2},
  premiumCheck: {color: colors.PRIMARY_ORANGE},
  featureText: {...typography.bodySmall, flex: 1, opacity: 0.8, lineHeight: 20},
  ctaButton: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  ctaText: {...typography.labelLarge, color: '#fff', fontWeight: '700'},
  note: {...typography.bodySmall, opacity: 0.4, textAlign: 'center', lineHeight: 18},
})
