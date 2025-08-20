# Simplified Real-Time Health Monitoring Dashboard (Frontend)

React + Vite frontend with plain CSS (no Tailwind, no charts). Connects to a Node/Express/Socket.IO backend with JWT auth.

## Quick Start

```bash
# 1) Set the API/Socket URL of your backend (defaults to same origin)
echo "VITE_API_URL=http://localhost:5000" > .env

# 2) Install
npm i

# 3) Run
npm run dev
```

## Expected Backend Endpoints & Events

- `POST /api/auth/login` -> `{ token, role: 'doctor'|'patient', userId, name }`
- `GET /api/vitals/history?patientId=...` -> `[{ ts, heartRate, spo2, temp, bpSys, bpDia }]`
- `GET /api/patients` -> optional list: `[{ _id, name }]`
- Socket.IO connection with `auth: { token }`
- Emits: `vital_update` -> `{ patientId, ts, heartRate, spo2, temp, bpSys, bpDia }`

> If your event/field names differ, tweak `src/pages/*.jsx` accordingly.

## Build

```bash
npm run build
```

The static assets will be in `dist/`.