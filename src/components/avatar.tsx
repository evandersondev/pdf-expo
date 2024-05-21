import { colors } from '@/styles/colors'
import { Image, ImageProps } from 'react-native'

interface AvatarProps extends ImageProps {
  selected: boolean
}

export function Avatar({ selected, ...rest }: AvatarProps) {
  return (
    <Image
      data-active={selected}
      className="rounded-full w-9 h-9"
      style={{
        borderColor: selected ? colors.primary : 'transparent',
        borderWidth: selected ? 3 : 0,
      }}
      {...rest}
    />
  )
}
