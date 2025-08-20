import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// LOGIN
export const login = async (email, password) => {
  const { data } = await api.post('/api/auth/login', { email, password })
  if (!data?.token) throw new Error(data?.message || 'Login failed')
  return {
    token: data.token,
    role: data.user.role,
    userId: data.user._id || data.user.id,
    username: data.user.username,
    email: data.user.email
  }
}

// REGISTER
export const register = async ({ username, email, password, role }) => {
  const { data } = await api.post('/api/auth/register', { username, email, password, role })
  if (data?.error) throw new Error(data?.message || 'Registration failed')
  return { message: data?.message || 'Registered successfully' }
}

// FETCH VITALS HISTORY
export const fetchHistory = async (user, patientId = null) => {
  let res;
  if (user.role === 'patient') {
    res = await api.get('/api/vitals/my');
  } else if (user.role === 'doctor') {
    if (!patientId) throw new Error('Patient ID required for doctor history');
    res = await api.get(`/api/vitals/history/${patientId}`);
  } else {
    throw new Error('Invalid user role');
  }
  return res.data.history; // backend gives { success, history }
}

// FETCH ALL PATIENTS (for doctors)
export const fetchPatients = async () => {
  try {
    const res = await api.get('/api/patients')
    console.log("Patients API response:", res.data)  // 👈 debug
    return res.data.patients || res.data || []      // 👈 ensure array
  } catch (err) {
    console.error("Error fetching patients:", err)
    return []
  }
}
