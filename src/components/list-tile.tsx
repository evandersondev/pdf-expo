import { colors } from '@/styles/colors'
import { LucideIcon } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

interface ListTileProps {
  title: string
  subtitle: string
  leading: LucideIcon
  onPress?: () => void
}

export function ListTile({
  title,
  subtitle,
  leading: Icon,
  onPress,
}: ListTileProps) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-6 mt-2">
      <Icon size={24} color={colors.gray[800]} />
      <View className="gap-1">
        <Text className="font-semibold">{title}</Text>
        <Text className="text-zinc-500">{subtitle}</Text>
      </View>
    </Pressable>
  )
}
