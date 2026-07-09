// Add Transaction Hook
// Form state, validation, save/edit/delete logic
// All business logic here — zero in JSX

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useAppContext } from '@store/AppContext'
import {
  addTransaction,
  editTransaction,
  deleteTransaction,
} from '@services/transactionService'
import type { Owner, TransactionType } from '@/types/entities'

export interface FormState {
  walletId: string
  owner: Owner
  categoryId: string
  type: TransactionType
  amount: string
  date: string
  note: string
}

function localDatetimeString(date?: Date): string {
  const d = date || new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day}T${h}:${min}`
}

function localDatetimeFromISO(iso: Date): string {
  // Convert a Date object to local datetime-local string (no timezone shift)
  const y = iso.getFullYear()
  const m = String(iso.getMonth() + 1).padStart(2, '0')
  const d = String(iso.getDate()).padStart(2, '0')
  const h = String(iso.getHours()).padStart(2, '0')
  const min = String(iso.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d}T${h}:${min}`
}

export function useAddTransaction() {
  const { state, dispatch } = useAppContext()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const editId = searchParams.get('edit')

  /** Navigate back if there's history, otherwise go to Home */
  const goBack = useCallback(() => {
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate('/')
    }
  }, [navigate, location.key])

  const [form, setForm] = useState<FormState>({
    walletId: '',
    owner: 'Me',
    categoryId: '',
    type: 'Expense',
    amount: '',
    date: localDatetimeString(),
    note: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const isEdit = !!editId
  const editingTransaction = useMemo(() => {
    if (!editId) return null
    return state.transactions.find((t) => t.id === editId) || null
  }, [editId, state.transactions])

  // Live clock: refresh datetime every 60 seconds when NOT editing
  useEffect(() => {
    if (isEdit) return
    const interval = setInterval(() => {
      setForm((prev) => {
        // Only auto-update if user hasn't touched the date field
        const untouched = prev.date === localDatetimeString(new Date(Date.now() - 60000))
        if (untouched) {
          return { ...prev, date: localDatetimeString() }
        }
        return prev
      })
    }, 60000)
    return () => clearInterval(interval)
  }, [isEdit])

  // Last-used defaults (from most recent transaction)
  const defaults = useMemo(() => {
    const recent = [...state.transactions]
      .filter((t) => !t.deleted)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    return {
      walletId: recent?.walletId || state.wallets.find((w) => w.active)?.id || '',
      owner: recent?.owner || ('Me' as Owner),
      categoryId: recent?.categoryId || state.categories[0]?.id || '',
    }
  }, [state.transactions, state.wallets, state.categories])

  // Load editing transaction into form, or apply defaults
  useEffect(() => {
    if (loaded) return
    if (isEdit && editingTransaction) {
      setForm({
        walletId: editingTransaction.walletId,
        owner: editingTransaction.owner,
        categoryId: editingTransaction.categoryId,
        type: editingTransaction.type,
        amount: String(editingTransaction.amount),
        date: localDatetimeFromISO(new Date(editingTransaction.date)),
        note: editingTransaction.note || '',
      })
      setLoaded(true)
    } else if (!isEdit && !loaded) {
      setForm((prev) => ({
        ...prev,
        walletId: prev.walletId || defaults.walletId,
        owner: prev.owner || defaults.owner,
        categoryId: prev.categoryId || defaults.categoryId,
        date: localDatetimeString(),
      }))
      setLoaded(true)
    }
  }, [isEdit, editingTransaction, defaults, loaded])

  // Wallet & category options
  const walletOptions = useMemo(
    () =>
      state.wallets
        .filter((w) => w.active)
        .map((w) => ({ value: w.id, label: w.name })),
    [state.wallets],
  )

  const categoryOptions = useMemo(
    () =>
      state.categories.map((c) => ({ value: c.id, label: c.name })),
    [state.categories],
  )

  const ownerOptions: { value: Owner; label: string }[] = [
    { value: 'Me', label: 'Saya' },
    { value: 'Girlfriend', label: 'Pacar' },
  ]

  const typeOptions: { value: TransactionType; label: string }[] = [
    { value: 'Expense', label: 'Pengeluaran' },
    { value: 'Income', label: 'Pemasukan' },
  ]

  const updateField = useCallback(<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }, [])

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {}
    if (!form.walletId) newErrors.walletId = 'Pilih dompet'
    if (!form.owner) newErrors.owner = 'Pilih pemilik'
    if (!form.categoryId) newErrors.categoryId = 'Pilih kategori'
    if (!form.amount || Number(form.amount) <= 0) newErrors.amount = 'Masukkan jumlah'
    if (!form.date) newErrors.date = 'Pilih tanggal'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [form])

  const handleSave = useCallback(async () => {
    if (!validate()) return

    setSaving(true)
    try {
      const payload = {
        walletId: form.walletId,
        owner: form.owner,
        categoryId: form.categoryId,
        type: form.type,
        amount: Number(form.amount),
        date: new Date(form.date),
        note: form.note || undefined,
      }

      if (isEdit && editingTransaction) {
        const updated = await editTransaction(editingTransaction.id, payload)
        dispatch({ type: 'EDIT_TRANSACTION', payload: updated })
      } else {
        const saved = await addTransaction(payload)
        dispatch({ type: 'ADD_TRANSACTION', payload: saved })
      }

      goBack()
    } catch (err) {
      console.error('[AddTransaction] Save failed:', err)
    } finally {
      setSaving(false)
    }
  }, [form, validate, isEdit, editingTransaction, dispatch, goBack])

  const handleDelete = useCallback(async () => {
    if (!editingTransaction) return
    setShowDeleteConfirm(false)
    setSaving(true)
    try {
      await deleteTransaction(editingTransaction.id)
      dispatch({ type: 'DELETE_TRANSACTION', payload: editingTransaction.id })
      goBack()
    } catch (err) {
      console.error('[AddTransaction] Delete failed:', err)
    } finally {
      setSaving(false)
    }
  }, [editingTransaction, dispatch, goBack])

  const handleCancel = useCallback(() => {
    goBack()
  }, [goBack])

  return {
    // State
    form,
    errors,
    saving,
    isEdit,
    editingTransaction,
    isReady: !state.loading && loaded,
    error: state.error,
    showDeleteConfirm,
    setShowDeleteConfirm,

    // Options
    walletOptions,
    categoryOptions,
    ownerOptions,
    typeOptions,

    // Actions
    updateField,
    handleSave,
    handleDelete,
    handleCancel,
  }
}
