import {TextStyle} from 'react-native'
import {colors} from './colors'

export const typography = {
  // Display
  displayLarge: {
    fontSize: 48,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: colors.TEXT_WHITE,
    letterSpacing: -1,
  },
  displayMedium: {
    fontSize: 36,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: colors.TEXT_WHITE,
    letterSpacing: -0.5,
  },
  displaySmall: {
    fontSize: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: colors.TEXT_WHITE,
  },

  // Headline
  headlineLarge: {
    fontSize: 24,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: colors.TEXT_WHITE,
  },
  headlineMedium: {
    fontSize: 20,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: colors.TEXT_WHITE,
  },
  headlineSmall: {
    fontSize: 18,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: colors.TEXT_WHITE,
  },

  // Title
  titleLarge: {
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: colors.TEXT_WHITE,
  },
  titleMedium: {
    fontSize: 14,
    fontWeight: '500' as TextStyle['fontWeight'],
    color: colors.TEXT_WHITE_70,
  },
  titleSmall: {
    fontSize: 12,
    fontWeight: '500' as TextStyle['fontWeight'],
    color: colors.TEXT_WHITE_60,
  },

  // Body
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: colors.TEXT_WHITE_70,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: colors.TEXT_WHITE_70,
    lineHeight: 21,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: colors.TEXT_WHITE_60,
    lineHeight: 18,
  },

  // Label
  labelLarge: {
    fontSize: 14,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: colors.TEXT_WHITE,
    letterSpacing: 0.5,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '500' as TextStyle['fontWeight'],
    color: colors.TEXT_WHITE_70,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: '500' as TextStyle['fontWeight'],
    color: colors.TEXT_WHITE_60,
    letterSpacing: 0.5,
  },
}
