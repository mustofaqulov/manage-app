import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import {PermissionsAndroid, Platform} from 'react-native'

// NOTE: react-native-tts and react-native-sound are intentionally NOT imported
// at the module level. On Android, TTS auto-initializes when internet is
// available and tries to download voice packs, causing native crashes.
// TTS and beep are non-essential features (users can read question text).

class AudioService {
  private audioRecorderPlayer: AudioRecorderPlayer
  private isRecording = false
  private recordingPath = ''

  constructor() {
    this.audioRecorderPlayer = new AudioRecorderPlayer()
  }

  // Request microphone permission
  async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'Imtihon davomida ovozingizni yozish uchun mikrofon kerak',
            buttonNeutral: 'Keyinroq',
            buttonNegative: 'Yo\'q',
            buttonPositive: 'Ha',
          },
        )
        return granted === PermissionsAndroid.RESULTS.GRANTED
      } catch (err) {
        console.warn('Permission request error:', err)
        return false
      }
    }
    return true
  }

  // Start recording
  async startRecording(): Promise<string> {
    if (this.isRecording) {
      throw new Error('Already recording')
    }

    const hasPermission = await this.requestPermission()
    if (!hasPermission) {
      throw new Error('Microphone permission denied')
    }

    const path = `${Date.now()}.m4a`
    this.recordingPath = path

    await this.audioRecorderPlayer.startRecorder(path)
    this.isRecording = true

    this.audioRecorderPlayer.addRecordBackListener(() => {
      // recording in progress
    })

    return path
  }

  // Stop recording
  async stopRecording(): Promise<string> {
    if (!this.isRecording) {
      return this.recordingPath
    }

    try {
      const result = await this.audioRecorderPlayer.stopRecorder()
      this.audioRecorderPlayer.removeRecordBackListener()
      this.isRecording = false
      return result
    } catch (err) {
      console.warn('stopRecording error:', err)
      this.isRecording = false
      return this.recordingPath
    }
  }

  // Play TTS - disabled (causes native crash on Android when internet is available)
  // Users can read the question text on screen
  async playTTS(_text: string, _language = 'en-US'): Promise<void> {
    return Promise.resolve()
  }

  stopTTS(): void {
    // no-op
  }

  // Play beep - disabled (react-native-sound can cause issues)
  async playBeep(): Promise<void> {
    return Promise.resolve()
  }

  // Play audio from URL
  async playAudio(url: string): Promise<void> {
    try {
      await this.audioRecorderPlayer.startPlayer(url)
      this.audioRecorderPlayer.addPlayBackListener(e => {
        if (e.currentPosition === e.duration) {
          this.audioRecorderPlayer.stopPlayer()
        }
      })
    } catch (err) {
      console.warn('playAudio failed:', err)
    }
  }

  // Stop audio
  async stopAudio(): Promise<void> {
    try {
      await this.audioRecorderPlayer.stopPlayer()
      this.audioRecorderPlayer.removePlayBackListener()
    } catch (err) {
      console.warn('stopAudio failed:', err)
    }
  }

  // Cleanup
  cleanup(): void {
    try {
      if (this.isRecording) {
        this.audioRecorderPlayer.stopRecorder().catch(() => {})
        this.audioRecorderPlayer.removeRecordBackListener()
        this.isRecording = false
      }
      this.audioRecorderPlayer.removePlayBackListener()
    } catch (err) {
      console.warn('AudioService cleanup error:', err)
    }
  }
}

export default new AudioService()
