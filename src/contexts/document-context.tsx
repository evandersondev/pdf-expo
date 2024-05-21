import 'react-native-get-random-values'

import { api } from '@/lib/axios'
import { format } from 'date-fns'
import { createContext, ReactNode, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const MAX_DOCUMENT_PER_USER = 2048

const documentSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  author: z.string(),
  size: z.number(),
  pages: z.number(),
  userId: z.string().uuid(),
  type: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type Document = z.infer<typeof documentSchema>

interface DocumentContextType {
  documents: Document[]
  totalSpaceUsage: number
  totalDocuments: number
  maxSpaceFreePerUser: number
  findDocumentByUserId: (userId: string) => Promise<void>
  findDocumentById: (documentId: string) => Promise<Document>
  findDocumentLastFiveByUserId: (userId: string) => Promise<Document[]>
  removeDocumentById: (id: string) => Promise<void>
  createNewDocument: (document: Document) => Promise<void>
  updateDocumentById: (document: Document) => Promise<void>
}

interface DocumentProviderProps {
  children: ReactNode
}

export const DocumentContext = createContext({} as DocumentContextType)

export function DocumentProvider({ children }: DocumentProviderProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const totalSpaceUsage = documents.reduce((acc, curr) => acc + curr.size, 0)
  const totalDocuments = documents.length
  const maxSpaceFreePerUser = 2048

  async function findDocumentByUserId(userId: string) {
    const response = await api.get<Document[]>(
      `/documents?userId=${userId}&_sort=-createdAt,createdAt`,
    )

    setDocuments(response.data)
  }

  async function findDocumentLastFiveByUserId(userId: string) {
    const response = await api.get<Document[]>(
      `/documents?userId=${userId}&_limit=5&_sort=-createdAt,createdAt`,
    )

    return response.data
  }

  async function removeDocumentById(id: string) {
    await api.delete(`/documents/${id}`)

    const documentFilter = documents.filter(doc => doc.id !== id)
    setDocuments(documentFilter)
  }

  async function updateDocumentById(document: Document) {
    await api.put(`/documents/${document.id}`, document)

    const documentFilter = documents.map(doc => {
      if (doc.id === document.id) {
        return {
          ...document,
        }
      }

      return doc
    })

    setDocuments(documentFilter)
  }

  async function createNewDocument(document: Document) {
    const newDocument = {
      id: uuidv4(),
      name: `${document.name}`,
      description: document.description,
      author: document.author,
      pages: document.pages,
      size: document.size,
      userId: document.userId,
      createdAt: format(Date(), 'yyyy-MM-dd'),
      updatedAt: null,
      type: 'pdf',
    }

    if (MAX_DOCUMENT_PER_USER - (totalSpaceUsage + document.size) < 0) {
      throw Error(
        `Limite indisponível, você tem: ${MAX_DOCUMENT_PER_USER - totalSpaceUsage}MB disponível.`,
      )
    } else {
      await api.post(`/documents`, newDocument)
      setDocuments([...documents, newDocument])
    }
  }

  async function findDocumentById(documentId: string) {
    const response = await api.get<Document>(`/documents/${documentId}`)

    return response.data
  }

  return (
    <DocumentContext.Provider
      value={{
        documents,
        totalSpaceUsage,
        totalDocuments,
        maxSpaceFreePerUser,
        findDocumentByUserId,
        findDocumentById,
        findDocumentLastFiveByUserId,
        removeDocumentById,
        createNewDocument,
        updateDocumentById,
      }}
    >
      {children}
    </DocumentContext.Provider>
  )
}
