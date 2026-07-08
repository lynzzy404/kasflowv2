// Application Root
// Provides: theme provider, error boundary, router, suspense
// Do NOT add page content here.

import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from '@store/AppContext'
import { ThemeProvider } from '@styles/ThemeContext'
import MainLayout from '@components/layout/MainLayout'
import ErrorBoundary from '@components/layout/ErrorBoundary'
import NotFound from '@components/NotFound'

// Lazy-loaded pages (reduces initial bundle size)
const Home = lazy(() => import('@/pages/Home/Home'))
const History = lazy(() => import('@/pages/History/History'))
const AddTransaction = lazy(() => import('@/pages/AddTransaction/AddTransaction'))
const Settings = lazy(() => import('@/pages/Settings/Settings'))

// Suspense fallback (minimal, per Speed First principle)
const PageLoading: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      color: 'var(--color-text-tertiary)',
      fontSize: 'var(--font-size-sm)',
    }}
  >
    Loading...
  </div>
)

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <ErrorBoundary>
          <Router>
            <Suspense fallback={<PageLoading />}>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/add" element={<AddTransaction />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </ErrorBoundary>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App
