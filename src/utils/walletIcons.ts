// Wallet Icon Utility
// Single source of truth for wallet → icon mapping
// Returns lucide-react icon component references (not JSX)

import { Landmark, Wallet, Smartphone, Building2, type LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  bca: Landmark,
  mandiri: Landmark,
  bri: Landmark,
  bni: Landmark,
  cimb: Landmark,
  permata: Landmark,
  ovo: Smartphone,
  gopay: Smartphone,
  dana: Smartphone,
  shopeepay: Smartphone,
  seabank: Building2,
  jago: Building2,
  blu: Building2,
  cash: Wallet,
}

/**
 * Get a Lucide icon component for a wallet name.
 * Matching is case-insensitive, ignores spaces.
 * Falls back to Wallet icon for unknown wallets.
 */
export function getWalletIcon(walletName: string): LucideIcon {
  const key = walletName.toLowerCase().replace(/\s+/g, '')
  for (const [prefix, icon] of Object.entries(ICON_MAP)) {
    if (key.includes(prefix)) return icon
  }
  return Wallet
}
