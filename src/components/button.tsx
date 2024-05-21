import { colors } from '@/styles/colors'
import { LoaderIcon } from 'lucide-react-native'
import {
  Animated,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'

interface ButtonProps extends TouchableOpacityProps {
  title: string
  variant?: 'primary' | 'danger' | 'success'
  isLoading?: boolean
}

export function Button({
  title,
  isLoading = false,
  variant = 'primary',
  ...rest
}: ButtonProps) {
  function getColor() {
    if (variant === 'danger') {
      return colors.danger
    } else if (variant === 'success') {
      return colors.success
    } else {
      return colors.primary
    }
  }

  return (
    <TouchableOpacity
      {...rest}
      activeOpacity={0.8}
      disabled={isLoading}
      className="items-center justify-center flex-1 h-16 rounded-md bg-primary"
      style={{
        backgroundColor: getColor(),
        opacity: isLoading ? 0.5 : 1,
      }}
    >
      {isLoading ? (
        <Animated.View className="animate-spin">
          <LoaderIcon color={colors.white} size={24} />
        </Animated.View>
      ) : (
        <Text className="text-lg font-bold text-white">{title}</Text>
      )}
    </TouchableOpacity>
  )
}
