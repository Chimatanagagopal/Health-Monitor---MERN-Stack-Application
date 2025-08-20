Health Monitor - MERN Stack Application
Project Overview
Health Monitor is a real-time healthcare monitoring system built with the MERN stack (MongoDB, Express.js, React, Node.js). It enables doctors and patients to monitor vital signs, view patient histories, and get alerts for abnormal health conditions remotely.

This project addresses the need for continuous patient monitoring, remote diagnostics, and proactive alerting to improve healthcare outcomes.

Features
Role-based Access: Separate dashboards and functionalities for Doctors and Patients.

Real-Time Monitoring: Live updates of key vitals (heart rate, SpO₂, temperature, blood pressure) via WebSockets.

Alert System: Automated alerts for abnormal vitals, visible to both patients and doctors.

Patient Management: Doctors can monitor multiple patients and access their historical data.

Historical Data: Comprehensive vitals history presented in tables for trend tracking.

Secure Authentication: Registration and login with JWT-based authentication.

Responsive UI: Clean, modern, and accessible frontend built with React.

Tech Stack
Frontend: React.js, React Router, Context API

Backend: Node.js, Express.js, Socket.io

Database: MongoDB with Mongoose ODM

Auth: JWT (JSON Web Tokens)

Real-time: WebSocket communication via Socket.io

Styling: CSS with modular/scoped style sheets

Installation and Setup
Prerequisites
Node.js and npm installed

MongoDB instance (local or MongoDB Atlas)

Git installed

Steps
Clone the repo:

bash
git clone https://github.com/yourusername/your-health-monitor.git
Backend setup:

bash
cd backend
npm install
Create .env file with:

text
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
Start backend server:

bash
npm run dev
Frontend setup:

bash
cd ../frontend
npm install
npm start
The React app runs by default on http://localhost:3000 and backend on http://localhost:5000.

Usage
Register as a Patient or Doctor.

Login to your respective dashboard.

Doctors can select patients to monitor real-time vitals and alerts.

Patients see their own live vitals and historical data.

Alerts notify users of any health issues requiring attention.

Future Improvements
Interactive charts for vitals trends.

Appointment scheduling & telemedicine integration.

AI-based predictive health analytics.

Notification preferences with SMS/email alerts.

Dark mode and enhanced accessibility.

API documentation and automated tests.

Contributing
Contributions are welcome! Please fork the repo and submit pull requests.
Report bugs or request features via GitHub Issues.



Contact
For questions or support, reach out to:chimatanagagopal95@gmail.com