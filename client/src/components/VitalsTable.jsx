import React from 'react'

export default function VitalsTable({ rows=[] }) {
  return (
    <div className="card">
      <h3 style={{marginTop:0}}>Vitals History</h3>
      <table className="table">
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
          {rows.slice().reverse().map((r, idx) => (
            <tr key={idx}>
              <td>{new Date(r.ts || r.timestamp || Date.now()).toLocaleString()}</td>
              <td>{r.heartRate ?? r.hr}</td>
              <td>{r.spo2}</td>
              <td>{r.temp}</td>
              <td>{(r.bpSys ?? r.bp?.sys)}/{(r.bpDia ?? r.bp?.dia)}</td>
            </tr>
          ))}
          {!rows.length && (
            <tr><td colSpan={5} className="small">No data yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}