import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import {colors, typography, spacing} from '../../theme'

interface Props {
  currentQuestion: number
  totalQuestions: number
  onExit: () => void
}

export default function ExamHeader({currentQuestion, totalQuestions, onExit}: Props) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} / {totalQuestions}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {width: `${progress}%`}]} />
        </View>
      </View>

      <TouchableOpacity style={styles.exitButton} onPress={onExit}>
        <Text style={styles.exitText}>✕</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.CARD_GLASS,
    borderBottomWidth: 1,
    borderBottomColor: colors.CARD_BORDER,
  },
  progressContainer: {
    flex: 1,
  },
  progressText: {
    ...typography.bodySmall,
    marginBottom: spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.CARD_BORDER,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.PRIMARY_ORANGE,
  },
  exitButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  exitText: {
    ...typography.headlineSmall,
    color: colors.TEXT_WHITE_70,
  },
})
