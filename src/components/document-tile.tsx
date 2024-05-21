import { Document } from '@/contexts/document-context'
import { colors } from '@/styles/colors'
import { format } from 'date-fns'
import { router } from 'expo-router'
import { File } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

interface DocumentTileProps {
  document: Document
}

export function DocumentTile({ document }: DocumentTileProps) {
  return (
    <Pressable
      onPress={() => router.push(`/document/${document.id}`)}
      className="flex-row items-center gap-6"
    >
      <File size={24} color={colors.gray[800]} />
      <View className="flex-1 gap-1">
        <Text className="font-semibold">
          {document.name}.{document.type}
        </Text>
        <Text className="text-xs text-zinc-500">
          {format(new Date(document.createdAt!), 'dd/MM/yyyy')}
        </Text>
      </View>
      <View className="">
        <Text className="font-semibold">
          {Number(document.size / 1024).toFixed(2)} GB
        </Text>
      </View>
    </Pressable>
  )
}
