import { colors } from '@/styles/colors'
import { router } from 'expo-router'
import { Plus } from 'lucide-react-native'
import { Pressable } from 'react-native'

export function FloatingActionButton() {
  return (
    <Pressable
      className="absolute items-center justify-center w-16 h-16 rounded-full shadow bottom-28 right-5 bg-primary"
      onPress={() => router.push('/document/null')}
    >
      <Plus size={24} color={colors.white} />
    </Pressable>
  )
}
