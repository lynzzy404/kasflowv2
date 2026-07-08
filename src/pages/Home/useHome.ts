// Home Screen hook
// Derives all display data from raw AppState
// No formatting here — pure number calculations

import { useMemo } from 'react'
import { useAppContext } from '@store/AppContext'
import type { Transaction, Owner, OwnerBalance } from '@/types/entities'

function calcOwnerBalance(transactions: Transaction[], owner: Owner): number {
  return transactions
    .filter((t) => !t.deleted && t.owner === owner)
    .reduce((sum, t) => sum + (t.type === 'Income' ? t.amount : -t.amount), 0)
}

function calcWalletOwnerBalances(
  transactions: Transaction[],
  walletId: string,
): OwnerBalance[] {
  const owners: Owner[] = ['Me', 'Girlfriend']
  return owners
    .map((owner) => ({
      owner,
      walletId,
      balance: transactions
        .filter((t) => !t.deleted && t.walletId === walletId && t.owner === owner)
        .reduce((sum, t) => sum + (t.type === 'Income' ? t.amount : -t.amount), 0),
    }))
    .filter((ob) => ob.balance !== 0)
}

function calcWalletTotalBalance(transactions: Transaction[], walletId: string): number {
  const ob = calcWalletOwnerBalances(transactions, walletId)
  return ob.reduce((sum, entry) => sum + entry.balance, 0)
}

export function useHome() {
  const { state } = useAppContext()

  const activeWallets = useMemo(
    () => state.wallets.filter((w) => w.active),
    [state.wallets],
  )

  const myBalance = useMemo(
    () => calcOwnerBalance(state.transactions, 'Me'),
    [state.transactions],
  )

  const girlfriendBalance = useMemo(
    () => calcOwnerBalance(state.transactions, 'Girlfriend'),
    [state.transactions],
  )

  const totalBalance = useMemo(
    () => myBalance + girlfriendBalance,
    [myBalance, girlfriendBalance],
  )

  const walletsWithBalance = useMemo(
    () =>
      activeWallets.map((w) => ({
        ...w,
        totalBalance: calcWalletTotalBalance(state.transactions, w.id),
        ownerBalances: calcWalletOwnerBalances(state.transactions, w.id),
      })),
    [activeWallets, state.transactions],
  )

  const recentTransactions = useMemo(
    () =>
      [...state.transactions]
        .filter((t) => !t.deleted)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [state.transactions],
  )

  const categoryMap = useMemo(
    () => new Map(state.categories.map((c) => [c.id, c.name])),
    [state.categories],
  )

  const walletNameMap = useMemo(
    () => new Map(state.wallets.map((w) => [w.id, w.name])),
    [state.wallets],
  )

  // Wallet type heuristic: shared if it has a wallet ID containing "seabank"
  // or more than one owner with non-zero balance
  const getWalletType = (walletId: string): 'shared' | 'personal' => {
    const owners = calcWalletOwnerBalances(state.transactions, walletId)
    const nonZeroOwners = owners.filter((ob) => ob.balance !== 0).length
    return nonZeroOwners > 1 ? 'shared' : 'personal'
  }

  const isGirlfriendNegative = girlfriendBalance < 0

  return {
    loading: state.loading,
    error: state.error,
    myBalance,
    girlfriendBalance,
    totalBalance,
    walletsWithBalance,
    recentTransactions,
    isGirlfriendNegative,
    getWalletType,
    activeWalletCount: activeWallets.length,
    categoryMap,
    walletNameMap,
  }
}
