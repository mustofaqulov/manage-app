import {useState, useRef, useCallback} from 'react'
import {AppState, Alert} from 'react-native'
import RNFS from 'react-native-fs'
import AudioService from '../services/AudioService'
import {usePresignUploadMutation, useUpsertResponseMutation} from '../store/api'
import type {QuestionResponse, AssetType} from '../api/types'

export enum ExamStatus {
  MIC_PERMISSION = 'MIC_PERMISSION',
  START_EXAM = 'START_EXAM',
  IDLE = 'IDLE',
  PREPARING = 'PREPARING',
  RECORDING = 'RECORDING',
  SAVING = 'SAVING',
  FINISHED = 'FINISHED',
}

interface ExamState {
  status: ExamStatus
  currentQuestionIndex: number
  timerSeconds: number
  attemptId: string | null
  isRecording: boolean
}

export const useExamFlow = (questions: QuestionResponse[]) => {
  const [state, setState] = useState<ExamState>({
    status: ExamStatus.MIC_PERMISSION,
    currentQuestionIndex: 0,
    timerSeconds: 0,
    attemptId: null,
    isRecording: false,
  })

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const recordingPathRef = useRef<string>('')
  const appStateRef = useRef(AppState.currentState)

  // API mutations
  const [presignUpload] = usePresignUploadMutation()
  const [upsertResponse] = useUpsertResponseMutation()

  // Start timer (RAF-equivalent with setInterval)
  const startTimer = useCallback((seconds: number): Promise<void> => {
    return new Promise(resolve => {
      setState(prev => ({...prev, timerSeconds: seconds}))

      const startTime = Date.now()
      timerIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        const remaining = seconds - elapsed

        if (remaining <= 0) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current)
          }
          setState(prev => ({...prev, timerSeconds: 0}))
          resolve()
        } else {
          setState(prev => ({...prev, timerSeconds: remaining}))
        }
      }, 16) // ~60 FPS
    })
  }, [])

  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
  }, [])

  // Run question flow
  const runQuestion = useCallback(
    async (question: QuestionResponse, attemptId: string) => {
      try {
        const prepTime = (question.settings as any)?.delay || 30
        const recordTime = (question.settings as any)?.duration || 60

        // PREPARING phase
        setState(prev => ({...prev, status: ExamStatus.PREPARING}))
        await AudioService.playTTS(question.prompt)
        await startTimer(prepTime)
        await AudioService.playBeep()

        // RECORDING phase
        setState(prev => ({...prev, status: ExamStatus.RECORDING, isRecording: true}))
        const path = await AudioService.startRecording()
        recordingPathRef.current = path

        await startTimer(recordTime)
        await AudioService.playBeep()

        const recordedPath = await AudioService.stopRecording()
        setState(prev => ({...prev, isRecording: false}))

        // SAVING phase
        setState(prev => ({...prev, status: ExamStatus.SAVING}))

        try {
          // 1. Read audio file
          const audioBase64 = await RNFS.readFile(recordedPath, 'base64')
          const audioBuffer = Buffer.from(audioBase64, 'base64')

          // 2. Get presigned upload URL
          const presignResult = await presignUpload({
            assetType: 'AUDIO' as AssetType,
            mimeType: 'audio/aac',
            filename: `response_${question.id}.aac`,
            fileSizeBytes: audioBuffer.length,
            contextType: 'RESPONSE',
            questionId: question.id,
            attemptId: attemptId,
          }).unwrap()

          // 3. Upload to S3
          await fetch(presignResult.uploadUrl, {
            method: presignResult.method,
            headers: {
              ...presignResult.headers,
              'Content-Type': 'audio/aac',
            },
            body: audioBuffer,
          })

          // 4. Save response with assetId
          await upsertResponse({
            attemptId: attemptId,
            data: {
              questionId: question.id,
              answer: {
                assetId: presignResult.assetId,
              },
            },
          }).unwrap()

          console.log('✅ Audio uploaded and response saved successfully')
        } catch (error) {
          console.error('❌ Failed to upload audio:', error)
          Alert.alert('Error', 'Failed to save your response. Please try again.')
          // Don't advance to next question on error
          setState(prev => ({...prev, status: ExamStatus.IDLE}))
          return
        }

        // Advance to next question or finish
        if (state.currentQuestionIndex < questions.length - 1) {
          setState(prev => ({
            ...prev,
            status: ExamStatus.IDLE,
            currentQuestionIndex: prev.currentQuestionIndex + 1,
          }))
        } else {
          setState(prev => ({...prev, status: ExamStatus.FINISHED}))
        }
      } catch (error) {
        console.error('Question flow error:', error)
        // Handle error
      }
    },
    [questions.length, startTimer, state.currentQuestionIndex],
  )

  // Request mic permission
  const requestMicPermission = useCallback(async () => {
    try {
      const granted = await AudioService.requestPermission()
      if (granted) {
        setState(prev => ({...prev, status: ExamStatus.START_EXAM}))
      }
      return granted
    } catch (error) {
      console.error('Permission error:', error)
      return false
    }
  }, [])

  // Start exam
  const startExam = useCallback((attemptId: string) => {
    setState(prev => ({
      ...prev,
      status: ExamStatus.IDLE,
      attemptId,
      currentQuestionIndex: 0,
    }))
  }, [])

  // Cleanup
  const cleanup = useCallback(() => {
    stopTimer()
    AudioService.cleanup()
  }, [stopTimer])

  return {
    state,
    requestMicPermission,
    startExam,
    runQuestion,
    cleanup,
  }
}
