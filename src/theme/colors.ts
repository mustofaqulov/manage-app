import {COLORS} from '../config/constants'

export const colors = COLORS

// Single source of truth for CEFR level colors — import this instead of
// defining CEFR_COLORS locally in each screen.
export const CEFR_COLOR_MAP: Record<string, string> = {
  A1: COLORS.LEVEL_A1,
  A2: COLORS.LEVEL_A2,
  B1: COLORS.LEVEL_B1,
  B2: COLORS.LEVEL_B2,
  C1: COLORS.LEVEL_C1,
  C2: COLORS.LEVEL_C2,
}

export const getLevelColor = (level: string): string =>
  CEFR_COLOR_MAP[level.toUpperCase()] ?? COLORS.PRIMARY_ORANGE

export const gradients = {
  primary: [COLORS.PRIMARY_ORANGE, COLORS.SECONDARY_AMBER],
  ambient: [`${COLORS.PRIMARY_ORANGE}66`, 'transparent'],
}
