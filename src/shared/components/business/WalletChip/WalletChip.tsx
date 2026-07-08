// Business UI: WalletChip
// Displays wallet name with selected/unselected state

import React from 'react'
import Chip from '@/shared/components/primitive/Chip/Chip'
import type { ChipVariant } from '@/shared/components/primitive/Chip/Chip'

export interface WalletChipProps {
  name: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

const WalletChip: React.FC<WalletChipProps> = ({
  name,
  selected = false,
  onClick,
  className,
}) => {
  const variant: ChipVariant = selected ? 'active' : 'default'

  return (
    <Chip
      variant={variant}
      size="md"
      onClick={onClick}
      className={className}
    >
      {name}
    </Chip>
  )
}

export default WalletChip
