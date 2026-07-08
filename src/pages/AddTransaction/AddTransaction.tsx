// Add Transaction Screen - Create/Edit transactions
// Reference: docs/01-product/02_USER_FLOW.md

import React from 'react'
import { useAppContext } from '@store/AppContext'

const AddTransaction: React.FC = () => {
  const { state } = useAppContext()

  if (state.loading) {
    return <div style={{ padding: '16px' }}>Loading...</div>
  }

  return (
    <div style={{ padding: '16px' }}>
      <h1>Add Transaction</h1>
      <p>Form: Wallet, Owner, Category, Amount, Date, Time, Note, Save button</p>
      {/* Components will be implemented in Phase 5 */}
    </div>
  )
}

export default AddTransaction
