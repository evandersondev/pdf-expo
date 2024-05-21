import { DocumentTile } from '@/components/document-tile'
import { Header } from '@/components/header'
import { Icon } from '@/components/icon'
import { Input } from '@/components/input'
import { Document } from '@/contexts/document-context'
import { useAuth } from '@/hooks/useAuth'
import { useDocument } from '@/hooks/useDocument'
import { useFocusEffect } from 'expo-router'
import { Scroll, Search } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import { FlatList, ScrollView, Text, View } from 'react-native'

export default function Docs() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('')
  const [documentsToFilter, setDocumentsToFilter] = useState<Document[]>([])
  const { documents, findDocumentByUserId, totalDocuments } = useDocument()

  useFocusEffect(
    useCallback(() => {
      findDocumentByUserId(user?.id!)

      if (filter !== '') {
        const documentsFiltered = documents.filter(document =>
          document.name.toLowerCase().includes(filter.toLowerCase()),
        )
        setDocumentsToFilter(documentsFiltered)
      } else {
        setDocumentsToFilter(documents)
      }
    }, [filter, totalDocuments]),
  )

  return (
    <View className="flex-1 min-h-screen p-6 bg-white pt-14">
      <Header />
      <Text className="mb-2 text-2xl font-semibold">Documentos</Text>

      <View className="w-full gap-1.5 mb-4">
        <Input.Root>
          <Icon icon={Search} />
          <Input.Field
            value={filter}
            onChangeText={setFilter}
            placeholder="Filtrar por nome..."
          />
        </Input.Root>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 gap-8 pt-4"
      >
        <FlatList
          data={documentsToFilter}
          style={{ paddingBottom: 120 }}
          scrollEnabled={false}
          renderItem={({ item }) => <DocumentTile document={item} />}
          ItemSeparatorComponent={() => (
            <View className="w-full h-0.5 bg-zinc-100 my-6" />
          )}
          ListEmptyComponent={() => (
            <View className="items-center justify-center min-h-full gap-4 mt-16">
              <Scroll size={32} strokeWidth={1.5} color="#71717a" />
              <Text className="font-semibold text-zinc-500">
                Nenhum documento
              </Text>
            </View>
          )}
        />
      </ScrollView>
    </View>
  )
}
