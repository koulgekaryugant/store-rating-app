// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import AdminDashboard from './pages/Admin/AdminDashboard'
import OwnerDashboard from './pages/Owner/OwnerDashboard'
import UserDashboard from './pages/User/UserDashboard'
import LandingPage from './pages/LandingPage/LandingPage'

const ProtectedRoute = ({ children, roles }) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (!token) return <Navigate to="/login" />
  if (roles && !roles.includes(role)) return <Navigate to="/login" />

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={['SYSTEM_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute roles={['STORE_OWNER']}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute roles={['NORMAL_USER']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
