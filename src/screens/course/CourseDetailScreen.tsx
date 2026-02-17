import React from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useNavigation} from '@react-navigation/native'
import type {NativeStackNavigationProp} from '@react-navigation/native-stack'
import LinearGradient from 'react-native-linear-gradient'
import type {RootStackParamList} from '../../navigation/RootNavigator'
import {colors, typography, spacing, borderRadius} from '../../theme'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const COURSE_MODULES = [
  {
    id: '1',
    title: 'IELTS Speaking kirish',
    lessons: 4,
    duration: '45 daqiqa',
    locked: false,
    topics: ['Imtihon formati', 'Baholash mezonlari', 'Tayyorlanish strategiyasi'],
  },
  {
    id: '2',
    title: 'Part 1: Tanishuv',
    lessons: 6,
    duration: '1 soat',
    locked: false,
    topics: ['Shaxsiy savollar', 'Kundalik mavzular', 'Javob berish texnikasi'],
  },
  {
    id: '3',
    title: 'Part 2: Cue Card',
    lessons: 8,
    duration: '1.5 soat',
    locked: true,
    topics: ['Kartochka tahlili', '2 daqiqalik nutq', 'Tuzish texnikasi'],
  },
  {
    id: '4',
    title: 'Part 3: Muhokama',
    lessons: 7,
    duration: '1.5 soat',
    locked: true,
    topics: ['Abstrakt savollar', 'Fikr bildirish', 'Argumentatsiya'],
  },
  {
    id: '5',
    title: 'Lug\'at boyitish',
    lessons: 10,
    duration: '2 soat',
    locked: true,
    topics: ['Tematik lug\'at', 'Idiomalar', 'Collocation'],
  },
]

