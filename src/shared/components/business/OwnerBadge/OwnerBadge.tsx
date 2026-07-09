// Business UI: OwnerBadge
// Displays an owner identifier (Me / Girlfriend)
// Future-proof for additional owners

import React from 'react'
import Badge from '@/shared/components/primitive/Badge/Badge'
import type { Owner } from '@/types/entities'

export interface OwnerBadgeProps {
  owner: Owner
  className?: string
}

const ownerVariant: Record<Owner, 'default' | 'info'> = {
  Me: 'default',
  Girlfriend: 'info',
}

const OwnerBadge: React.FC<OwnerBadgeProps> = ({ owner, className }) => {
  return (
    <Badge
      variant={ownerVariant[owner] ?? 'default'}
      className={className}
    >
      {owner}
    </Badge>
  )
}

export default OwnerBadge
