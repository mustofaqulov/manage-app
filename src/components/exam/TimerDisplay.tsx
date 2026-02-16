import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Svg, {Circle} from 'react-native-svg'
import {colors, typography, spacing} from '../../theme'

interface Props {
  seconds: number
  totalSeconds: number
}

export default function TimerDisplay({seconds, totalSeconds}: Props) {
  const progress = (seconds / totalSeconds) * 100
  const circumference = 2 * Math.PI * 50
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Color based on remaining time
  const getColor = () => {
    const percentage = (seconds / totalSeconds) * 100
    if (percentage > 60) return colors.SUCCESS
    if (percentage > 30) return colors.WARNING
    return colors.ERROR
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const remainingSecs = secs % 60
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`
  }

  return (
    <View style={styles.container}>
      <Svg width={120} height={120}>
        {/* Background circle */}
        <Circle
          cx={60}
          cy={60}
          r={50}
          stroke={colors.CARD_BORDER}
          strokeWidth={8}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={60}
          cy={60}
          r={50}
          stroke={getColor()}
          strokeWidth={8}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
      </Svg>
      <View style={styles.timeContainer}>
        <Text style={[styles.timeText, {color: getColor()}]}>{formatTime(seconds)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  timeContainer: {
    position: 'absolute',
  },
  timeText: {
    ...typography.displaySmall,
    fontVariant: ['tabular-nums'],
  },
})
