import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api'
import "./Login.css"   // <-- Import scoped CSS

export default function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(email, password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('userId', data.userId)
      localStorage.setItem('username', data.username || '')
      setUser({
        token: data.token,
        role: data.role,
        userId: data.userId,
        username: data.username
      })
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Sign in</h2>
        <p className="login-subtext">Use your Doctor or Patient account</p>
        <form onSubmit={onSubmit}>
          <label className="login-label">Email</label>
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="doctor@hospital.com"
            required
          />
          <label className="login-label">Password</label>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && <div className="login-alert">{error}</div>}

          <div className="login-actions">
            <button className="login-btn primary" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Login'}
            </button>
            <button
              className="login-btn secondary"
              type="button"
              onClick={()=>{ setEmail('doctor@demo.com'); setPassword('password') }}
            >
              Fill Demo
            </button>
          </div>
        </form>

        {/* 👇 Added: Not Registered link */}
        <div className="login-small">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>

      
    </div>
  )
}
