import React, { useState } from 'react'
import Register from './pages/Register'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import PatientDashboard from './pages/PatientDashboard'
import DoctorDashboard from './pages/DoctorDashboard'

export default function App() {
  const navigate = useNavigate()

  // ✅ Initialize user directly from localStorage
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    const userId = localStorage.getItem('userId')
    const username = localStorage.getItem('username')
    return token && role ? { token, role, userId, username } : null
  })

  const onLogout = () => {
    localStorage.clear()
    setUser(null)
    navigate('/login')
  }

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login setUser={setUser} />} />

      <Route
        path="/"
        element={
          user ? (
            user.role === 'doctor'
              ? <DoctorDashboard user={user} onLogout={onLogout} />
              : <PatientDashboard user={user} onLogout={onLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} />
    </Routes>
  )
}
