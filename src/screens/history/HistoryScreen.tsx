import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useGetAttemptHistoryQuery, useGetAttemptQuery} from '../../store/api'
import type {AttemptListResponse, CefrLevel} from '../../api/types'
import {colors, typography, spacing, borderRadius} from '../../theme'
import {format} from 'date-fns'

const CEFR_COLORS: Record<string, string> = {
  A1: '#10B981', A2: '#34D399', B1: '#3B82F6', B2: '#6366F1', C1: '#F59E0B', C2: '#EF4444',
}

const STATUS_LABELS: Record<string, {label: string; color: string}> = {
  IN_PROGRESS: {label: 'Bajarilmoqda', color: '#3B82F6'},
  SUBMITTED: {label: 'Yuborildi', color: '#F59E0B'},
  SCORING: {label: 'Baholanmoqda', color: '#8B5CF6'},
  SCORED: {label: 'Baholandi', color: '#10B981'},
  CANCELLED: {label: 'Bekor qilindi', color: '#EF4444'},
  EXPIRED: {label: 'Muddati o\'tdi', color: '#6B7280'},
}

function ScoreBar({score, max, color}: {score: number; max: number; color: string}) {
  const pct = max > 0 ? (score / max) * 100 : 0
  return (
    <View style={barStyles.container}>
      <View style={barStyles.track}>
        <View style={[barStyles.fill, {width: `${pct}%`, backgroundColor: color}]} />
      </View>
      <Text style={[barStyles.label, {color}]}>{score}/{max}</Text>
    </View>
  )
}

const barStyles = StyleSheet.create({
  container: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  track: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  fill: {height: '100%', borderRadius: borderRadius.full},
  label: {...typography.labelSmall, fontWeight: '700', minWidth: 36, textAlign: 'right'},
})

