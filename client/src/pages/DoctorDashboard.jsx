
import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import VitalsTable from '../components/VitalsTable'
import Alert from '../components/Alert'
import { connectSocket } from '../socket'
import { fetchHistory, fetchPatients } from '../api'
import { checkAlerts, fmt } from '../utils'

export default function DoctorDashboard({ user, onLogout }) {
  const [socket, setSocket] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(localStorage.getItem('selectedPatient') || '')
  const [latestByPatient, setLatestByPatient] = useState({})
  const [history, setHistory] = useState([])
  const [patients, setPatients] = useState([])
  const [showAlert, setShowAlert] = useState(true)

  // Load list of patients
  useEffect(() => {
    fetchPatients().then(setPatients).catch(() => {})
  }, [])

  // Fetch history when patient changes
  useEffect(() => {
    if (!selectedPatient) return
    fetchHistory(user, selectedPatient)
      .then(setHistory)
      .catch(() => setHistory([]))
  }, [selectedPatient, user])

  // Socket connection
  useEffect(() => {
    const s = connectSocket(user.token || localStorage.getItem('token'))
    s.on('vitals-batch', (batch) => {
      batch.forEach(payload => {
        setLatestByPatient(prev => ({ ...prev, [payload.patientId]: payload }))
        if (payload.patientId === selectedPatient) {
          setHistory(h => [payload, ...h])
        }
      })
    })
    setSocket(s)
    return () => s.disconnect()
  }, [selectedPatient, user.token])

  const latest = latestByPatient[selectedPatient]
  const alerts = useMemo(() => checkAlerts(latest), [latest])

  // Get patient name utility
  const getPatientName = (pid) => {
    const pat = patients.find(p => (p._id || p.id) === pid)
    return pat?.name || pat?.username || pat?.email || pid
  }

  // Get patient initials utility
  const getInitials = (pid) => {
    const pat = patients.find(p => (p._id || p.id) === pid)
    if (!pat) return pid.slice(0, 2).toUpperCase()
    let str = pat.name || pat.username || pat.email || ''
    return str.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()
  }

  // Status color helper for KPI tiles
  const kpiTileClass = (metric, value) => {
    if (!value) return ''
    const asObj = { [metric]: value }
    return checkAlerts(asObj).length ? 'warn' : 'ok'
  }

  return (
    <>
    <div className="dashboard-container">
 <div className="navbar">
  <div className="navbar-left">
    <span className="logo">🩺 <b>Health Monitor</b> <span className="role-tag">{user.role?.toUpperCase()}</span></span>
    <div className="subtext">Signed in as <span className="user">{user.username || 'Doctor'}</span></div>
  </div>
  <button className="logout-btn" onClick={onLogout}>Logout</button>
</div>


  <div className="card header-card">
    <div className="header-flex">
      <div>
        <h2>Doctor Dashboard</h2>
        <p className="sub">Monitor patient health in real-time</p>
      </div>
      <div>
        <select
          className="select big"
          value={selectedPatient}
          onChange={e => {
            setSelectedPatient(e.target.value)
            localStorage.setItem('selectedPatient', e.target.value)
          }}
        >
          <option value="">— Select Patient —</option>
          {patients.map(p => (
            <option key={p._id || p.id} value={p._id || p.id}>
              {p.name || p.username || p.email}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>

  {/* Alerts */}
  {alerts.length && showAlert && (
    <div className="alert-banner">
      <Alert messages={alerts} onClose={() => setShowAlert(false)} />
    </div>
  )}

  <div className="row">
    {/* Left: Live Vitals */}
    <div className="col card">
      <h3>Live Vitals</h3>
      {selectedPatient ? (
        <div className="kpi-grid">
          <div className={`kpi-tile ${kpiTileClass('heartRate', latest?.heartRate)}`}>
            <span className="icon">❤️</span>
            <div>
              <div className="label">Heart Rate</div>
              <div className="value">{fmt(latest?.heartRate, ' bpm')}</div>
            </div>
          </div>
          <div className={`kpi-tile ${kpiTileClass('spo2', latest?.spo2)}`}>
            <span className="icon">💨</span>
            <div>
              <div className="label">SpO₂</div>
              <div className="value">{fmt(latest?.spo2, '%')}</div>
            </div>
          </div>
          <div className={`kpi-tile ${kpiTileClass('temperature', latest?.temperature)}`}>
            <span className="icon">🌡️</span>
            <div>
              <div className="label">Temperature</div>
              <div className="value">{fmt(latest?.temperature, ' °C')}</div>
            </div>
          </div>
          <div className={`kpi-tile ${latest && (latest.bpSys && latest.bpDia) && (checkAlerts({ bpSys: latest.bpSys, bpDia: latest.bpDia }).length ? 'warn' : 'ok')}`}>
            <span className="icon">🩸</span>
            <div>
              <div className="label">Blood Pressure</div>
              <div className="value">{latest ? `${latest.bpSys}/${latest.bpDia} mmHg` : '-'}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="small">Choose a patient to start monitoring.</div>
      )}
    </div>

    {/* Right: Latest of All Patients */}
    <div className="col card">
      <h3>All Patients (Latest)</h3>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>HR</th>
            <th>SpO₂</th>
            <th>Temp</th>
            <th>BP</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(latestByPatient).map(([pid, v]) => (
            <tr
              key={pid}
              className={pid === selectedPatient ? 'selected' : ''}
              onClick={() => setSelectedPatient(pid)}
            >
              <td><span className="avatar">{getInitials(pid)}</span> {getPatientName(pid)}</td>
              <td>{v.heartRate}</td>
              <td>{v.spo2}</td>
              <td>{v.temperature}</td>
              <td>{v.bpSys}/{v.bpDia}</td>
              <td>{checkAlerts(v).length ? '⚠️' : '✅'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

    </>
  )
}
