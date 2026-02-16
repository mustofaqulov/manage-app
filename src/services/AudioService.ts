import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import Tts from 'react-native-tts'
import Sound from 'react-native-sound'
import {PermissionsAndroid, Platform} from 'react-native'

class AudioService {
  private audioRecorderPlayer: AudioRecorderPlayer
  private isRecording = false
  private recordingPath = ''

  constructor() {
    this.audioRecorderPlayer = new AudioRecorderPlayer()
    this.initTts()
  }

  private async initTts() {
    await Tts.setDefaultLanguage('en-US')
    await Tts.setDefaultRate(0.9)
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

    this.audioRecorderPlayer.addRecordBackListener(e => {
      // console.log('Recording:', e.currentPosition)
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
    return new Promise((resolve, reject) => {
      Tts.setDefaultLanguage(language)
      Tts.speak(text)

      Tts.addEventListener('tts-finish', () => {
        resolve()
      })

      Tts.addEventListener('tts-error', error => {
        console.error('TTS Error:', error)
        resolve() // Resolve anyway to not block exam flow
      })
    })
  }

  // Stop TTS
  stopTTS() {
    Tts.stop()
  }

  // Play beep sound
  async playBeep(): Promise<void> {
    return new Promise(resolve => {
      const beep = new Sound('beep.mp3', Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('Failed to load beep sound', error)
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
    })
  }

  // Play audio from URL
  async playAudio(url: string): Promise<void> {
    await this.audioRecorderPlayer.startPlayer(url)
    this.audioRecorderPlayer.addPlayBackListener(e => {
      if (e.currentPosition === e.duration) {
        this.audioRecorderPlayer.stopPlayer()
      }
    })
  }

  // Stop audio
  async stopAudio() {
    await this.audioRecorderPlayer.stopPlayer()
    this.audioRecorderPlayer.removePlayBackListener()
  }

  // Cleanup
  cleanup() {
    this.stopTTS()
    this.audioRecorderPlayer.removeRecordBackListener()
    this.audioRecorderPlayer.removePlayBackListener()
  }
}

export default new AudioService()
