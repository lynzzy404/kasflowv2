// Main Layout Foundation
// Provides: safe area, navigation slots, FAB slot, toast portal, modal root
// Do NOT add page-specific code here.

import { Outlet } from 'react-router-dom'
import BottomNav from '@components/BottomNav'
import FAB from '@components/FAB'
import ToastContainer from '@shared/components/ToastContainer'
import styles from './MainLayout.module.css'

const MainLayout: React.FC = () => {
  return (
    <div className={styles.layout}>
      {/* Main content area - pages render here */}
      <main className={styles.main} id="main-content" role="main">
        <Outlet />
      </main>

      {/* Floating action button */}
      <FAB />

      {/* Bottom navigation */}
      <BottomNav />

      {/* Toast notifications portal */}
      <ToastContainer />

      {/* Modal portal root (future use) */}
      <div id="modal-root" />
    </div>
  )
}

export default MainLayout
