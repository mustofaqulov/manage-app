import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useNavigation} from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import {useGetTestsQuery} from '../../store/api'
import {CefrLevel} from '../../api/types'
import type {NativeStackNavigationProp} from '@react-navigation/native-stack'
import type {RootStackParamList} from '../../navigation/RootNavigator'
import {colors, typography, spacing, borderRadius} from '../../theme'
import LoadingSpinner from '../../components/common/LoadingSpinner'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const CEFR_LEVELS: CefrLevel[] = [CefrLevel.A1, CefrLevel.A2, CefrLevel.B1, CefrLevel.B2, CefrLevel.C1, CefrLevel.C2]
const CEFR_COLORS: Record<string, string> = {
  A1: '#10B981', A2: '#34D399', B1: '#3B82F6', B2: '#6366F1', C1: '#F59E0B', C2: '#EF4444',
}

export default function CustomExamScreen() {
  const navigation = useNavigation<NavigationProp>()
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel>(CefrLevel.B1)
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null)
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([])
  const [randomOrder, setRandomOrder] = useState(false)
  const [timeLimitEnabled, setTimeLimitEnabled] = useState(true)

  const {data, isLoading} = useGetTestsQuery({level: selectedLevel})
  const tests = data?.items || []

  const selectedTest = tests.find(t => t.id === selectedTestId)

  const handleToggleSection = (sectionId: string) => {
    setSelectedSectionIds(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId],
    )
  }

  const handleStart = () => {
    if (!selectedTestId) return
    navigation.navigate('ExamFlow', {
      testId: selectedTestId,
      mode: 'custom',
      selectedSectionIds: selectedSectionIds.length > 0 ? selectedSectionIds : undefined,
    })
  }

  const canStart = selectedTestId !== null

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Custom Imtihon</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>⚙️</Text>
          <Text style={styles.infoText}>
            O'zingizga qulay test va bo'limlarni tanlang, imtihon tartibini sozlang
          </Text>
        </View>

        {/* Step 1: Level */}
        <View style={styles.section}>
          <Text style={styles.stepLabel}>1-qadam</Text>
          <Text style={styles.sectionTitle}>CEFR darajasini tanlang</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.levelScroll}>
            <View style={styles.levelRow}>
              {CEFR_LEVELS.map(level => {
                const isActive = selectedLevel === level
                const color = CEFR_COLORS[level]
                return (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.levelChip,
                      isActive && {backgroundColor: color + '20', borderColor: color},
                    ]}
                    onPress={() => {
                      setSelectedLevel(level)
                      setSelectedTestId(null)
                      setSelectedSectionIds([])
                    }}>
                    <Text style={[styles.levelChipText, isActive && {color}]}>{level}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </ScrollView>
        </View>

        {/* Step 2: Test */}
        <View style={styles.section}>
          <Text style={styles.stepLabel}>2-qadam</Text>
          <Text style={styles.sectionTitle}>Testni tanlang</Text>
          {isLoading ? (
            <LoadingSpinner text="" />
          ) : (
            <View style={styles.testList}>
              {tests.map(test => (
                <TouchableOpacity
                  key={test.id}
                  style={[styles.testOption, selectedTestId === test.id && styles.testOptionActive]}
                  onPress={() => {
                    setSelectedTestId(test.id)
                    setSelectedSectionIds([])
                  }}>
                  <View style={styles.testOptionRadio}>
                    {selectedTestId === test.id && (
                      <View style={styles.testOptionRadioFill} />
                    )}
                  </View>
                  <View style={styles.testOptionInfo}>
                    <Text style={styles.testOptionTitle} numberOfLines={1}>{test.title}</Text>
                    <Text style={styles.testOptionMeta}>{test.sectionCount} bo'lim</Text>
                  </View>
                </TouchableOpacity>
              ))}
              {tests.length === 0 && (
                <Text style={styles.emptyText}>Bu daraja uchun test topilmadi</Text>
              )}
            </View>
          )}
        </View>

        {/* Step 3: Settings */}
        <View style={styles.section}>
          <Text style={styles.stepLabel}>3-qadam</Text>
          <Text style={styles.sectionTitle}>Sozlamalar</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Tasodifiy tartib</Text>
              <Text style={styles.settingDesc}>Savollarni tasodifiy tartibda ko'rsatish</Text>
            </View>
            <Switch
              value={randomOrder}
              onValueChange={setRandomOrder}
              trackColor={{false: colors.CARD_BORDER, true: colors.PRIMARY_ORANGE + '80'}}
              thumbColor={randomOrder ? colors.PRIMARY_ORANGE : '#666'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Vaqt chegarasi</Text>
              <Text style={styles.settingDesc}>Har bir savol uchun standart vaqt</Text>
            </View>
            <Switch
              value={timeLimitEnabled}
              onValueChange={setTimeLimitEnabled}
              trackColor={{false: colors.CARD_BORDER, true: colors.PRIMARY_ORANGE + '80'}}
              thumbColor={timeLimitEnabled ? colors.PRIMARY_ORANGE : '#666'}
            />
          </View>
        </View>

        {/* Summary */}
        {canStart && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Imtihon xulosasi</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Test:</Text>
              <Text style={styles.summaryValue} numberOfLines={1}>{selectedTest?.title}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Daraja:</Text>
              <Text style={[styles.summaryValue, {color: CEFR_COLORS[selectedLevel]}]}>{selectedLevel}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Rejim:</Text>
              <Text style={styles.summaryValue}>{randomOrder ? 'Tasodifiy' : 'Ketma-ket'}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Start Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleStart}
          disabled={!canStart}
          activeOpacity={0.85}
          style={styles.startBtnWrapper}>
          <LinearGradient
            colors={canStart ? [colors.PRIMARY_ORANGE, '#FF4500'] : ['#333', '#222']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.startBtn}>
            <Text style={styles.startBtnText}>
              {canStart ? '▶ Imtihonni boshlash' : 'Test tanlang'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.PRIMARY_ORANGE + '15',
    borderWidth: 1,
    borderColor: colors.PRIMARY_ORANGE + '40',
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  infoIcon: {fontSize: 20},
  infoText: {...typography.bodySmall, flex: 1, opacity: 0.8, lineHeight: 20},
  section: {gap: spacing.md},
  stepLabel: {...typography.labelSmall, color: colors.PRIMARY_ORANGE, fontWeight: '700', letterSpacing: 1},
  sectionTitle: {...typography.titleLarge, fontWeight: '700'},
  levelScroll: {marginHorizontal: -spacing.lg},
  levelRow: {flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg},
  levelChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
  },
  levelChipText: {...typography.labelLarge, fontWeight: '700', color: 'rgba(255,255,255,0.4)'},
  testList: {gap: spacing.sm},
  testOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  testOptionActive: {borderColor: colors.PRIMARY_ORANGE, backgroundColor: colors.PRIMARY_ORANGE + '10'},
  testOptionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.PRIMARY_ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testOptionRadioFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.PRIMARY_ORANGE,
  },
  testOptionInfo: {flex: 1},
  testOptionTitle: {...typography.labelLarge, fontWeight: '600'},
  testOptionMeta: {...typography.labelSmall, opacity: 0.4, marginTop: 2},
  emptyText: {...typography.bodyMedium, opacity: 0.4, textAlign: 'center', padding: spacing.lg},
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  settingInfo: {flex: 1},
  settingTitle: {...typography.labelLarge, fontWeight: '600'},
  settingDesc: {...typography.bodySmall, opacity: 0.4, marginTop: 2},
  summaryCard: {
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.PRIMARY_ORANGE + '40',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  summaryTitle: {...typography.titleLarge, fontWeight: '700', marginBottom: spacing.xs},
  summaryRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  summaryLabel: {...typography.bodySmall, opacity: 0.5, width: 70},
  summaryValue: {...typography.bodyMedium, fontWeight: '500', flex: 1},
  footer: {padding: spacing.lg, paddingBottom: spacing.xl},
  startBtnWrapper: {},
  startBtn: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  startBtnText: {...typography.labelLarge, color: '#fff', fontWeight: '700'},
})
