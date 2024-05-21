import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'

import { AuthProvider } from '@/contexts/auth-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { DocumentProvider } from '@/contexts/document-context'
import { colors } from '@/styles/colors'
import '@/styles/global.css'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  })

  useEffect(() => {
    if (fontLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontLoaded])

  return (
    <AuthProvider>
      <DocumentProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="document/[id]" />
          </Stack>
          <StatusBar backgroundColor={colors.white} style="dark" />
        </GestureHandlerRootView>
      </DocumentProvider>
    </AuthProvider>
  )
}
