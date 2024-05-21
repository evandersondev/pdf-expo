import { DocumentTile } from '@/components/document-tile'
import { Header } from '@/components/header'
import { Document } from '@/contexts/document-context'
import { useAuth } from '@/hooks/useAuth'
import { useDocument } from '@/hooks/useDocument'
import { api } from '@/lib/axios'
import { colors } from '@/styles/colors'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { VictoryArea, VictoryAxis, VictoryChart } from 'victory-native'

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
    documents,
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

  const areaData = documents.reduce(
    (acc, doc) => {
      const dateNow = new Date()
      const date = format(new Date(doc.createdAt!), 'yyyy-MM-dd')
      const existingData = acc.find(item => item.date === date)

      if (new Date(date).getMonth() + 1 === dateNow.getMonth() + 1) {
        if (existingData) {
          existingData.value += doc.size
        } else {
          acc.push({ date, value: doc.size })
        }
      }

      return acc
    },
    [] as { date: string; value: number }[],
  )

  return (
    <View className="min-h-screen px-6 bg-white pt-14">
      <Header />
      <Text className="text-2xl font-semibold">Dashboard</Text>
      <Text className="pb-2 font-medium">
        Valores do mês {format(new Date(), 'MMMM', { locale: ptBR })}
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 gap-8">
        <View className="mt-4">
          <VictoryChart padding={{ top: 30, bottom: 30, left: 0, right: 0 }}>
            <VictoryArea
              interpolation="cardinal"
              style={{ data: { fill: colors.primary } }}
              data={areaData}
              x="day"
              y="value"
              labels={() => null}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={() => ''}
              style={{ axis: { stroke: 'transparent' } }}
            />
          </VictoryChart>
        </View>

        <View className="flex-row items-center justify-between w-full gap-4 px-6 py-6 bg-white border rounded-t-md border-zinc-200">
          <View className="items-center justify-center mx-auto">
            <Text className="text-xs">Espaço livre</Text>
            <Text className="font-semibold">
              {maxSpaceFreePerUser - totalSpaceUsage}MB de 2GB
            </Text>
          </View>
        </View>

        <View className="flex-row justify-around w-full">
          <View className="items-center justify-center w-3/6 px-6 py-6 bg-white border rounded-bl-md border-zinc-200">
            <Text className="text-xs text-zinc-500">Total de arquivos</Text>
            <Text className="font-bold text-zinc-950">
              {totalDocuments} arquivos
            </Text>
          </View>
          <View className="items-center justify-center w-3/6 px-6 py-6 bg-white border rounded-bl-md border-zinc-200">
            <Text className="text-xs text-zinc-500">Total de usuários</Text>
            <Text className="font-bold text-zinc-950">
              {company?.employees} usuários
            </Text>
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
