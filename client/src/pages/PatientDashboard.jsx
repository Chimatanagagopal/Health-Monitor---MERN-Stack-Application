import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import VitalsTable from '../components/VitalsTable'
import Alert from '../components/Alert'
import { connectSocket } from '../socket'
import { checkAlerts, fmt } from '../utils'
import { fetchHistory } from '../api'

export default function PatientDashboard({ user, onLogout }) {
  const [socket, setSocket] = useState(null)
  const [history, setHistory] = useState([])
  const [latest, setLatest] = useState(null)

  // Set latest from history if no live data yet
  useEffect(() => {
    if (history.length && !latest) {
      setLatest(history[history.length - 1])
    }
  }, [history, latest])

  // Fetch patient history
  useEffect(() => {
    if (!user) return
    fetchHistory(user, user.userId)
      .then(setHistory)
      .catch(err => console.error("Failed to fetch history", err))
  }, [user])

  // Setup socket for live vital updates
  useEffect(() => {
    if (!user) return
    const s = connectSocket(user.token || localStorage.getItem('token'))
    s.on('vital_update', (payload) => {
      if (payload.patientId === user.userId) {
        setLatest(payload)
        setHistory(h => [...h, payload])
      }
    })
    setSocket(s)
    return () => s.disconnect()
  }, [user.userId, user.token])

  const alerts = useMemo(() => checkAlerts(latest), [latest])

  // Determine KPI tile class based on metric and value
  const kpiTileClass = (metric, value) => {
    if (!value) return ''
    const alertCount = checkAlerts({ [metric]: value }).length
    if (!alertCount) return 'ok'
    // Example simplified, consider more detailed alert levels if any
    return 'warn'
  }

  return (
    <>
       <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">🩺 <b>Health Monitor</b> <span className="navbar-role">{user.role?.toUpperCase()}</span></span>
        <span className="navbar-user">Signed in as <b>{user.username || 'User'}</b></span>
      </div>
      <button className="logout-btn" onClick={onLogout}>Logout</button>
    </nav>
      <div className="patient-dashboard-container">
        <div className="card">
          <h3 className="section-title">Your Live Vitals</h3>
          {alerts.length > 0 ? (
            <Alert messages={alerts} />
          ) : (
            <div className="safe-msg small">All vitals in safe range.</div>
          )}
          <div className="kpi-grid">
            <div className={`kpi-tile ${kpiTileClass('heartRate', latest?.heartRate)}`}>
              <span className="icon">❤️</span>
              <div className="kpi-title">Heart Rate</div>
              <div className="kpi-value">{fmt(latest?.heartRate, ' bpm')}</div>
            </div>
            <div className={`kpi-tile ${kpiTileClass('spo2', latest?.spo2)}`}>
              <span className="icon">💨</span>
              <div className="kpi-title">SpO₂</div>
              <div className="kpi-value">{fmt(latest?.spo2, '%')}</div>
            </div>
            <div className={`kpi-tile ${kpiTileClass('temperature', latest?.temperature)}`}>
              <span className="icon">🌡️</span>
              <div className="kpi-title">Temperature</div>
              <div className="kpi-value">{fmt(latest?.temperature || latest?.temp, ' °C')}</div>
            </div>
            <div className={`kpi-tile ${kpiTileClass('bpSys', latest?.bpSys) || kpiTileClass('bpDia', latest?.bpDia)}`}>
              <span className="icon">🩸</span>
              <div className="kpi-title">Blood Pressure</div>
              <div className="kpi-value">{latest ? `${latest.bpSys}/${latest.bpDia} mmHg` : '-'}</div>
            </div>
          </div>
        </div>
        <div className="vitals-history-card">
          <h3 className="vitals-history-title">Vitals History</h3>
          <table className="vitals-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Heart Rate</th>
                <th>SpO₂</th>
                <th>Temp (°C)</th>
                <th>BP (mmHg)</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row, idx) => (
                <tr key={idx}>
                  <td>{new Date(row.createdAt || row.timestamp).toLocaleString()}</td>
                  <td>{row.heartRate}</td>
                  <td>{row.spo2}</td>
                  <td>{row.temperature || row.temp}</td>
                  <td>{row.bpSys}/{row.bpDia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
