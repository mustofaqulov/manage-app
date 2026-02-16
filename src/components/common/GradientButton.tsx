import React from 'react'
import {TouchableOpacity, Text, StyleSheet, ActivityIndicator} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {colors, typography, spacing, borderRadius, shadows} from '../../theme'

interface Props {
  title: string
  onPress: () => void
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary'
}

export default function GradientButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}: Props) {
  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton, disabled && styles.disabled]}
        onPress={onPress}
        disabled={disabled || loading}>
        {loading ? (
          <ActivityIndicator color={colors.PRIMARY_ORANGE} />
        ) : (
          <Text style={[styles.buttonText, styles.secondaryText]}>{title}</Text>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      style={[disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}>
      <LinearGradient
        colors={[colors.PRIMARY_ORANGE, colors.SECONDARY_AMBER]}
        style={[styles.button, styles.gradientButton]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  gradientButton: {
    ...shadows.glow,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.PRIMARY_ORANGE,
  },
  buttonText: {
    ...typography.labelLarge,
    color: '#FFFFFF',
  },
  secondaryText: {
    color: colors.PRIMARY_ORANGE,
  },
  disabled: {
    opacity: 0.5,
  },
})
