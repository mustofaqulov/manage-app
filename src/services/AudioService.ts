import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import Tts from 'react-native-tts'
import Sound from 'react-native-sound'
import {PermissionsAndroid, Platform} from 'react-native'

class AudioService {
  private audioRecorderPlayer: AudioRecorderPlayer
  private isRecording = false
  private recordingPath = ''
  private ttsInitialized = false

  constructor() {
    this.audioRecorderPlayer = new AudioRecorderPlayer()
    // Do NOT call async methods in constructor - causes unhandled promise rejection crash
  }

  private async ensureTtsInitialized(): Promise<void> {
    if (this.ttsInitialized) return
    try {
      await Tts.setDefaultLanguage('en-US')
      await Tts.setDefaultRate(0.9)
      this.ttsInitialized = true
    } catch (err) {
      console.warn('TTS initialization failed:', err)
      // Don't crash - TTS might not be available on this device
    }
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
        console.warn(err)
        return false
      }
    }
    return true // iOS handles permission automatically
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

    const result = await this.audioRecorderPlayer.stopRecorder()
    this.audioRecorderPlayer.removeRecordBackListener()
    this.isRecording = false

    return result
  }

  // Play TTS
  async playTTS(text: string, language = 'en-US'): Promise<void> {
    try {
      await this.ensureTtsInitialized()
      return new Promise(resolve => {
        const finishHandler = () => {
          Tts.removeEventListener('tts-finish', finishHandler)
          Tts.removeEventListener('tts-error', errorHandler)
          resolve()
        }
        const errorHandler = () => {
          Tts.removeEventListener('tts-finish', finishHandler)
          Tts.removeEventListener('tts-error', errorHandler)
          resolve() // Resolve anyway to not block exam flow
        }

        Tts.addEventListener('tts-finish', finishHandler)
        Tts.addEventListener('tts-error', errorHandler)

        Tts.setDefaultLanguage(language).catch(() => {})
        Tts.speak(text)
      })
    } catch (err) {
      console.warn('TTS playback failed:', err)
      // Don't crash exam flow if TTS fails
    }
  }

  // Stop TTS
  stopTTS() {
    try {
      Tts.stop()
    } catch (err) {
      console.warn('TTS stop failed:', err)
    }
  }

  // Play beep sound
  async playBeep(): Promise<void> {
    return new Promise(resolve => {
      try {
        const beep = new Sound('beep.mp3', Sound.MAIN_BUNDLE, error => {
          if (error) {
            console.log('Failed to load beep sound:', error)
            resolve()
            return
          }
          beep.play(success => {
            if (!success) {
              console.log('Beep playback failed')
            }
            beep.release()
            resolve()
          })
        })
      } catch (err) {
        console.warn('playBeep error:', err)
        resolve()
      }
    })
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
  async stopAudio() {
    try {
      await this.audioRecorderPlayer.stopPlayer()
      this.audioRecorderPlayer.removePlayBackListener()
    } catch (err) {
      console.warn('stopAudio failed:', err)
    }
  }

  // Cleanup
  cleanup() {
    this.stopTTS()
    try {
      this.audioRecorderPlayer.removeRecordBackListener()
      this.audioRecorderPlayer.removePlayBackListener()
    } catch (err) {
      console.warn('AudioService cleanup error:', err)
    }
  }
}

export default new AudioService()
