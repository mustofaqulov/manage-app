import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useNavigation} from '@react-navigation/native'
import type {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {useGetTestsQuery, useGetSubscriptionQuery} from '../../store/api'
import type {RootStackParamList} from '../../navigation/RootNavigator'
import type {CefrLevel, TestListResponse} from '../../api/types'
import {colors, typography, spacing, borderRadius} from '../../theme'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorView from '../../components/common/ErrorView'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const CEFR_LEVELS: Array<{label: string; value: CefrLevel | undefined}> = [
  {label: 'All', value: undefined},
  {label: 'A1', value: 'A1'},
  {label: 'A2', value: 'A2'},
  {label: 'B1', value: 'B1'},
  {label: 'B2', value: 'B2'},
  {label: 'C1', value: 'C1'},
  {label: 'C2', value: 'C2'},
]

const CEFR_COLORS: Record<string, string> = {
  A1: '#10B981',
  A2: '#34D399',
  B1: '#3B82F6',
  B2: '#6366F1',
  C1: '#F59E0B',
  C2: '#EF4444',
}

type ExamMode = 'full' | 'random' | 'custom'

function ModeCard({
  mode,
  title,
  description,
  icon,
  selected,
  onSelect,
}: {
  mode: ExamMode
  title: string
  description: string
  icon: string
  selected: boolean
  onSelect: (mode: ExamMode) => void
}) {
  return (
    <TouchableOpacity
      style={[styles.modeCard, selected && styles.modeCardSelected]}
      onPress={() => onSelect(mode)}>
      <Text style={styles.modeIcon}>{icon}</Text>
      <Text style={[styles.modeTitle, selected && styles.modeTitleSelected]}>{title}</Text>
      <Text style={styles.modeDescription}>{description}</Text>
    </TouchableOpacity>
  )
}

function TestCard({
  test,
  onPress,
  isLocked,
}: {
  test: TestListResponse
  onPress: () => void
  isLocked: boolean
}) {
  const levelColor = CEFR_COLORS[test.cefrLevel] || colors.PRIMARY_ORANGE
  return (
    <TouchableOpacity style={styles.testCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.testCardHeader}>
        <View style={[styles.levelBadge, {backgroundColor: levelColor + '20', borderColor: levelColor}]}>
          <Text style={[styles.levelBadgeText, {color: levelColor}]}>{test.cefrLevel}</Text>
        </View>
        {isLocked && <Text style={styles.lockIcon}>🔒</Text>}
      </View>
      <Text style={styles.testTitle} numberOfLines={2}>{test.title}</Text>
      {test.description && (
        <Text style={styles.testDescription} numberOfLines={2}>{test.description}</Text>
      )}
      <View style={styles.testMeta}>
        {test.sectionCount > 0 && (
          <Text style={styles.testMetaText}>📚 {test.sectionCount} sections</Text>
        )}
        {test.timeLimitMinutes && (
          <Text style={styles.testMetaText}>⏱ {test.timeLimitMinutes} min</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default function MockExamScreen() {
  const navigation = useNavigation<NavigationProp>()
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel | undefined>(undefined)
  const [selectedMode, setSelectedMode] = useState<ExamMode>('full')
  const [showModeSelector, setShowModeSelector] = useState(false)
  const [pendingTestId, setPendingTestId] = useState<string | null>(null)

  const {data, isLoading, error, refetch} = useGetTestsQuery({level: selectedLevel})
  const {data: subscription} = useGetSubscriptionQuery()

  const isSubscribed = subscription?.isSubscribed || false

  const handleTestPress = (test: TestListResponse) => {
    if (!isSubscribed) {
      Alert.alert(
        'Premium Kontent',
        'Bu test premium obuna talab qiladi. Barcha testlarga kirish uchun obuna bo\'ling.',
        [
          {text: 'Bekor qilish', style: 'cancel'},
          {text: 'Obuna bo\'lish', onPress: () => navigation.navigate('Subscribe')},
        ],
      )
      return
    }

    if (selectedMode === 'custom') {
      navigation.navigate('CustomExam')
      return
    }

    setPendingTestId(test.id)
    setShowModeSelector(true)
  }

  const startExam = (mode: ExamMode) => {
    if (!pendingTestId) return
    setShowModeSelector(false)
    navigation.navigate('ExamFlow', {testId: pendingTestId, mode})
    setPendingTestId(null)
  }

  if (isLoading) return <LoadingSpinner text="Testlar yuklanmoqda..." />
  if (error) return <ErrorView message="Testlarni yuklashda xatolik" onRetry={refetch} />

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mock Imtihon</Text>
        <TouchableOpacity style={styles.customExamBtn} onPress={() => navigation.navigate('CustomExam')}>
          <Text style={styles.customExamBtnText}>⚙️ Custom</Text>
        </TouchableOpacity>
      </View>

      {/* Mode Selector */}
      <View style={styles.modeContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modeScroll}>
          {(['full', 'random'] as ExamMode[]).map(mode => (
            <TouchableOpacity
              key={mode}
              style={[styles.modeChip, selectedMode === mode && styles.modeChipActive]}
              onPress={() => setSelectedMode(mode)}>
              <Text style={[styles.modeChipText, selectedMode === mode && styles.modeChipTextActive]}>
                {mode === 'full' ? '📋 Full Exam' : '🎲 Random'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* CEFR Level Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.levelFilterContainer}>
        {CEFR_LEVELS.map(({label, value}) => {
          const isActive = selectedLevel === value
          const levelColor = value ? CEFR_COLORS[value] : colors.PRIMARY_ORANGE
          return (
            <TouchableOpacity
              key={label}
              style={[
                styles.levelChip,
                isActive && {backgroundColor: levelColor + '20', borderColor: levelColor},
              ]}
              onPress={() => setSelectedLevel(value)}>
              <Text style={[styles.levelChipText, isActive && {color: levelColor}]}>
                {label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {/* Tests List */}
      <FlatList
        data={data?.items || []}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        numColumns={1}
        renderItem={({item}) => (
          <TestCard
            test={item}
            onPress={() => handleTestPress(item)}
            isLocked={!isSubscribed}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>Testlar topilmadi</Text>
          </View>
        }
      />

      {/* Mode Selection Modal */}
      <Modal
        visible={showModeSelector}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModeSelector(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Imtihon turini tanlang</Text>
            <ModeCard
              mode="full"
              title="Full Exam"
              description="Barcha bo'limlarni ketma-ket bajaring"
              icon="📋"
              selected={selectedMode === 'full'}
              onSelect={mode => {
                setSelectedMode(mode)
                startExam(mode)
              }}
            />
            <ModeCard
              mode="random"
              title="Random Exam"
              description="Tasodifiy savollar bilan imtihon"
              icon="🎲"
              selected={selectedMode === 'random'}
              onSelect={mode => {
                setSelectedMode(mode)
                startExam(mode)
              }}
            />
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setShowModeSelector(false)}>
              <Text style={styles.modalCancelText}>Bekor qilish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {...typography.headlineLarge},
  customExamBtn: {
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  customExamBtnText: {...typography.labelMedium, color: colors.PRIMARY_ORANGE},
  modeContainer: {marginBottom: spacing.sm},
  modeScroll: {paddingHorizontal: spacing.lg, gap: spacing.sm},
  modeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
  },
  modeChipActive: {
    backgroundColor: colors.PRIMARY_ORANGE + '20',
    borderColor: colors.PRIMARY_ORANGE,
  },
  modeChipText: {...typography.labelMedium, color: 'rgba(255,255,255,0.5)'},
  modeChipTextActive: {color: colors.PRIMARY_ORANGE},
  levelFilterContainer: {paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.md},
  levelChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
  },
  levelChipText: {...typography.labelSmall, color: 'rgba(255,255,255,0.4)'},
  list: {padding: spacing.lg, gap: spacing.md},
  testCard: {
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  testCardHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm},
  levelBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  levelBadgeText: {...typography.labelSmall, fontWeight: '700'},
  lockIcon: {fontSize: 16},
  testTitle: {...typography.titleLarge, marginBottom: spacing.xs},
  testDescription: {...typography.bodySmall, opacity: 0.6, marginBottom: spacing.sm},
  testMeta: {flexDirection: 'row', gap: spacing.md},
  testMetaText: {...typography.labelSmall, opacity: 0.5},
  emptyContainer: {padding: spacing.xxl, alignItems: 'center'},
  emptyIcon: {fontSize: 48, marginBottom: spacing.md},
  emptyText: {...typography.bodyLarge, opacity: 0.5},
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  modalTitle: {...typography.headlineSmall, marginBottom: spacing.sm},
  modeCard: {
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  modeCardSelected: {
    borderColor: colors.PRIMARY_ORANGE,
    backgroundColor: colors.PRIMARY_ORANGE + '15',
  },
  modeIcon: {fontSize: 28},
  modeTitle: {...typography.titleLarge, flex: 1},
  modeTitleSelected: {color: colors.PRIMARY_ORANGE},
  modeDescription: {...typography.bodySmall, opacity: 0.6, flex: 2},
  modalCancelBtn: {
    padding: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    marginTop: spacing.sm,
  },
  modalCancelText: {...typography.labelLarge, opacity: 0.5},
})
