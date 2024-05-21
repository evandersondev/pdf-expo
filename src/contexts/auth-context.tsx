import { api } from '@/lib/axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { createContext, ReactNode, useEffect, useState } from 'react'
import Storage from 'react-native-storage'

const storage = new Storage({
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24 * 5, // 5 days
})

import { z } from 'zod'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type Credentials = z.infer<typeof credentialsSchema>

export interface IUser {
  id: string
  name: string
  email: string
  password: string
  urlImage: string
  phone: string
  address: string
  office: string
  companyId: string
}

export interface ICrendentials {
  email: string
  password: string
}

interface AuthContextType {
  user: IUser | null
  createSession: (credentials: Credentials) => Promise<void>
  updatePassword: (credentials: Credentials) => Promise<void>
  logout: () => Promise<void>
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUser | null>(null)

  async function createSession({ email, password }: Credentials) {
    const response = await api.get<IUser[]>(
      `/users?email=${email}&_password=${password}&_limit=1`,
    )

    if (response.data.length > 0) {
      setUser(response.data[0])
      storage.save({
        key: 'pdf@session',
        data: JSON.stringify(response.data[0]),
      })
    } else {
      throw Error('Usuário não registrado.')
    }
  }

  async function logout() {
    storage.remove({ key: 'pdf@session' })
    setUser(null)
  }

  async function updatePassword({ email, password }: Credentials) {
    const response = await api.get<IUser[]>(`/users?email=${email}`)

    if (response.data.length > 0) {
      await api.patch(`/users/${response.data[0].id}`, {
        password,
      })
    } else {
      throw Error('Usuário não registrado.')
    }
  }

  useEffect(() => {
    if (user) {
      router.replace('/home')
    } else {
      router.replace('(auth)')
    }
  }, [user, setUser])

  useEffect(() => {
    storage
      .load({ key: 'pdf@session' })
      .then(response => {
        setUser(JSON.parse(response))
        return
      })
      .catch(err => {})
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        createSession,
        updatePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
