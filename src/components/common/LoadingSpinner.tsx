import React from 'react'
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native'
import {colors, typography, spacing} from '../../theme'

interface Props {
  text?: string
}

export default function LoadingSpinner({text = 'Loading...'}: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.PRIMARY_ORANGE} />
      {text && <Text style={styles.text}>{text}</Text>}
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
  text: {
    ...typography.bodyLarge,
    marginTop: spacing.md,
  },
})
