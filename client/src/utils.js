export const thresholds = {
  heartRate: { min: 50, max: 120 },
  spo2: { min: 92, max: 100 },
  temp: { min: 34, max: 38 }, // Celsius
  bpSys: { min: 90, max: 140 },
  bpDia: { min: 60, max: 90 },
}

export const checkAlerts = (v) => {
  if (!v) return []
  const a = []
  if (v.heartRate < thresholds.heartRate.min || v.heartRate > thresholds.heartRate.max) a.push('Heart Rate out of range')
  if (v.spo2 < thresholds.spo2.min) a.push('SpO₂ low')
  if (v.temp > thresholds.temp.max) a.push('Temperature high')
  if (v.bpSys > thresholds.bpSys.max || v.bpDia > thresholds.bpDia.max) a.push('Blood Pressure high')
  return a
}

export const fmt = (n, suffix='') => (n == null ? '-' : `${n}${suffix}`)