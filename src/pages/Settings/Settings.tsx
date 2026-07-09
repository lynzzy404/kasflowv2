// Settings Screen
// Wallet management, Category management, Backup/Restore
// Reference: docs/01-product/01_INFORMATION_ARCHITECTURE.md

import React from 'react'
import ListItem from '@/shared/components/composite/ListItem/ListItem'
import SectionHeader from '@/shared/components/composite/SectionHeader/SectionHeader'
import Button from '@/shared/components/primitive/Button/Button'
import Modal from '@/shared/components/primitive/Modal/Modal'
import Input from '@/shared/components/primitive/Input/Input'
import Skeleton from '@/shared/components/primitive/Skeleton/Skeleton'
import EmptyState from '@/shared/components/composite/EmptyState/EmptyState'
import ConfirmDialog from '@/shared/components/composite/ConfirmDialog/ConfirmDialog'
import { useSettings } from './useSettings'
import styles from './Settings.module.css'

const Settings: React.FC = () => {
  const {
    loading,
    error,
    wallets,
    walletModal,
    openAddWallet,
    openEditWallet,
    closeWalletModal,
    saveWallet,
    deleteWalletById,
    setWalletName,
    categories,
    categoryModal,
    openAddCategory,
    closeCategoryModal,
    saveCategory,
    removeCategory,
    setCategoryName,
    backingUp,
    handleBackup,
    handleRestore,
    showResetConfirm,
    setShowResetConfirm,
    handleReset,
    resetting,
    themeMode,
    toggleTheme,
  } = useSettings()

  // ── Loading ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={styles.screen}>
        <Skeleton variant="rect" height="44px" />
        <Skeleton variant="rect" height="44px" />
        <Skeleton variant="rect" height="120px" />
        <Skeleton variant="rect" height="44px" />
      </div>
    )
  }

  // ── Error ───────────────────────────────────────────────────────
  if (error) {
    return (
      <div className={styles.screen}>
        <EmptyState
          icon="⚠️"
          title="Terjadi Kesalahan"
          message={error}
          actionLabel="Coba Lagi"
          onAction={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className={styles.screen}>
      {/* ── Wallet Management ──────────────────────────────────── */}
      <SectionHeader
        title="Dompet"
        actionLabel={wallets.length > 0 ? 'Tambah' : undefined}
        onAction={openAddWallet}
      />
      {wallets.length === 0 ? (
        <div className={styles.emptySection}>
          <Button variant="secondary" size="md" onClick={openAddWallet} fullWidth>
            Tambah Dompet
          </Button>
        </div>
      ) : (
        <div className={styles.list}>
          {wallets.map((w) => (
            <ListItem
              key={w.id}
              title={w.name}
              subtitle={w.active ? 'Aktif' : 'Nonaktif'}
              trailing={w.active ? '✓' : ''}
              onClick={() => openEditWallet(w.id, w.name)}
            />
          ))}
        </div>
      )}

      {/* ── Category Management ────────────────────────────────── */}
      <SectionHeader
        title="Kategori"
        actionLabel={categories.length > 0 ? 'Tambah' : undefined}
        onAction={openAddCategory}
      />
      {categories.length === 0 ? (
        <div className={styles.emptySection}>
          <Button variant="secondary" size="md" onClick={openAddCategory} fullWidth>
            Tambah Kategori
          </Button>
        </div>
      ) : (
        <div className={styles.list}>
          {categories.map((c) => (
            <ListItem
              key={c.id}
              title={c.name}
              onClick={() => removeCategory(c.id)}
            />
          ))}
        </div>
      )}

      {/* ── Backup / Restore ───────────────────────────────────── */}
      <SectionHeader title="Data" />
      <div className={styles.backupSection}>
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={handleBackup}
          loading={backingUp}
        >
          Backup Data
        </Button>
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={handleRestore}
        >
          Restore Data
        </Button>
        <p className={styles.backupNote}>
          Backup menyimpan seluruh data sebagai file JSON.
          Restore akan mengganti semua data yang ada.
        </p>
        <Button
          variant="destructive"
          size="md"
          fullWidth
          onClick={() => setShowResetConfirm(true)}
          disabled={resetting}
        >
          Reset Semua Data
        </Button>
      </div>

      {/* ── Reset confirmation ──────────────────────────────────── */}
      <ConfirmDialog
        open={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
        title="Reset Semua Data"
        message="Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Reset"
        cancelLabel="Batal"
        variant="destructive"
        loading={resetting}
      />

      {/* ── Theme ──────────────────────────────────────────────── */}
      <SectionHeader title="Tampilan" />
      <div className={styles.themeRow}>
        <span className={styles.themeLabel}>
          Tema {themeMode === 'light' ? 'Terang' : 'Gelap'}
        </span>
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          type="button"
          aria-label="Toggle theme"
        >
          {themeMode === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      {/* ── About ──────────────────────────────────────────────── */}
      <SectionHeader title="Tentang" />
      <div className={styles.about}>
        <span className={styles.aboutText}>
          Kasflow v2 — Personal Money Tracker
        </span>
        <span className={styles.aboutVersion}>
          Versi 2.0.0
        </span>
      </div>

      {/* ── Wallet Modal ───────────────────────────────────────── */}
      <Modal
        open={walletModal.open}
        onClose={closeWalletModal}
        title={walletModal.editId ? 'Edit Dompet' : 'Tambah Dompet'}
        size="sm"
      >
        <div className={styles.modalForm}>
          <Input
            type="text"
            placeholder="Nama dompet"
            value={walletModal.name}
            onChange={(e) => setWalletName(e.target.value)}
            autoFocus
          />
          <Button variant="primary" size="md" fullWidth onClick={saveWallet}>
            Simpan
          </Button>
          {walletModal.editId && (
            <Button
              variant="destructive"
              size="md"
              fullWidth
              onClick={() => {
                deleteWalletById(walletModal.editId!)
                closeWalletModal()
              }}
            >
              Hapus Dompet
            </Button>
          )}
        </div>
      </Modal>

      {/* ── Category Modal ─────────────────────────────────────── */}
      <Modal
        open={categoryModal.open}
        onClose={closeCategoryModal}
        title="Tambah Kategori"
        size="sm"
      >
        <div className={styles.modalForm}>
          <Input
            type="text"
            placeholder="Nama kategori"
            value={categoryModal.name}
            onChange={(e) => setCategoryName(e.target.value)}
            autoFocus
          />
          <Button variant="primary" size="md" fullWidth onClick={saveCategory}>
            Simpan
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Settings
