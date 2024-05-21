import { ReactNode } from 'react'
import { TextInput, TextInputProps, View } from 'react-native'

interface InputProps {
  children: ReactNode
}

function Root({ children }: InputProps) {
  return (
    <View className="flex-row items-center w-full h-16 gap-4 px-4 border rounded-md border-zinc-400">
      {children}
    </View>
  )
}

function Field({ ...rest }: TextInputProps) {
  return <TextInput className="flex-1 text-zinc-950" {...rest} />
}

export const Input = { Root, Field }
