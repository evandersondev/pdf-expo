import { Button } from '@/components/button'
import { Header } from '@/components/header'
import { Icon } from '@/components/icon'
import { Input } from '@/components/input'
import { InputArea } from '@/components/input-area'
import { Document as IDocument } from '@/contexts/document-context'
import { useAuth } from '@/hooks/useAuth'
import { useDocument } from '@/hooks/useDocument'
import { format } from 'date-fns'
import { router, useLocalSearchParams } from 'expo-router'
import {
  BookOpen,
  Calculator,
  Calendar,
  File,
  Trash,
  User,
} from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, Text, View } from 'react-native'

export default function Document() {
  const { user } = useAuth()
  const {
    createNewDocument,
    findDocumentById,
    removeDocumentById,
    updateDocumentById,
  } = useDocument()
  const { id } = useLocalSearchParams()
  const [document, setDocument] = useState<IDocument>()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [author, setAuthor] = useState('')
  const [pages, setPages] = useState('')
  const [size, setSize] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreateDocumentSubmit() {
    setLoading(true)

    if (
      name.trim() === '' ||
      description.trim() === '' ||
      author.trim() === ''
    ) {
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

    if (Number(pages) < 1 || Number(size) < 1) {
      Alert.alert(
        'Erro!',
        'Os campos de página e tamanha(MB) não podem ser menor que 1.',
        [
          {
            text: 'OK',
            onPress: () => {
              setLoading(false)
            },
          },
        ],
      )
      return
    }

    try {
      await createNewDocument({
        name,
        description,
        author,
        pages: Number(pages),
        size: Number(size),
        userId: user?.id!,
      })

      Alert.alert('Sucesso!', 'Documento criado com sucesso.', [
        {
          text: 'OK',
          onPress: () => {
            setLoading(false)
            router.back()
          },
        },
      ])
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erro!', error.message, [
          {
            text: 'OK',
          },
        ])
      }
    }
  }

  async function handleUpdateDocumentSubmit() {
    setLoading(true)

    if (
      name.trim() === '' ||
      description.trim() === '' ||
      author.trim() === ''
    ) {
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

    if (Number(pages) < 1 || Number(size) < 1) {
      Alert.alert(
        'Erro!',
        'Os campos de página e tamanha(MB) não podem ser menor que 1.',
        [
          {
            text: 'OK',
            onPress: () => {
              setLoading(false)
            },
          },
        ],
      )
      return
    }

    try {
      await updateDocumentById({
        name,
        author,
        description,
        userId: user?.id!,
        id: document?.id!,
        size: Number(size),
        pages: Number(pages),
        createdAt: document?.createdAt!,
        updatedAt: Date(),
        type: document?.type!,
      })

      Alert.alert('Sucesso!', 'Documento atualizado com sucesso.', [
        {
          text: 'OK',
          onPress: () => {
            setLoading(false)
            router.back()
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

  useEffect(() => {
    loadDocument()
  }, [])

  async function loadDocument() {
    if (id != 'null') {
      const response = await findDocumentById(String(id))
      setDocument(response)

      setName(response?.name ?? '')
      setDescription(response?.description ?? '')
      setAuthor(response?.author ?? '')
      setPages(String(response?.pages) ?? '')
      setSize(String(response?.size) ?? '')
    }
  }

  function handleDeleteDocument() {
    Alert.alert('Deletar', 'Tem certeza que deseja deletar?', [
      { text: 'Cancelar' },
      {
        text: 'OK',
        onPress: async () => {
          await removeDocumentById(document?.id!)
          router.back()
        },
      },
    ])
  }

  return (
    <ScrollView automaticallyAdjustKeyboardInsets>
      <View className="min-h-screen p-6 bg-white pt-14">
        <Header backButton />

        <Text className="mt-4 text-2xl font-semibold">
          {id !== 'null' ? 'Atualizar' : 'Novo documento'}
        </Text>

        <View className="items-center gap-6 mt-4">
          <View className="w-full gap-1.5">
            <Text className="font-semibold">Nome</Text>
            <Input.Root>
              <Icon icon={File} />
              <Input.Field
                value={name}
                onChangeText={setName}
                placeholder="Nome"
              />
            </Input.Root>
          </View>

          <View className="w-full gap-1.5">
            <Text className="font-semibold">Descrição</Text>
            <InputArea.Root>
              <InputArea.Field
                value={description}
                onChangeText={setDescription}
                placeholder="Descrição"
              />
            </InputArea.Root>
          </View>

          <View className="w-full gap-1.5">
            <Text className="font-semibold">Autor</Text>
            <Input.Root>
              <Icon icon={User} />
              <Input.Field
                value={author}
                onChangeText={setAuthor}
                placeholder="Autor"
              />
            </Input.Root>
          </View>

          {document !== undefined && document?.updatedAt !== null && (
            <View className="w-full gap-1.5">
              <Text className="font-semibold">Atualizado em</Text>
              <View className="opacity-50">
                <Input.Root>
                  <Icon icon={Calendar} />
                  <Input.Field
                    value={format(document?.updatedAt!, 'dd/MM/yyyy - hh:mm')}
                    placeholder="Autor"
                    readOnly
                  />
                </Input.Root>
              </View>
            </View>
          )}

          <View className="flex-row flex-1 gap-6">
            <View className="flex-1 gap-1.5">
              <Text className="font-semibold">Total de páginas</Text>
              <Input.Root>
                <Icon icon={BookOpen} />
                <Input.Field
                  value={pages}
                  onChangeText={setPages}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </Input.Root>
            </View>

            <View className="flex-1 gap-1.5">
              <Text className="font-semibold">Tamanho (MB)</Text>
              <Input.Root>
                <Icon icon={Calculator} />
                <Input.Field
                  value={size}
                  onChangeText={setSize}
                  placeholder="0 (MB)"
                  keyboardType="numeric"
                />
              </Input.Root>
            </View>
          </View>

          <View className="flex-row gap-4">
            {id !== 'null' && (
              <Pressable
                onPress={handleDeleteDocument}
                className="items-center justify-center w-16 h-16 bg-red-500 rounded-md"
              >
                <Trash size={24} color="#FFFFFF" />
              </Pressable>
            )}
            <Button
              title={id !== 'null' ? 'Atualizar' : 'Adicionar'}
              variant="success"
              isLoading={loading}
              onPress={
                id !== 'null'
                  ? handleUpdateDocumentSubmit
                  : handleCreateDocumentSubmit
              }
            />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
