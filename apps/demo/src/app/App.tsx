import * as React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LocaleProvider } from './context/LocaleContext'
import { ProtectedRoute } from './layout/ProtectedRoute'
import { AppLayout } from './layout/AppLayout'
import { LoginPage } from './routes/login/LoginPage'
import { DashboardPage } from './routes/dashboard/DashboardPage'
import { DataTablePage } from './routes/data/DataTablePage'
import { SettingsPage } from './routes/settings/SettingsPage'
import ChatRoute from './demo/chat/route'
import CyberChatRoute from './demo/cyberchat/route'
import { CyberChatHostDemo } from './demo/cyberchat/CyberChatHostDemo'
import CyberChatFlowRoute from './demo/cyberchat-flow/route'
import CyberChatFlowAppRoute from './demo/cyberchat-flow/app/route'
import { ErrorBoundary } from './components/ErrorBoundary'

export function DemoApp() {
  return (
    <ErrorBoundary>
      <LocaleProvider>
        <AuthProvider>
        <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="cyberchat" element={<CyberChatRoute />} />
        <Route path="cyberchat-themed" element={<CyberChatHostDemo />} />
        <Route path="cyberchat-flow" element={<CyberChatFlowRoute />} />
        <Route path="cyberchat-flow/app" element={<CyberChatFlowAppRoute />} />
        <Route
          path="/"
          element={
            <ProtectedRoute redirectTo="/demo/login">
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="data" element={<DataTablePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="chat" element={<ChatRoute />} />
        </Route>
      </Routes>
      </AuthProvider>
      </LocaleProvider>
    </ErrorBoundary>
  )
}
