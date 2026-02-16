import React, {useState} from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import LinearGradient from 'react-native-linear-gradient'
import {useTranslation} from 'react-i18next'
import Toast from 'react-native-toast-message'
import {useLoginMutation, useUpdateMeMutation} from '../../store/api'
import {colors, typography, spacing, borderRadius} from '../../theme'
import {TELEGRAM_BOT_USERNAME} from '../../config/constants'

type LoginStep = 'PHONE' | 'CODE' | 'PROFILE'

export default function LoginScreen() {
  const {t} = useTranslation()
  const [step, setStep] = useState<LoginStep>('PHONE')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  const [login, {isLoading: isLoggingIn}] = useLoginMutation()
  const [updateMe, {isLoading: isUpdating}] = useUpdateMeMutation()

  const handleSendCode = async () => {
    if (phone.length < 9) {
      Toast.show({type: 'error', text1: 'Telefon raqami noto\'g\'ri'})
      return
    }

    // Open Telegram bot
    const fullPhone = `998${phone}`
    const telegramUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=login_${fullPhone}`

    try {
      await Linking.openURL(telegramUrl)
      setStep('CODE')
    } catch (error) {
      Toast.show({type: 'error', text1: 'Telegram ochilmadi'})
    }
  }

  const handleVerifyCode = async () => {
    if (code.length !== 5) {
      Toast.show({type: 'error', text1: 'Kod 5 raqamli bo\'lishi kerak'})
      return
    }

    try {
      const result = await login({
        phone: `998${phone}`,
        pinCode: code,
      }).unwrap()

      if (result.missingInfo) {
        setStep('PROFILE')
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Kirish xatosi',
        text2: error?.data?.message || 'Qayta urinib ko\'ring',
      })
    }
  }

  const handleSaveProfile = async () => {
    if (!firstName || !lastName) {
      Toast.show({type: 'error', text1: 'Ism va familiyani kiriting'})
      return
    }

    try {
      await updateMe({
        firstName,
        lastName,
        email: email || null,
      }).unwrap()

      Toast.show({type: 'success', text1: 'Profil saqlandi'})
    } catch (error: any) {
      Toast.show({type: 'error', text1: 'Xato yuz berdi'})
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>{t('auth.login')}</Text>

            {step === 'PHONE' && (
              <View style={styles.form}>
                <Text style={styles.label}>{t('auth.phone')}</Text>
                <View style={styles.phoneInput}>
                  <Text style={styles.phonePrefix}>+998</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t('auth.phonePlaceholder')}
                    placeholderTextColor={colors.TEXT_WHITE_40}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    maxLength={9}
                  />
                </View>

                <TouchableOpacity onPress={handleSendCode} disabled={isLoggingIn}>
                  <LinearGradient
                    colors={[colors.PRIMARY_ORANGE, colors.SECONDARY_AMBER]}
                    style={styles.button}>
                    <Text style={styles.buttonText}>{t('auth.sendCode')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {step === 'CODE' && (
              <View style={styles.form}>
                <Text style={styles.label}>{t('auth.code')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.codePlaceholder')}
                  placeholderTextColor={colors.TEXT_WHITE_40}
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={5}
                />

                <TouchableOpacity onPress={handleVerifyCode} disabled={isLoggingIn}>
                  <LinearGradient
                    colors={[colors.PRIMARY_ORANGE, colors.SECONDARY_AMBER]}
                    style={styles.button}>
                    <Text style={styles.buttonText}>{t('auth.verify')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {step === 'PROFILE' && (
              <View style={styles.form}>
                <Text style={styles.label}>{t('auth.firstName')}</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholderTextColor={colors.TEXT_WHITE_40}
                />

                <Text style={styles.label}>{t('auth.lastName')}</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholderTextColor={colors.TEXT_WHITE_40}
                />

                <Text style={styles.label}>{t('auth.email')}</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={colors.TEXT_WHITE_40}
                />

                <TouchableOpacity onPress={handleSaveProfile} disabled={isUpdating}>
                  <LinearGradient
                    colors={[colors.PRIMARY_ORANGE, colors.SECONDARY_AMBER]}
                    style={styles.button}>
                    <Text style={styles.buttonText}>{t('auth.save')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_DARK,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    ...typography.displayMedium,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
  },
  label: {
    ...typography.labelLarge,
    marginBottom: spacing.xs,
  },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  phonePrefix: {
    ...typography.bodyLarge,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.bodyLarge,
    backgroundColor: colors.CARD_GLASS,
    borderWidth: 1,
    borderColor: colors.CARD_BORDER,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.TEXT_WHITE,
  },
  button: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonText: {
    ...typography.labelLarge,
    color: '#FFFFFF',
  },
})
