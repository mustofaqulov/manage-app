import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useNavigation} from '@react-navigation/native'
import type {NativeStackNavigationProp} from '@react-navigation/native-stack'
import LinearGradient from 'react-native-linear-gradient'
import {useTranslation} from 'react-i18next'
import type {RootStackParamList} from '../../navigation/RootNavigator'
import {colors, typography, spacing, borderRadius} from '../../theme'
import {useAppSelector} from '../../store/hooks'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export default function HomeScreen() {
  const {t} = useTranslation()
  const navigation = useNavigation<NavigationProp>()
  const {user} = useAppSelector(state => state.auth)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {t('home.title')}, {user?.firstName || 'User'}!
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Tests')}>
            <LinearGradient
              colors={[colors.PRIMARY_ORANGE, colors.SECONDARY_AMBER]}
              style={styles.button}>
              <Text style={styles.buttonText}>{t('home.startExam')}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <View style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>{t('home.myHistory')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_DARK,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    ...typography.displayMedium,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  buttonsContainer: {
    gap: spacing.md,
  },
  button: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.labelLarge,
    color: '#FFFFFF',
  },
  secondaryButton: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.PRIMARY_ORANGE,
  },
  secondaryButtonText: {
    ...typography.labelLarge,
    color: colors.PRIMARY_ORANGE,
  },
})
