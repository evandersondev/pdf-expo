import { colors } from '@/styles/colors'
import { LucideIcon } from 'lucide-react-native'

interface IconProps {
  icon: LucideIcon
  color?: string
}

export function Icon({ icon: Icon, color }: IconProps) {
  return <Icon size={24} color={color ? color : colors.gray[800]} />
}
