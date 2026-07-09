// Add Transaction Screen
// Full-screen form for creating/editing transactions
// Reference: docs/01-product/02_USER_FLOW.md (UF-002)
// Reference: docs/01-product/01_INFORMATION_ARCHITECTURE.md (Fields section)

import React from 'react'
import FormField from '@/shared/components/composite/FormField/FormField'
import Select from '@/shared/components/primitive/Select/Select'
import Input from '@/shared/components/primitive/Input/Input'
import Button from '@/shared/components/primitive/Button/Button'
import EmptyState from '@/shared/components/composite/EmptyState/EmptyState'
import ConfirmDialog from '@/shared/components/composite/ConfirmDialog/ConfirmDialog'
import Skeleton from '@/shared/components/primitive/Skeleton/Skeleton'
import type { Owner } from '@/types/entities'
import { useAddTransaction } from './useAddTransaction'
import styles from './AddTransaction.module.css'

const AddTransaction: React.FC = () => {
  const {
    form,
    errors,
    saving,
    isEdit,
    isReady,
    error,
    walletOptions,
    categoryOptions,
    ownerOptions,
    typeOptions,
    updateField,
    handleSave,
    handleDelete,
    handleCancel,
    showDeleteConfirm,
    setShowDeleteConfirm,
  } = useAddTransaction()

  // ── Loading ─────────────────────────────────────────────────────
  if (!isReady) {
    return (
      <div className={styles.screen}>
        {error ? (
          <EmptyState
            icon="⚠️"
            title="Terjadi Kesalahan"
            message={error}
            actionLabel="Coba Lagi"
            onAction={() => window.location.reload()}
          />
        ) : (
          <div className={styles.form}>
            <Skeleton variant="rect" height="44px" />
            <Skeleton variant="rect" height="44px" />
            <Skeleton variant="rect" height="44px" />
            <Skeleton variant="rect" height="44px" />
            <Skeleton variant="rect" height="44px" />
            <Skeleton variant="rect" height="44px" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <button
          className={styles.cancelBtn}
          onClick={handleCancel}
          type="button"
          aria-label="Cancel"
        >
          Batal
        </button>
        <h1 className={styles.title}>
          {isEdit ? 'Edit Transaksi' : 'Tambah Transaksi'}
        </h1>
        <div className={styles.headerRight} />
      </div>

      <div className={styles.form}>
        {/* ── Type (Income / Expense) ───────────────────────────── */}
        <div className={styles.typeToggle} role="radiogroup" aria-label="Jenis transaksi">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              className={`${styles.typeBtn} ${form.type === opt.value ? styles.typeActive : ''}`}
              onClick={() => updateField('type', opt.value)}
              role="radio"
              aria-checked={form.type === opt.value}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* ── Amount ────────────────────────────────────────────── */}
        <FormField label="Jumlah" error={errors.amount} required id="amount">
          <Input
            type="number"
            placeholder="0"
            value={form.amount}
            onChange={(e) => updateField('amount', e.target.value)}
            min={0}
            step={100}
          />
        </FormField>

        {/* ── Wallet ────────────────────────────────────────────── */}
        <FormField label="Dompet" error={errors.walletId} required id="walletId">
          <Select
            options={walletOptions}
            value={form.walletId}
            onChange={(e) => updateField('walletId', e.target.value)}
            placeholder="Pilih dompet"
          />
        </FormField>

        {/* ── Owner ─────────────────────────────────────────────── */}
        <FormField label="Pemilik" error={errors.owner} required id="owner">
          <Select
            options={ownerOptions}
            value={form.owner}
            onChange={(e) => updateField('owner', e.target.value as Owner)}
          />
        </FormField>

        {/* ── Category ──────────────────────────────────────────── */}
        <FormField label="Kategori" error={errors.categoryId} required id="categoryId">
          <Select
            options={categoryOptions}
            value={form.categoryId}
            onChange={(e) => updateField('categoryId', e.target.value)}
            placeholder="Pilih kategori"
          />
        </FormField>

        {/* ── Date & Time ───────────────────────────────────────── */}
        <FormField label="Tanggal & Waktu" error={errors.date} required id="date">
          <Input
            type="datetime-local"
            value={form.date}
            onChange={(e) => updateField('date', e.target.value)}
          />
        </FormField>

        {/* ── Note ──────────────────────────────────────────────── */}
        <FormField label="Catatan" id="note">
          <Input
            type="text"
            placeholder="Opsional"
            value={form.note}
            onChange={(e) => updateField('note', e.target.value)}
          />
        </FormField>
      </div>

      {/* ── Actions ─────────────────────────────────────────────── */}
      <div className={styles.actions}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSave}
          loading={saving}
        >
          {isEdit ? 'Simpan Perubahan' : 'Simpan'}
        </Button>

        {isEdit && (
          <Button
            variant="destructive"
            size="md"
            fullWidth
            onClick={() => setShowDeleteConfirm(true)}
            disabled={saving}
          >
            Hapus Transaksi
          </Button>
        )}
      </div>

      {/* ── Delete confirmation ────────────────────────────────── */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Hapus Transaksi"
        message="Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="destructive"
        loading={saving}
      />
    </div>
  )
}

export default AddTransaction
