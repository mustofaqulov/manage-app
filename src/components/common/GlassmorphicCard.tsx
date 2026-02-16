import React, {ReactNode} from 'react'
import {View, StyleSheet, ViewStyle} from 'react-native'
import {colors, borderRadius, spacing} from '../../theme'

interface Props {
  children: ReactNode
  style?: ViewStyle
}

export default function GlassmorphicCard({children, style}: Props) {
  return <View style={[styles.card, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
})
