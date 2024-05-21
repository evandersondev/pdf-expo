import { Header } from '@/components/header'
import { ListTile } from '@/components/list-tile'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/axios'
import {
  Building2,
  Contact,
  LogOut,
  MapPin,
  Phone,
  Users,
} from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'

interface ICompany {
  id: string
  name: string
  email: string
  phone: string
  address: string
  employees: number
}

export default function Home() {
  const { user, logout } = useAuth()
  const [company, setCompany] = useState<ICompany>()

  useEffect(() => {
    findCompanyById()
  }, [])

  async function findCompanyById() {
    const response = await api.get(`/companies?id=${user?.companyId!}`)

    setCompany(response.data[0])
  }

  return (
    <View className="min-h-screen px-6 bg-white pt-14">
      <Header />
      <Text className="text-2xl font-semibold">Perfil</Text>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 gap-8">
        <View className="gap-6 pb-8 mt-8">
          <View className="items-center justify-center mx-auto border-4 rounded-full w-44 h-44 border-primary">
            <Image
              className="w-40 h-40 m-2 rounded-full"
              resizeMode="contain"
              source={{ uri: user?.urlImage }}
            />
          </View>

          <View className="items-center">
            <Text className="text-xl font-bold">{user?.name}</Text>
            <Text className="text-zinc-500">{user?.email}</Text>
          </View>

          <View className="h-0.5 bg-zinc-950/5 mt-4" />

          <ListTile
            title="Cargo"
            subtitle={user?.office ?? ''}
            leading={Contact}
          />
          <ListTile
            title="Telefone/Celular"
            subtitle={user?.phone ?? ''}
            leading={Phone}
          />
          <ListTile
            title="Endereço"
            subtitle={user?.address ?? ''}
            leading={MapPin}
          />
          <ListTile
            title="Empresa"
            subtitle={company?.name ?? ''}
            leading={Building2}
          />
          <ListTile
            title="Usuários"
            subtitle={`${company?.employees}` ?? ''}
            leading={Users}
          />
          <ListTile
            title="Log out"
            subtitle="Sair da conta"
            leading={LogOut}
            onPress={logout}
          />
        </View>
      </ScrollView>
    </View>
  )
}
