export const API_BASE_URL = 'https://api.managelc.uz'

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  LANGUAGE: 'manage_lc_language',
  LEGACY_USER: 'manage_lc_user',
} as const

export const QUERY_KEYS = {
  USER: 'user',
  TESTS: 'tests',
  TEST: 'test',
  SECTION: 'section',
  ATTEMPTS: 'attempts',
  ATTEMPT: 'attempt',
  DOWNLOAD_URL: 'download_url',
} as const

export const COLORS = {
  // Brand Colors
  PRIMARY_ORANGE: '#FF7300',
  SECONDARY_AMBER: '#F59E0B',

  // Background
  BACKGROUND_DARK: '#050505',
  BACKGROUND_DARK_SECONDARY: '#0A0A0A',
  BACKGROUND_DARK_TERTIARY: '#120E08',

  // Text
  TEXT_WHITE: '#FFFFFF',
  TEXT_WHITE_70: 'rgba(255, 255, 255, 0.7)',
  TEXT_WHITE_60: 'rgba(255, 255, 255, 0.6)',
  TEXT_WHITE_40: 'rgba(255, 255, 255, 0.4)',

  // Card
  CARD_GLASS: 'rgba(255, 255, 255, 0.05)',
  CARD_BORDER: 'rgba(255, 255, 255, 0.1)',

  // Status
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#FBBF24',
  INFO: '#3B82F6',

  // CEFR Levels
  LEVEL_A1: '#10B981',
  LEVEL_A2: '#34D399',
  LEVEL_B1: '#3B82F6',
  LEVEL_B2: '#60A5FA',
  LEVEL_C1: '#F59E0B',
  LEVEL_C2: '#EF4444',
} as const

export const TELEGRAM_BOT_USERNAME = 'managelcbot'

export const DEFAULT_STALE_TIMES = {
  USER: 5 * 60 * 1000, // 5 minutes
  TESTS: 10 * 60 * 1000, // 10 minutes
  TEST: 10 * 60 * 1000,
  SECTION: 10 * 60 * 1000,
  ATTEMPTS: 2 * 60 * 1000, // 2 minutes
  ATTEMPT: 30 * 1000, // 30 seconds
  DOWNLOAD_URL: 5 * 60 * 1000,
} as const