function AttemptDetailView({attemptId}: {attemptId: string}) {
  const {data, isLoading} = useGetAttemptQuery(attemptId)

  if (isLoading) {
    return (
      <View style={detailStyles.loadingContainer}>
        <ActivityIndicator color={colors.PRIMARY_ORANGE} />
      </View>
    )
  }

  if (!data) return null

  return (
    <View style={detailStyles.container}>
      {/* Score Summary */}
      {data.scorePercentage != null && (
        <View style={detailStyles.scoreSection}>
          <View style={detailStyles.bigScore}>
            <Text style={detailStyles.bigScoreValue}>{data.scorePercentage.toFixed(1)}%</Text>
            {data.estimatedCefrLevel && (
              <View style={[
                detailStyles.estimatedLevel,
                {
                  backgroundColor: (CEFR_COLORS[data.estimatedCefrLevel] || colors.PRIMARY_ORANGE) + '20',
                  borderColor: CEFR_COLORS[data.estimatedCefrLevel] || colors.PRIMARY_ORANGE,
                },
              ]}>
                <Text style={[
                  detailStyles.estimatedLevelText,
                  {color: CEFR_COLORS[data.estimatedCefrLevel] || colors.PRIMARY_ORANGE},
                ]}>
                  ~{data.estimatedCefrLevel}
                </Text>
              </View>
            )}
          </View>
          {data.totalScore != null && data.maxTotalScore != null && (
            <ScoreBar
              score={data.totalScore}
              max={data.maxTotalScore}
              color={colors.PRIMARY_ORANGE}
            />
          )}
        </View>
      )}

      {/* AI Summary */}
      {data.aiSummary && (
        <View style={detailStyles.aiCard}>
          <View style={detailStyles.aiHeader}>
            <Text style={detailStyles.aiIcon}>🤖</Text>
            <Text style={detailStyles.aiTitle}>AI Tahlil</Text>
          </View>
          <Text style={detailStyles.aiText}>{data.aiSummary}</Text>
        </View>
      )}

      {/* Section Scores */}
      {data.sections && data.sections.length > 0 && (
        <View style={detailStyles.sectionsContainer}>
          <Text style={detailStyles.sectionsTitle}>Bo'lim natijalari</Text>
          {data.sections.map(section => (
            <View key={section.id} style={detailStyles.sectionCard}>
              <View style={detailStyles.sectionHeader}>
                <Text style={detailStyles.sectionTitle}>{section.sectionTitle}</Text>
                <Text style={detailStyles.sectionSkill}>{section.skill}</Text>
              </View>
              {section.sectionScore != null && section.maxSectionScore != null && (
                <ScoreBar
                  score={section.sectionScore}
                  max={section.maxSectionScore}
                  color='#3B82F6'
                />
              )}
              {section.aiFeedback && (
                <Text style={detailStyles.aiFeedback}>{section.aiFeedback}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Response Rubric Scores */}
      {data.responses && data.responses.some(r => r.rubricScores && r.rubricScores.length > 0) && (
        <View style={detailStyles.rubricContainer}>
          <Text style={detailStyles.sectionsTitle}>Rubrik ballari</Text>
          {data.responses
            .filter(r => r.rubricScores && r.rubricScores.length > 0)
            .map(response => (
              <View key={response.id} style={detailStyles.rubricCard}>
                {response.rubricScores!.map(rubric => (
                  <View key={rubric.criterionId} style={detailStyles.rubricRow}>
                    <Text style={detailStyles.rubricName}>{rubric.criterionName}</Text>
                    <ScoreBar score={rubric.score} max={rubric.maxScore} color='#8B5CF6' />
                    {rubric.feedback && (
                      <Text style={detailStyles.rubricFeedback}>{rubric.feedback}</Text>
                    )}
                  </View>
                ))}
                {response.aiSummary && (
                  <Text style={detailStyles.aiText}>{response.aiSummary}</Text>
                )}
              </View>
            ))}
        </View>
      )}
    </View>
  )
}

const detailStyles = StyleSheet.create({
  loadingContainer: {padding: spacing.xl, alignItems: 'center'},
  container: {gap: spacing.md, paddingTop: spacing.md},
  scoreSection: {gap: spacing.sm},
  bigScore: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  bigScoreValue: {...typography.headlineLarge, fontWeight: '900', color: colors.PRIMARY_ORANGE},
  estimatedLevel: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  estimatedLevelText: {...typography.labelMedium, fontWeight: '700'},
  aiCard: {
    backgroundColor: 'rgba(139,92,246,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  aiHeader: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  aiIcon: {fontSize: 16},
  aiTitle: {...typography.labelLarge, fontWeight: '700', color: '#A78BFA'},
  aiText: {...typography.bodySmall, opacity: 0.8, lineHeight: 20},
  sectionsContainer: {gap: spacing.sm},
  sectionsTitle: {...typography.labelLarge, fontWeight: '700', opacity: 0.5},
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  sectionTitle: {...typography.labelMedium, fontWeight: '600'},
  sectionSkill: {...typography.labelSmall, opacity: 0.4},
  aiFeedback: {...typography.bodySmall, opacity: 0.6, lineHeight: 18, marginTop: spacing.xs},
  rubricContainer: {gap: spacing.sm},
  rubricCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    gap: spacing.sm,
  },
  rubricRow: {gap: spacing.xs},
  rubricName: {...typography.labelSmall, opacity: 0.6},
  rubricFeedback: {...typography.bodySmall, opacity: 0.5, lineHeight: 18},
})

function AttemptCard({attempt}: {attempt: AttemptListResponse}) {
  const [expanded, setExpanded] = useState(false)
  const status = STATUS_LABELS[attempt.status] || {label: attempt.status, color: '#6B7280'}
  const levelColor = CEFR_COLORS[attempt.cefrLevel] || colors.PRIMARY_ORANGE

  return (
    <View style={cardStyles.container}>
      <TouchableOpacity onPress={() => setExpanded(e => !e)} activeOpacity={0.8} style={cardStyles.header}>
        <View style={cardStyles.headerLeft}>
          <View style={[cardStyles.levelBadge, {backgroundColor: levelColor + '20', borderColor: levelColor}]}>
            <Text style={[cardStyles.levelText, {color: levelColor}]}>{attempt.cefrLevel}</Text>
          </View>
          <View>
            <Text style={cardStyles.title} numberOfLines={1}>{attempt.testTitle}</Text>
            <Text style={cardStyles.date}>
              {format(new Date(attempt.startedAt), 'dd MMM yyyy, HH:mm')}
            </Text>
          </View>
        </View>
        <View style={cardStyles.headerRight}>
          {attempt.scorePercentage != null ? (
            <Text style={cardStyles.score}>{attempt.scorePercentage.toFixed(0)}%</Text>
          ) : (
            <View style={[cardStyles.statusChip, {backgroundColor: status.color + '20', borderColor: status.color}]}>
              <Text style={[cardStyles.statusText, {color: status.color}]}>{status.label}</Text>
            </View>
          )}
          <Text style={cardStyles.expandIcon}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {expanded && <AttemptDetailView attemptId={attempt.id} />}
    </View>
  )
}

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  header: {flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'},
  headerLeft: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, flex: 1},
  levelBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  levelText: {...typography.labelSmall, fontWeight: '700'},
  title: {...typography.labelLarge, fontWeight: '600', flex: 1},
  date: {...typography.bodySmall, opacity: 0.4, marginTop: 2},
  headerRight: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginLeft: spacing.sm},
  score: {...typography.titleLarge, fontWeight: '800', color: colors.PRIMARY_ORANGE},
  statusChip: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  statusText: {...typography.labelSmall, fontWeight: '600'},
  expandIcon: {fontSize: 10, opacity: 0.4},
})

export default function HistoryScreen() {
  const {data, isLoading, refetch} = useGetAttemptHistoryQuery({})
  const attempts = data?.items || []

  const scoredAttempts = attempts.filter(a => a.scorePercentage != null)
  const totalExams = attempts.length
  const avgScore =
    scoredAttempts.length > 0
      ? scoredAttempts.reduce((s, a) => s + (a.scorePercentage || 0), 0) / scoredAttempts.length
      : 0
  const bestScore =
    scoredAttempts.length > 0 ? Math.max(...scoredAttempts.map(a => a.scorePercentage || 0)) : 0

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Tarix</Text>
        {totalExams > 0 && (
          <Text style={styles.count}>{totalExams} ta imtihon</Text>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.PRIMARY_ORANGE} size="large" />
          <Text style={styles.loadingText}>Yuklanmoqda...</Text>
        </View>
      ) : (
        <FlatList
          data={attempts}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            totalExams > 0 ? (
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{totalExams}</Text>
                  <Text style={styles.statLabel}>Jami</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{avgScore.toFixed(1)}%</Text>
                  <Text style={styles.statLabel}>O'rtacha</Text>
                </View>
                <View style={[styles.statCard, styles.statCardHighlight]}>
                  <Text style={[styles.statValue, {color: colors.PRIMARY_ORANGE}]}>
                    {bestScore.toFixed(1)}%
                  </Text>
                  <Text style={styles.statLabel}>Eng yaxshi</Text>
                </View>
              </View>
            ) : null
          }
          renderItem={({item}) => <AttemptCard attempt={item} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyTitle}>Hali imtihon yo'q</Text>
              <Text style={styles.emptySubtitle}>
                Birinchi imtihon natijalaringiz shu yerda ko'rinadi
              </Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={{height: spacing.md}} />}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.BACKGROUND_DARK},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {...typography.headlineLarge},
  count: {...typography.bodySmall, opacity: 0.4},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md},
  loadingText: {...typography.bodyMedium, opacity: 0.5},
  list: {padding: spacing.lg, paddingBottom: spacing.xxl},
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
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
  statCardHighlight: {
    borderColor: colors.PRIMARY_ORANGE + '40',
    backgroundColor: colors.PRIMARY_ORANGE + '10',
  },
  statValue: {...typography.headlineMedium, fontWeight: '800'},
  statLabel: {...typography.labelSmall, opacity: 0.4, marginTop: spacing.xs},
  emptyContainer: {
    paddingTop: spacing.xxl * 2,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyIcon: {fontSize: 64},
  emptyTitle: {...typography.headlineSmall, fontWeight: '700', textAlign: 'center'},
  emptySubtitle: {...typography.bodyMedium, opacity: 0.4, textAlign: 'center', lineHeight: 22},
})
