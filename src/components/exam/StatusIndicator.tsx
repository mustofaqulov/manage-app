import React, {useEffect, useRef} from 'react'
import {View, Text, StyleSheet, Animated} from 'react-native'
import {colors, typography, spacing} from '../../theme'
import {ExamStatus} from '../../hooks/useExamFlow'

interface Props {
  status: ExamStatus
}

export default function StatusIndicator({status}: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (status === ExamStatus.PREPARING || status === ExamStatus.RECORDING) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    } else {
      pulseAnim.setValue(1)
    }
  }, [status, pulseAnim])

  const getStatusInfo = () => {
    switch (status) {
      case ExamStatus.PREPARING:
        return {text: 'Preparing...', color: colors.WARNING}
      case ExamStatus.RECORDING:
        return {text: 'Recording ⬤', color: colors.ERROR}
      case ExamStatus.SAVING:
        return {text: 'Saving...', color: colors.INFO}
      default:
        return {text: '', color: colors.TEXT_WHITE}
    }
  }

  const {text, color} = getStatusInfo()

  if (!text) return null

  return (
    <Animated.View style={[styles.container, {transform: [{scale: pulseAnim}]}]}>
      <View style={[styles.badge, {backgroundColor: `${color}20`}]}>
        <Text style={[styles.text, {color}]}>{text}</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  text: {
    ...typography.labelLarge,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
})
