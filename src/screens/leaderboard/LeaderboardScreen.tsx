import React, {useState} from 'react'
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useNavigation} from '@react-navigation/native'
import {colors, typography, spacing, borderRadius, CEFR_COLOR_MAP} from '../../theme'

// Since a dedicated leaderboard API endpoint doesn't exist yet, we show mock data
// TODO: replace MOCK_LEADERS with a real API call once backend supports it

type Period = 'week' | 'month' | 'all'

const MOCK_LEADERS = [
  {rank: 1, name: 'Dilnoza M.', score: 98.5, level: 'C2', badge: '🥇'},
  {rank: 2, name: 'Bobur T.', score: 96.2, level: 'C1', badge: '🥈'},
  {rank: 3, name: 'Kamola R.', score: 94.8, level: 'C1', badge: '🥉'},
  {rank: 4, name: 'Jasur X.', score: 92.1, level: 'B2', badge: '4️⃣'},
  {rank: 5, name: 'Nilufar A.', score: 90.3, level: 'B2', badge: '5️⃣'},
  {rank: 6, name: 'Sherzod K.', score: 88.7, level: 'B2', badge: '6️⃣'},
  {rank: 7, name: 'Malika B.', score: 87.4, level: 'B1', badge: '7️⃣'},
  {rank: 8, name: 'Umid N.', score: 85.9, level: 'B1', badge: '8️⃣'},
  {rank: 9, name: 'Sarvar P.', score: 84.2, level: 'B1', badge: '9️⃣'},
  {rank: 10, name: 'Ozoda H.', score: 82.6, level: 'B1', badge: '🔟'},
]

const podiumColors = ['#F59E0B', '#9CA3AF', '#CD7C2F']

