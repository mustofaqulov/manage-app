import {COLORS} from '../config/constants'

export const colors = COLORS

export const getLevelColor = (level: string): string => {
  switch (level.toUpperCase()) {
    case 'A1':
      return COLORS.LEVEL_A1
    case 'A2':
      return COLORS.LEVEL_A2
    case 'B1':
      return COLORS.LEVEL_B1
    case 'B2':
      return COLORS.LEVEL_B2
    case 'C1':
      return COLORS.LEVEL_C1
    case 'C2':
      return COLORS.LEVEL_C2
    default:
      return COLORS.PRIMARY_ORANGE
  }
}

export const gradients = {
  primary: [COLORS.PRIMARY_ORANGE, COLORS.SECONDARY_AMBER],
  ambient: [`${COLORS.PRIMARY_ORANGE}66`, 'transparent'],
}
