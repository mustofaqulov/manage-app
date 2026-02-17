import React from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useNavigation} from '@react-navigation/native'
import {colors, typography, spacing, borderRadius} from '../../theme'

export default function AboutScreen() {
  const navigation = useNavigation()

  const features = [
    {icon: '🎯', title: 'Real IELTS Format', desc: 'Web va mobil versiyalarda bir xil IELTS/CEFR imtihon formati'},
    {icon: '🤖', title: 'AI Baholash', desc: 'Google Gemini AI orqali ovozli javoblaringizni baholash'},
    {icon: '📊', title: 'Statistika', desc: 'Natijalaringizni kuzatib boring va rivojlanishingizni ko\'ring'},
    {icon: '🏆', title: 'Reyting', desc: 'Boshqa foydalanuvchilar bilan raqobatlashing'},
    {icon: '📱', title: 'Mobil App', desc: 'Istalgan joyda imtihon toping'},
    {icon: '🌐', title: 'Ko\'p til', desc: 'O\'zbek, Ingliz va Rus tillarida interfeys'},
  ]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Haqida</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Logo / Brand */}
        <View style={styles.brandSection}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>LC</Text>
          </View>
          <Text style={styles.brandName}>Manage LC</Text>
          <Text style={styles.brandTagline}>IELTS Speaking Mock Exam Platform</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Platforma haqida</Text>
          <Text style={styles.cardText}>
            Manage LC — IELTS va CEFR darajalariga asoslangan speaking imtihonlarga tayyorlanish
            uchun mo'ljallangan zamonaviy platforma. AI texnologiyalari yordamida ovozli
            javoblaringizni tahlil qilamiz va aniq baho beramiz.
          </Text>
        </View>

        {/* Features */}
        <Text style={styles.sectionTitle}>Imkoniyatlar</Text>
        <View style={styles.featuresGrid}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>

        {/* Contact */}
        <Text style={styles.sectionTitle}>Aloqa</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL('https://t.me/managelcbot')}>
            <Text style={styles.contactIcon}>📱</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Telegram Bot</Text>
              <Text style={styles.contactValue}>@managelcbot</Text>
            </View>
            <Text style={styles.externalIcon}>→</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL('https://managelc.uz')}>
            <Text style={styles.contactIcon}>🌐</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Web sayt</Text>
              <Text style={styles.contactValue}>managelc.uz</Text>
            </View>
            <Text style={styles.externalIcon}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>© 2024 Manage LC. Barcha huquqlar himoyalangan.</Text>
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
  brandSection: {alignItems: 'center', paddingVertical: spacing.xl},
  logo: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.PRIMARY_ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: {fontSize: 32, fontWeight: '900', color: '#000'},
  brandName: {...typography.headlineLarge, fontWeight: '900'},
  brandTagline: {...typography.bodyMedium, opacity: 0.5, marginTop: spacing.xs, textAlign: 'center'},
  versionBadge: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.full,
  },
  versionText: {...typography.labelSmall, opacity: 0.5},
  card: {
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  cardTitle: {...typography.titleLarge, marginBottom: spacing.sm},
  cardText: {...typography.bodyMedium, opacity: 0.7, lineHeight: 22},
  sectionTitle: {...typography.titleLarge, fontWeight: '700'},
  featuresGrid: {gap: spacing.sm},
  featureCard: {
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  featureIcon: {fontSize: 24},
  featureTitle: {...typography.labelLarge, fontWeight: '700', marginBottom: 2},
  featureDesc: {...typography.bodySmall, opacity: 0.6, flex: 1},
  contactRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm},
  contactIcon: {fontSize: 22},
  contactInfo: {flex: 1},
  contactLabel: {...typography.labelSmall, opacity: 0.5},
  contactValue: {...typography.bodyMedium, color: colors.PRIMARY_ORANGE},
  externalIcon: {fontSize: 16, opacity: 0.4},
  divider: {height: 1, backgroundColor: colors.CARD_BORDER, marginVertical: spacing.xs},
  footer: {...typography.bodySmall, opacity: 0.3, textAlign: 'center', marginTop: spacing.md},
})
