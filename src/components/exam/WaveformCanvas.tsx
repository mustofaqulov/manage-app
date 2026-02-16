import React, {useEffect, useState} from 'react'
import {View, StyleSheet} from 'react-native'
import Svg, {Rect} from 'react-native-svg'
import {colors, spacing} from '../../theme'

interface Props {
  isRecording: boolean
}

export default function WaveformCanvas({isRecording}: Props) {
  const [bars, setBars] = useState<number[]>(Array(30).fill(0))

  useEffect(() => {
    if (!isRecording) {
      setBars(Array(30).fill(0))
      return
    }

    const interval = setInterval(() => {
      setBars(prev =>
        prev.map(() => Math.random() * 60 + 20), // Random heights between 20-80
      )
    }, 100) // Update every 100ms

    return () => clearInterval(interval)
  }, [isRecording])

  if (!isRecording) return null

  const barWidth = 8
  const gap = 4
  const totalWidth = 30 * (barWidth + gap)
  const height = 100

  return (
    <View style={styles.container}>
      <Svg width={totalWidth} height={height}>
        {bars.map((barHeight, index) => {
          const x = index * (barWidth + gap)
          const y = (height - barHeight) / 2

          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={colors.PRIMARY_ORANGE}
              rx={4}
            />
          )
        })}
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
  },
})
