import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet, BackHandler, Alert} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import type {NativeStackScreenProps} from '@react-navigation/native-stack'
import type {RootStackParamList} from '../../navigation/RootNavigator'
import {
  useGetTestQuery,
  useGetSectionQuery,
  useStartAttemptMutation,
  useSubmitAttemptMutation,
} from '../../store/api'
import {useExamFlow, ExamStatus} from '../../hooks/useExamFlow'
import {colors, typography, spacing} from '../../theme'

// Components
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorView from '../../components/common/ErrorView'
import GradientButton from '../../components/common/GradientButton'
import ExamHeader from '../../components/exam/ExamHeader'
import TimerDisplay from '../../components/exam/TimerDisplay'
import StatusIndicator from '../../components/exam/StatusIndicator'
import WaveformCanvas from '../../components/exam/WaveformCanvas'
import GlassmorphicCard from '../../components/common/GlassmorphicCard'

type Props = NativeStackScreenProps<RootStackParamList, 'ExamFlow'>

export default function ExamFlowScreen({route, navigation}: Props) {
  const {testId} = route.params

  // Fetch test data
  const {data: test, isLoading, error} = useGetTestQuery(testId)
  const [startAttemptMutation] = useStartAttemptMutation()
  const [submitAttemptMutation] = useSubmitAttemptMutation()

  // Get first section for now (simplified)
  const sectionId = test?.sections[0]?.id
  const {data: section} = useGetSectionQuery(
    {testId, sectionId: sectionId || ''},
    {skip: !sectionId},
  )

  const questions = section?.questions || []
  const {state, requestMicPermission, startExam, runQuestion, cleanup} =
    useExamFlow(questions)

  // Handle back button
  useEffect(() => {
    const backAction = () => {
      if (state.status !== ExamStatus.MIC_PERMISSION && state.status !== ExamStatus.START_EXAM) {
        Alert.alert('Exit Exam?', 'Your progress will be lost.', [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Exit', style: 'destructive', onPress: () => navigation.goBack()},
        ])
        return true
      }
      return false
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => subscription.remove()
  }, [state.status, navigation])

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup()
  }, [cleanup])

  // Auto-run question when IDLE
  useEffect(() => {
    if (
      state.status === ExamStatus.IDLE &&
      state.attemptId &&
      questions[state.currentQuestionIndex]
    ) {
      runQuestion(questions[state.currentQuestionIndex], state.attemptId)
    }
  }, [state.status, state.attemptId, state.currentQuestionIndex, questions, runQuestion])

  const handleStartExam = async () => {
    try {
      const response = await startAttemptMutation({testId}).unwrap()
      startExam(response.attemptId)
    } catch (error) {
      Alert.alert('Error', 'Failed to start exam')
    }
  }

  const handleExit = () => {
    Alert.alert('Exit Exam?', 'Your progress will be lost.', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Exit', style: 'destructive', onPress: () => navigation.goBack()},
    ])
  }

  const handleFinish = async () => {
    if (state.attemptId) {
      try {
        await submitAttemptMutation(state.attemptId).unwrap()
        navigation.navigate('History')
      } catch (error) {
        Alert.alert('Error', 'Failed to submit exam')
      }
    }
  }

  if (isLoading) return <LoadingSpinner text="Loading test..." />
  if (error || !test) return <ErrorView message="Failed to load test" />
  if (!section) return <LoadingSpinner text="Loading questions..." />

  const currentQuestion = questions[state.currentQuestionIndex]

  return (
    <SafeAreaView style={styles.container}>
      {/* MIC PERMISSION */}
      {state.status === ExamStatus.MIC_PERMISSION && (
        <View style={styles.centerContent}>
          <Text style={styles.emoji}>🎤</Text>
          <Text style={styles.title}>Microphone Permission</Text>
          <Text style={styles.subtitle}>
            We need access to your microphone to record your answers
          </Text>
          <View style={styles.buttonContainer}>
            <GradientButton title="Allow Microphone" onPress={requestMicPermission} />
          </View>
        </View>
      )}

      {/* START EXAM */}
      {state.status === ExamStatus.START_EXAM && (
        <View style={styles.centerContent}>
          <GlassmorphicCard style={styles.infoCard}>
            <Text style={styles.testTitle}>{test.title}</Text>
            {test.description && <Text style={styles.testDescription}>{test.description}</Text>}

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{test.sections.length}</Text>
                <Text style={styles.statLabel}>Sections</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{questions.length}</Text>
                <Text style={styles.statLabel}>Questions</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{test.timeLimitMinutes}</Text>
                <Text style={styles.statLabel}>Minutes</Text>
              </View>
            </View>
          </GlassmorphicCard>

          <View style={styles.buttonContainer}>
            <GradientButton title="Start Exam" onPress={handleStartExam} />
            <GradientButton title="Cancel" variant="secondary" onPress={() => navigation.goBack()} />
          </View>
        </View>
      )}

      {/* EXAM IN PROGRESS */}
      {state.status !== ExamStatus.MIC_PERMISSION &&
        state.status !== ExamStatus.START_EXAM &&
        state.status !== ExamStatus.FINISHED && (
          <>
            <ExamHeader
              currentQuestion={state.currentQuestionIndex}
              totalQuestions={questions.length}
              onExit={handleExit}
            />

            <View style={styles.examContent}>
              <StatusIndicator status={state.status} />

              {state.timerSeconds > 0 && (
                <TimerDisplay
                  seconds={state.timerSeconds}
                  totalSeconds={
                    state.status === ExamStatus.PREPARING
                      ? (currentQuestion?.settings as any)?.delay || 30
                      : (currentQuestion?.settings as any)?.duration || 60
                  }
                />
              )}

              <GlassmorphicCard style={styles.questionCard}>
                <Text style={styles.questionText}>{currentQuestion?.prompt}</Text>
              </GlassmorphicCard>

              <WaveformCanvas isRecording={state.isRecording} />
            </View>
          </>
        )}

      {/* FINISHED */}
      {state.status === ExamStatus.FINISHED && (
        <View style={styles.centerContent}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>Exam Complete!</Text>
          <Text style={styles.subtitle}>
            Your answers have been recorded. You can view your results in the history section.
          </Text>
          <View style={styles.buttonContainer}>
            <GradientButton title="View Results" onPress={handleFinish} />
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_DARK,
  },
  centerContent: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  examContent: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.headlineLarge,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyLarge,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  infoCard: {
    marginBottom: spacing.xl,
  },
  testTitle: {
    ...typography.headlineMedium,
    marginBottom: spacing.xs,
  },
  testDescription: {
    ...typography.bodyMedium,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.displaySmall,
    color: colors.PRIMARY_ORANGE,
  },
  statLabel: {
    ...typography.bodySmall,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  questionCard: {
    marginVertical: spacing.lg,
  },
  questionText: {
    ...typography.bodyLarge,
    lineHeight: 28,
  },
})
