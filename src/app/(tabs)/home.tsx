import { DocumentTile } from '@/components/document-tile'
import { Header } from '@/components/header'
import { Document } from '@/contexts/document-context'
import { useAuth } from '@/hooks/useAuth'
import { useDocument } from '@/hooks/useDocument'
import { api } from '@/lib/axios'
import { colors } from '@/styles/colors'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { Dimensions, FlatList, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { VictoryPie } from 'victory-native'

interface ICompany {
  id: string
  name: string
  email: string
  phone: string
  address: string
  employees: number
}

export default function Home() {
  const {
    totalDocuments,
    totalSpaceUsage,
    maxSpaceFreePerUser,
    findDocumentLastFiveByUserId,
    findDocumentByUserId,
  } = useDocument()
  const { user } = useAuth()
  const [lastDocuments, setLastDocuments] = useState<Document[]>([])
  const [company, setCompany] = useState<ICompany>()
  const [data, setData] = useState([
    { x: 'free', y: 0 },
    { x: 'usage', y: 0 },
  ])

  useFocusEffect(
    useCallback(() => {
      loadDashboard()
    }, [totalSpaceUsage]),
  )

  async function loadDashboard() {
    await findCompanyById()
    await findDocumentByUserId(user?.id!)
    setData([
      { ...data[0], y: maxSpaceFreePerUser - totalSpaceUsage },
      {
        ...data[1],
        y: totalSpaceUsage,
      },
    ])

    const lastFiveDocuments = await findDocumentLastFiveByUserId(user?.id!)
    setLastDocuments(lastFiveDocuments)
  }

  async function findCompanyById() {
    const response = await api.get(`/companies?id=${user?.companyId!}`)

    setCompany(response.data[0])
  }

  return (
    <View className="min-h-screen px-6 bg-white pt-14">
      <Header />
      <Text className="text-2xl font-semibold">Dashboard</Text>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 gap-8">
        <View className="items-center justify-center w-full h-20 mr-2 mb-36 mt-36">
          <VictoryPie
            animate
            height={Dimensions.get('window').width - 50}
            width={Dimensions.get('window').width - 50}
            labelIndicator={false}
            innerRadius={Dimensions.get('window').width / 6}
            colorScale={[colors.gray[200], colors.primary]}
            labels={() => null}
            data={data}
          />
          <View className="absolute items-center">
            <Text className="text-xs">Espaço livre</Text>
            <Text className="text-sm font-semibold">
              {maxSpaceFreePerUser - totalSpaceUsage}MB
            </Text>
          </View>
        </View>

        <View className="mx-auto mb-8">
          <Text className="text-sm text-center text-zinc-500">
            Armazenamento
          </Text>
          <Text className="text-xl font-bold text-center text-zinc-950">
            {totalSpaceUsage}MB de 2GB
          </Text>
        </View>

        <View className="flex-row justify-around w-full">
          <View className="flex-row items-center justify-between w-3/6 gap-4 px-6 py-6 bg-white border rounded-s-lg border-zinc-200">
            <View>
              <Text className="text-xs text-zinc-500">Total de arquivos</Text>
              <Text className="font-bold text-zinc-950">
                {totalDocuments} arquivos
              </Text>
            </View>
          </View>
          <View className="flex-row items-center justify-between w-3/6 gap-4 px-6 py-6 bg-white border rounded-r-lg border-zinc-200">
            <View>
              <Text className="text-xs text-zinc-500">Total de usuários</Text>
              <Text className="font-bold text-zinc-950">
                {company?.employees} usuários
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-8 pb-36">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="font-semibold">Documentos recentes</Text>
          </View>

          <FlatList
            data={lastDocuments}
            keyExtractor={item => item.id!}
            renderItem={({ item }) => <DocumentTile document={item} />}
            ItemSeparatorComponent={() => (
              <View className="w-full h-0.5 bg-zinc-100 my-6" />
            )}
            ListEmptyComponent={() => (
              <View className="items-center justify-center gap-4 mt-16">
                <Text className="font-semibold text-zinc-500">
                  Nenhum documento
                </Text>
              </View>
            )}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  )
}