export default function CourseDetailScreen() {
  const navigation = useNavigation<NavigationProp>()

  const completedModules = COURSE_MODULES.filter(m => !m.locked).length
  const progress = (completedModules / COURSE_MODULES.length) * 100

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kurs</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient
          colors={[colors.PRIMARY_ORANGE + '30', colors.CARD_GLASS]}
          style={styles.heroCard}>
          <View style={styles.courseIconContainer}>
            <Text style={styles.courseIcon}>🎓</Text>
          </View>
          <Text style={styles.courseTitle}>IELTS Speaking</Text>
          <Text style={styles.courseSubtitle}>To'liq tayyorgarlik kursi</Text>

          <View style={styles.courseStats}>
            <View style={styles.courseStat}>
              <Text style={styles.courseStatValue}>{COURSE_MODULES.length}</Text>
              <Text style={styles.courseStatLabel}>Modul</Text>
            </View>
            <View style={styles.courseStatDivider} />
            <View style={styles.courseStat}>
              <Text style={styles.courseStatValue}>35</Text>
              <Text style={styles.courseStatLabel}>Dars</Text>
            </View>
            <View style={styles.courseStatDivider} />
            <View style={styles.courseStat}>
              <Text style={styles.courseStatValue}>7h+</Text>
              <Text style={styles.courseStatLabel}>Vaqt</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Jarayon</Text>
              <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, {width: `${progress}%`}]} />
            </View>
          </View>
        </LinearGradient>

        {/* Modules */}
        <Text style={styles.sectionTitle}>Modullar</Text>
        <View style={styles.modulesList}>
          {COURSE_MODULES.map((module, index) => (
            <TouchableOpacity
              key={module.id}
              style={[styles.moduleCard, module.locked && styles.moduleCardLocked]}
              activeOpacity={module.locked ? 1 : 0.8}
              disabled={module.locked}>
              <View style={styles.moduleLeft}>
                <View style={[styles.moduleNumber, module.locked && styles.moduleNumberLocked]}>
                  <Text style={[styles.moduleNumberText, module.locked && styles.moduleNumberTextLocked]}>
                    {module.locked ? '🔒' : (index + 1).toString()}
                  </Text>
                </View>
              </View>
              <View style={styles.moduleContent}>
                <Text style={[styles.moduleTitle, module.locked && styles.moduleTitleLocked]}>
                  {module.title}
                </Text>
                <View style={styles.moduleMeta}>
                  <Text style={styles.moduleMetaText}>📖 {module.lessons} dars</Text>
                  <Text style={styles.moduleMetaText}>⏱ {module.duration}</Text>
                </View>
                <View style={styles.topicsList}>
                  {module.topics.map((topic, ti) => (
                    <Text key={ti} style={styles.topicItem}>• {topic}</Text>
                  ))}
                </View>
              </View>
              {!module.locked && (
                <Text style={styles.moduleArrow}>→</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Unlock premium */}
        <LinearGradient
          colors={[colors.PRIMARY_ORANGE + '20', 'transparent']}
          style={styles.premiumBanner}>
          <Text style={styles.premiumBannerIcon}>⭐</Text>
          <Text style={styles.premiumBannerText}>
            Barcha modullarni ochish uchun Premium obuna oling
          </Text>
          <TouchableOpacity
            style={styles.premiumBannerBtn}
            onPress={() => navigation.navigate('Subscribe')}>
            <Text style={styles.premiumBannerBtnText}>Obuna bo'lish</Text>
          </TouchableOpacity>
        </LinearGradient>
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
  heroCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.PRIMARY_ORANGE + '30',
    alignItems: 'center',
  },
  courseIconContainer: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.PRIMARY_ORANGE + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  courseIcon: {fontSize: 36},
  courseTitle: {...typography.headlineMedium, fontWeight: '800', textAlign: 'center'},
  courseSubtitle: {...typography.bodyMedium, opacity: 0.5, marginTop: spacing.xs},
  courseStats: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  courseStat: {alignItems: 'center', paddingHorizontal: spacing.lg},
  courseStatValue: {...typography.headlineSmall, fontWeight: '700', color: colors.PRIMARY_ORANGE},
  courseStatLabel: {...typography.labelSmall, opacity: 0.5, marginTop: 2},
  courseStatDivider: {width: 1, height: 30, backgroundColor: colors.CARD_BORDER},
  progressSection: {width: '100%'},
  progressHeader: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs},
  progressLabel: {...typography.labelSmall, opacity: 0.5},
  progressPercent: {...typography.labelSmall, color: colors.PRIMARY_ORANGE, fontWeight: '700'},
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.PRIMARY_ORANGE,
    borderRadius: borderRadius.full,
  },
  sectionTitle: {...typography.titleLarge, fontWeight: '700'},
  modulesList: {gap: spacing.sm},
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  moduleCardLocked: {opacity: 0.5},
  moduleLeft: {paddingTop: 2},
  moduleNumber: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.PRIMARY_ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleNumberLocked: {backgroundColor: colors.CARD_BORDER},
  moduleNumberText: {fontSize: 14, fontWeight: '700', color: '#000'},
  moduleNumberTextLocked: {color: 'rgba(255,255,255,0.3)'},
  moduleContent: {flex: 1},
  moduleTitle: {...typography.labelLarge, fontWeight: '700', marginBottom: spacing.xs},
  moduleTitleLocked: {opacity: 0.4},
  moduleMeta: {flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xs},
  moduleMetaText: {...typography.labelSmall, opacity: 0.4},
  topicsList: {gap: 2},
  topicItem: {...typography.bodySmall, opacity: 0.4},
  moduleArrow: {fontSize: 16, opacity: 0.4, alignSelf: 'center'},
  premiumBanner: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.PRIMARY_ORANGE + '30',
  },
  premiumBannerIcon: {fontSize: 32},
  premiumBannerText: {
    ...typography.bodyMedium,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 22,
  },
  premiumBannerBtn: {
    backgroundColor: colors.PRIMARY_ORANGE,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  premiumBannerBtnText: {...typography.labelLarge, color: '#000', fontWeight: '700'},
})
