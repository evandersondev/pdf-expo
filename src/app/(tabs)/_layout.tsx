import { Avatar } from '@/components/avatar'
import { FloatingActionButton } from '@/components/floating-action-button'
import { useAuth } from '@/hooks/useAuth'
import { colors } from '@/styles/colors'
import { Tabs } from 'expo-router'
import { File, Home } from 'lucide-react-native'

export default function TabRoutesLayout() {
  const { user } = useAuth()

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.gray[400],
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ size, color, focused }) => (
              <Home strokeWidth={focused ? 2.5 : 2} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="docs"
          options={{
            tabBarIcon: ({ size, color, focused }) => (
              <File strokeWidth={focused ? 2.5 : 2} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color }) => {
              return (
                <Avatar
                  selected={color === colors.primary}
                  source={{ uri: user?.urlImage }}
                />
              )
            },
          }}
        />
      </Tabs>

      <FloatingActionButton />
    </>
  )
}