export default function LeaderboardScreen() {
  const navigation = useNavigation()
  // Period selector is visual-only until real leaderboard API is available
  const [period, setPeriod] = useState<Period>('week')

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reyting</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Period Selector */}
      <View style={styles.periodContainer}>
        {(['week', 'month', 'all'] as Period[]).map(p => (
          <TouchableOpacity
            key={p}
            style={[styles.periodChip, period === p && styles.periodChipActive]}
            onPress={() => setPeriod(p)}>
            <Text style={[styles.periodChipText, period === p && styles.periodChipTextActive]}>
              {p === 'week' ? 'Hafta' : p === 'month' ? 'Oy' : 'Hammasi'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Top 3 Podium */}
      <View style={styles.podium}>
        {/* 2nd place */}
        <View style={[styles.podiumItem, styles.podiumSecond]}>
          <Text style={styles.podiumBadge}>🥈</Text>
          <View style={[styles.podiumAvatar, {borderColor: podiumColors[1]}]}>
            <Text style={styles.podiumAvatarText}>{MOCK_LEADERS[1].name.charAt(0)}</Text>
          </View>
          <Text style={styles.podiumName} numberOfLines={1}>{MOCK_LEADERS[1].name}</Text>
          <Text style={[styles.podiumScore, {color: podiumColors[1]}]}>{MOCK_LEADERS[1].score}%</Text>
          <View style={[styles.podiumBase, {height: 50, backgroundColor: podiumColors[1] + '30'}]}>
            <Text style={styles.podiumRank}>2</Text>
          </View>
        </View>

        {/* 1st place */}
        <View style={[styles.podiumItem, styles.podiumFirst]}>
          <Text style={styles.podiumCrown}>👑</Text>
          <Text style={styles.podiumBadge}>🥇</Text>
          <View style={[styles.podiumAvatar, styles.podiumAvatarLarge, {borderColor: podiumColors[0]}]}>
            <Text style={[styles.podiumAvatarText, styles.podiumAvatarTextLarge]}>{MOCK_LEADERS[0].name.charAt(0)}</Text>
          </View>
          <Text style={styles.podiumName} numberOfLines={1}>{MOCK_LEADERS[0].name}</Text>
          <Text style={[styles.podiumScore, {color: podiumColors[0]}]}>{MOCK_LEADERS[0].score}%</Text>
          <View style={[styles.podiumBase, {height: 70, backgroundColor: podiumColors[0] + '30'}]}>
            <Text style={styles.podiumRank}>1</Text>
          </View>
        </View>

        {/* 3rd place */}
        <View style={[styles.podiumItem, styles.podiumThird]}>
          <Text style={styles.podiumBadge}>🥉</Text>
          <View style={[styles.podiumAvatar, {borderColor: podiumColors[2]}]}>
            <Text style={styles.podiumAvatarText}>{MOCK_LEADERS[2].name.charAt(0)}</Text>
          </View>
          <Text style={styles.podiumName} numberOfLines={1}>{MOCK_LEADERS[2].name}</Text>
          <Text style={[styles.podiumScore, {color: podiumColors[2]}]}>{MOCK_LEADERS[2].score}%</Text>
          <View style={[styles.podiumBase, {height: 35, backgroundColor: podiumColors[2] + '30'}]}>
            <Text style={styles.podiumRank}>3</Text>
          </View>
        </View>
      </View>

      {/* List (4th and beyond) */}
      <FlatList
        data={MOCK_LEADERS.slice(3)}
        keyExtractor={item => String(item.rank)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.listHeader}>Top o'rinlar</Text>
        }
        renderItem={({item}) => {
          const levelColor = CEFR_COLOR_MAP[item.level] ?? colors.PRIMARY_ORANGE
          return (
            <View style={styles.leaderRow}>
              <Text style={styles.rankText}>{item.badge}</Text>
              <View style={[styles.leaderAvatar, {borderColor: levelColor + '60'}]}>
                <Text style={styles.leaderAvatarText}>{item.name.charAt(0)}</Text>
              </View>
              <View style={styles.leaderInfo}>
                <Text style={styles.leaderName}>{item.name}</Text>
                <View style={[styles.levelBadge, {backgroundColor: levelColor + '20', borderColor: levelColor}]}>
                  <Text style={[styles.levelBadgeText, {color: levelColor}]}>{item.level}</Text>
                </View>
              </View>
              <Text style={styles.leaderScore}>{item.score}%</Text>
            </View>
          )
        }}
      />
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
  headerSpacer: {width: 40},
  periodContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  periodChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    alignItems: 'center',
  },
  periodChipActive: {backgroundColor: colors.PRIMARY_ORANGE + '20', borderColor: colors.PRIMARY_ORANGE},
  periodChipText: {...typography.labelSmall, opacity: 0.5},
  periodChipTextActive: {color: colors.PRIMARY_ORANGE, opacity: 1},
  // Podium
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  podiumItem: {alignItems: 'center', flex: 1},
  podiumFirst: {marginBottom: 0},
  podiumSecond: {marginBottom: 0},
  podiumThird: {marginBottom: 0},
  podiumCrown: {fontSize: 20, marginBottom: 2},
  podiumBadge: {fontSize: 18, marginBottom: spacing.xs},
  podiumAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  podiumAvatarLarge: {width: 56, height: 56, borderRadius: 28},
  podiumAvatarText: {fontSize: 18, fontWeight: '700', color: '#fff'},
  podiumAvatarTextLarge: {fontSize: 22},
  podiumName: {...typography.labelSmall, textAlign: 'center', marginBottom: 2},
  podiumScore: {...typography.labelMedium, fontWeight: '700', marginBottom: spacing.xs},
  podiumBase: {
    width: '100%',
    borderTopLeftRadius: borderRadius.sm,
    borderTopRightRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumRank: {...typography.headlineSmall, fontWeight: '900', opacity: 0.4},
  // List
  list: {paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxl},
  listHeader: {...typography.titleLarge, fontWeight: '700', marginBottom: spacing.sm},
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  rankText: {fontSize: 16, width: 28, textAlign: 'center'},
  leaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderAvatarText: {fontSize: 16, fontWeight: '700', color: '#fff'},
  leaderInfo: {flex: 1, gap: 4},
  leaderName: {...typography.bodyMedium, fontWeight: '600'},
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  levelBadgeText: {...typography.labelSmall, fontWeight: '700', fontSize: 10},
  leaderScore: {...typography.titleLarge, fontWeight: '700', color: colors.PRIMARY_ORANGE},
})
