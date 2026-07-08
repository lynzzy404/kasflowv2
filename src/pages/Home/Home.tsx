// Home Screen - Dashboard
// Displays: Balance cards, Wallet list, Recent transactions, FAB
// Reference: docs/01-product/02_SCREEN_SPEC.md

import React from 'react'
import { useAppContext } from '@store/AppContext'

const Home: React.FC = () => {
  const { state } = useAppContext()

  if (state.loading) {
    return <div style={{ padding: '16px' }}>Loading...</div>
  }

  return (
    <div style={{ padding: '16px' }}>
      <h1>Home</h1>
      <p>Dashboard - Girlfriend Balance, My Balance, Total Balance, Wallets, Recent Transactions</p>
      {/* Components will be implemented in Phase 5 */}
    </div>
  )
}

export default Home
