// 404 Not Found page
// Minimal, per Speed First principle
// Shows when user navigates to an unknown route

import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: 'var(--font-size-4xl)',
          fontWeight: 'var(--font-weight-medium)',
          marginBottom: 'var(--spacing-4)',
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: 'var(--font-size-base)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--spacing-6)',
        }}
      >
        Halaman tidak ditemukan
      </p>
      <button
        onClick={() => navigate('/', { replace: true })}
        style={{
          padding: '12px 24px',
          fontSize: 'var(--font-size-base)',
          fontWeight: 'var(--font-weight-medium)',
          backgroundColor: 'var(--color-action-primary)',
          color: 'var(--color-text-inverse)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          minWidth: 'var(--touch-target)',
          minHeight: 'var(--touch-target)',
        }}
      >
        Kembali ke Home
      </button>
    </div>
  )
}

export default NotFound
