import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import GradientButton from './GradientButton'
import {colors, typography, spacing} from '../../theme'

interface Props {
  message?: string
  onRetry?: () => void
}

export default function ErrorView({
  message = 'Something went wrong',
  onRetry,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <View style={styles.buttonContainer}>
          <GradientButton title="Retry" onPress={onRetry} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  message: {
    ...typography.bodyLarge,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
})
