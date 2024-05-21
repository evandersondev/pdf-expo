import { colors } from '@/styles/colors'
import { router } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { ReactNode } from 'react'
import { Image, Pressable, View } from 'react-native'

interface HeaderProps {
  children?: ReactNode
  backButton?: boolean
}

export function Header({ children, backButton }: HeaderProps) {
  return (
    <View className="relative flex-row items-center justify-center h-12">
      {backButton && (
        <Pressable onPress={() => router.back()} className="absolute left-0">
          <ArrowLeft size={24} color={colors.gray[800]} className="" />
        </Pressable>
      )}
      <Image
        className="h-6 w-14"
        source={require('../assets/images/logo.png')}
        resizeMode="contain"
      />
      {children}
    </View>
  )
}
