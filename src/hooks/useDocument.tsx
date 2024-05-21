import { DocumentContext } from '@/contexts/document-context'
import { useContext } from 'react'

export function useDocument() {
  const context = useContext(DocumentContext)

  return context
}
