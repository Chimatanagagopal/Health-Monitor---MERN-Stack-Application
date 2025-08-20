
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import "./Register.css"
export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('patient')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log("📤 Sending request to register:", { username, email, role })
      const res = await api.post('/api/auth/register', { username, email, password, role })
      console.log("✅ Registration success:", res.data)
      navigate('/login')
    } catch (err) {
      console.error("❌ Registration error:", err.response || err.message)
      setError(err?.response?.data?.message || 'Registration failed. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Register</h2>
        <form onSubmit={onSubmit}>
          <label className="register-label">Username</label>
          <input
            className="register-input"
            type="text"
            value={username}
            onChange={e=>setUsername(e.target.value)}
            required
          />

          <label className="register-label">Email</label>
          <input
            className="register-input"
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
          />

          <label className="register-label">Password</label>
          <input
            className="register-input"
            type="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            required
          />

          <label className="register-label">Role</label>
          <select
            className="register-select"
            value={role}
            onChange={e=>setRole(e.target.value)}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>

          {error && <div className="register-alert">{error}</div>}
          <div>
            <button className="register-btn" type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        <div className="register-small">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}
