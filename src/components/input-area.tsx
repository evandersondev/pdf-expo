import { ReactNode } from 'react'
import { TextInput, TextInputProps, View } from 'react-native'

interface InputProps {
  children: ReactNode
}

function Root({ children }: InputProps) {
  return (
    <View className="flex-row w-full gap-4 px-4 py-3 border rounded-md h-36 border-zinc-400">
      {children}
    </View>
  )
}

function Field({ ...rest }: TextInputProps) {
  return (
    <TextInput
      multiline={true}
      numberOfLines={4}
      className="flex-1 -mt-0.5 text-zinc-950"
      {...rest}
    />
  )
}

export const InputArea = { Root, Field }
