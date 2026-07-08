// Settings Screen - Wallet, Category, Backup/Restore management
// Reference: docs/01-product/02_USER_FLOW.md

import React from 'react'
import { useAppContext } from '@store/AppContext'

const Settings: React.FC = () => {
  const { state } = useAppContext()

  if (state.loading) {
    return <div style={{ padding: '16px' }}>Loading...</div>
  }

  return (
    <div style={{ padding: '16px' }}>
      <h1>Settings</h1>
      <p>Wallet Management, Category Management, Backup/Restore</p>
      {/* Components will be implemented in Phase 5 */}
    </div>
  )
}

export default Settings
