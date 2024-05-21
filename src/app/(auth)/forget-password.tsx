import { Button } from '@/components/button'
import { Icon } from '@/components/icon'
import { Input } from '@/components/input'
import { useAuth } from '@/hooks/useAuth'
import { colors } from '@/styles/colors'
import { Link, router } from 'expo-router'
import { AtSign, Lock } from 'lucide-react-native'
import { useState } from 'react'
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import { isEmail } from 'validator'

export default function ForgetPassword() {
  const { updatePassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleUpdatePasswordSubmit() {
    setLoading(true)

    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Erro!', 'Os campos não podem ser vazio.', [
        {
          text: 'OK',
          onPress: () => {
            setLoading(false)
          },
        },
      ])
      return
    }

    if (!isEmail(email)) {
      Alert.alert('Erro!', 'Endereço de e-mail válido.', [
        {
          text: 'OK',
          onPress: () => {
            setLoading(false)
          },
        },
      ])
      return
    }

    if (password.trim().length < 6) {
      Alert.alert('Erro!', 'Sua senha deve contar no minímo 6 caracteres.', [
        {
          text: 'OK',
          onPress: () => {
            setLoading(false)
          },
        },
      ])
      return
    }

    try {
      await updatePassword({ email, password })

      Alert.alert('Sucesso!', 'Senha atualizada com sucesso.', [
        {
          text: 'OK',
          onPress: () => {
            setLoading(false)
            setEmail('')
            setPassword('')
            router.push('/')
          },
        },
      ])
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erro!', error.message, [
          {
            text: 'OK',
            onPress: () => {
              setLoading(false)
            },
          },
        ])
      }
    }
  }

  return (
    <ScrollView automaticallyAdjustKeyboardInsets>
      <View className="items-center justify-center min-h-screen p-6 bg-white">
        <Image
          className="w-auto h-16 mb-32"
          source={require('../../assets/images/logo.png')}
          resizeMode="contain"
        />

        <Text className="mb-6 font-semibold text-zinc-700">Trocar senha</Text>

        <View className="w-full gap-4">
          <Input.Root>
            <Icon icon={AtSign} color={colors.gray[400]} />
            <Input.Field
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="E-mail"
              autoCapitalize="none"
            />
          </Input.Root>
          <Input.Root>
            <Icon icon={Lock} color={colors.gray[400]} />
            <Input.Field
              value={password}
              onChangeText={setPassword}
              placeholder="Nova senha"
              secureTextEntry
            />
          </Input.Root>
          <Button
            isLoading={loading}
            title="Atualizar senha"
            onPress={handleUpdatePasswordSubmit}
          />
          <Link href="/">
            <Text className="text-sm text-center text-zinc-400">Voltar</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  )
}
