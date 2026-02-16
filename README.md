# Manage LC Mobile - React Native

IELTS Speaking mock exam mobile application built with React Native.

## ✨ Features

- 🎤 Audio recording with MediaRecorder
- 🤖 AI-powered scoring (Google Gemini)
- 📊 Score history with charts
- 🌍 Multi-language (uz, en, ru)
- 🔐 Telegram bot authentication
- 📱 Native Android & iOS

## 🛠️ Tech Stack

- **React Native**: 0.76
- **TypeScript**: 5.7
- **State Management**: Redux Toolkit + RTK Query + React Query
- **Navigation**: React Navigation 7
- **Audio**: react-native-audio-recorder-player, react-native-tts
- **UI**: react-native-linear-gradient, react-native-vector-icons
- **i18n**: react-i18next

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

### Installation

```bash
# Install dependencies
npm install
# or
yarn install

# iOS only
cd ios && pod install && cd ..
```

### Run

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

**Start Metro:**
```bash
npm start
```

## 📁 Project Structure

```
src/
├── api/              # API types (from web app)
├── config/           # Constants, axios
├── theme/            # Colors, typography
├── store/            # Redux + RTK Query
│   ├── api.ts        # RTK Query endpoints
│   ├── slices/       # Redux slices
│   └── hooks.ts      # Typed hooks
├── services/         # Audio, Storage services
├── navigation/       # React Navigation
├── screens/          # Screen components
│   ├── auth/         # Login
│   ├── home/         # Home screen
│   ├── tests/        # Test list
│   ├── exam/         # Exam flow
│   ├── history/      # Score history
│   └── profile/      # User profile
├── components/       # Reusable components
├── i18n/             # Translations (uz, en, ru)
└── App.tsx           # Root component
```

## 🎯 Code Reuse from Web App

| Component | Reuse % |
|-----------|---------|
| API Types | 100% ✅ |
| Redux Store | 90% ✅ |
| Constants | 100% ✅ |
| Axios Config | 95% ✅ |
| Business Logic | 80% ✅ |
| i18n | 100% ✅ |

## 🔧 Development

**Reset cache:**
```bash
npm run reset
```

**Clean build:**
```bash
npm run clean
```

**Lint:**
```bash
npm run lint
```

## 📱 Platform Requirements

- **Android**: minSdkVersion 24 (Android 7.0+)
- **iOS**: iOS 13.0+

## 🌐 Backend API

Production: `https://api.managelc.uz`

## 🎯 Exam Flow State Machine

The exam orchestration follows this state machine:

```
MIC_PERMISSION → START_EXAM → IDLE → PREPARING → RECORDING → SAVING → FINISHED
                                ↑                                        ↓
                                └────────────────────────────────────────┘
                                     (next question or finish)
```

### Per-Question Flow

1. **PREPARING** (30s default):
   - Play TTS for question prompt
   - Countdown timer
   - Beep sound

2. **RECORDING** (60s default):
   - Start audio recording (AAC format)
   - Real-time waveform visualization
   - Countdown timer
   - Beep sound

3. **SAVING**:
   - Stop recording
   - Upload audio to S3 (presigned URL)
   - Save response via API
   - Advance to next question

## 🧩 Key Components

### Exam Components (`src/components/exam/`)

- **ExamHeader**: Progress bar showing question number + exit button
- **TimerDisplay**: Circular SVG timer with color transitions (green → yellow → red)
- **StatusIndicator**: Animated status badge (PREPARING/RECORDING/SAVING)
- **WaveformCanvas**: Real-time audio waveform with 30 animated bars

### Common Components (`src/components/common/`)

- **GradientButton**: Primary/secondary button with gradient and loading states
- **GlassmorphicCard**: Card with backdrop blur effect
- **TestCard**: Test list item with CEFR badge, title, description
- **LoadingSpinner**: Loading state with activity indicator
- **ErrorView**: Error state with retry button

### Custom Hooks (`src/hooks/`)

- **useExamFlow**: Main exam state machine hook
  - Manages exam status transitions
  - Handles timers with 16ms precision (~60 FPS)
  - Controls audio recording lifecycle
  - Auto-advances through questions

## 🔑 Environment Variables

Create `.env` file:

```env
API_BASE_URL=https://api.managelc.uz
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🎨 Design System

### Colors
```typescript
PRIMARY_ORANGE: '#FF7300'
SECONDARY_AMBER: '#F59E0B'
BACKGROUND_DARK: '#050505'
SUCCESS: '#10B981'
WARNING: '#F59E0B'
ERROR: '#EF4444'
```

### Typography
- **Display Large**: 57px, weight 400
- **Headline Large**: 32px, weight 400
- **Title Large**: 22px, weight 400
- **Body Large**: 16px, weight 400
- **Label Small**: 11px, weight 500

## 📝 TODO

- [ ] Implement S3 audio upload in `useExamFlow.ts:95-97`
- [ ] Add offline mode with Hive local storage
- [ ] Implement premium subscription checks
- [ ] Add push notifications for exam reminders
- [ ] Integrate Firebase Crashlytics
- [ ] Add audio playback in history screen
- [ ] Implement retry logic for failed uploads

## 🔧 Troubleshooting

### Android Build Errors
```bash
cd android && ./gradlew clean && cd ..
npm start -- --reset-cache
```

### iOS Build Errors
```bash
cd ios && pod deintegrate && pod install && cd ..
npm start -- --reset-cache
```

### Metro Bundler Issues
```bash
npm run reset
```

### Permission Errors
- Android: Check `AndroidManifest.xml` has `RECORD_AUDIO` permission
- iOS: Check `Info.plist` has `NSMicrophoneUsageDescription`

## 🔗 Related Projects

- **manage-LC**: React 19 + TypeScript student web app (source for code reuse)
- **manage-dash**: React 18 + JavaScript admin dashboard

## 📄 License

Proprietary - All rights reserved

