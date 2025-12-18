# 🏥 MediQueue – Smart Appointment & Queue Management System

> A full-stack web application that digitizes doctor appointment booking and queue management to reduce patient waiting time and clinic overcrowding.

![MediQueue Banner](./screenshots/banner.png)

[![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-forestgreen?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🔗 Live Demo

- 🚀 **Live Application:** https://medi-queue.vercel.app
- 📄 **Backend API:** https://medi-queue-api.onrender.com

**Test Credentials:**
Email:    demo@mediqueue.com
Password: demo123

---

## 🎯 Problem Statement

Small and mid-scale clinics often rely on manual queues or phone-based appointment systems, which results in:

- Overcrowded waiting areas and increased infection risk.
- Long and unpredictable waiting times.
- Inefficient doctor scheduling and poor patient experience.

**MediQueue** solves this by digitizing the entire appointment and queue workflow using a slot-based booking system and backend-driven queue logic, ensuring transparency and predictability for both patients and doctors.

---

## 📸 Screenshots

| Home Page | Appointment Booking |
|:---:|:---:|
| ![Home](./screenshots/home.png) | ![Booking](./screenshots/booking.png) |

| Dashboard | Queue Status |
|:---:|:---:|
| ![Dashboard](./screenshots/dashboard.png) | ![Queue](./screenshots/queue.png) |

---

## 🚀 Key Features

### 👤 Patient Experience
- **Secure Authentication:** JWT-based login and registration.
- **Slot-Based Booking:** Visual interface to check availability and book slots.
- **Live Queue Status:** Dynamic position calculation and estimated wait times.
- **Manage Appointments:** View, cancel, or reschedule bookings easily.

### 🩺 Doctor & Admin Dashboard
- **Schedule Management:** Manage daily availability and time slots.
- **Traffic Control:** View upcoming and completed appointments.
- **Conflict Prevention:** Backend validation to strictly prevent double-booking.
- **Instant Actions:** Cancel or reschedule appointments with immediate updates.

---

## 🧠 Engineering Challenges Solved

- **Concurrency Handling:** Designed backend logic (using Mongoose transactions) to prevent double-booking when multiple users try to book the same slot simultaneously.
- **Real-Time Validation:** Implemented slot-based scheduling with immediate availability checks.
- **Security:** Secured REST APIs using custom JWT authentication middleware and Bcrypt hashing.
- **Scalability:** Structured the backend using MVC architecture to separate concerns.
- **Edge Case Handling:** Managed real-world scenarios such as cancellations, rescheduling, and session expiry.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **React.js (Vite)**
- **Tailwind CSS** (Styling)
- **Context API** (State Management)
- **Axios** (API requests with Interceptors)
- **Framer Motion** (Animations)

### Backend
- **Node.js & Express.js**
- **RESTful API** Architecture
- **MVC Pattern** (Model-View-Controller)
- **JWT** (Authentication)

### Database
- **MongoDB Atlas**
- **Mongoose ODM**
- **Indexed Queries** for performance optimization

---

## 📂 Project Structure

MediQueue/
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application routes/views
│   │   ├── context/       # Global state (Auth, Theme)
│   │   ├── services/      # API interaction logic
│   │   └── utils/         # Helper functions
│
├── backend/
│   ├── controllers/       # Business logic & Request handling
│   ├── models/            # Mongoose Database schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth checks & error handling
│   ├── config/            # DB connection setup
│   └── server.js          # Entry point

---

## ⚡ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas Connection String

### Installation

**1. Clone the repository**
git clone https://github.com/saurabhtripathi7/MediQueue.git
cd MediQueue

**2. Backend Setup**
cd backend
npm install

# Create a .env file in the backend folder:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key

# Run the server
npm start

**3. Frontend Setup**
cd ../frontend
npm install
npm run dev

---

## 📊 Project Highlights
- **20+** reusable React components.
- **15+** secured REST API endpoints.
- **Modular** backend with strict separation of concerns.
- **Production-ready** deployment configuration.

---

## 🧪 Future Enhancements
- [ ] **WebSockets:** Implement Socket.io for real-time queue updates without page refresh.
- [ ] **RBAC:** Distinct panels for Admin vs. Doctor.
- [ ] **Notifications:** Email & SMS reminders using Nodemailer/Twilio.
- [ ] **Payments:** Integration with Stripe/Razorpay for consultation fees.

---

## 💡 What This Project Demonstrates
*(Technical skills demonstrated in this codebase)*

- **Full-Stack Development:** Seamless integration between React, Node.js, and MongoDB.
- **API Design:** Clean, RESTful endpoints with proper status codes and error handling.
- **Security:** Implementation of JWT, protected routes, and input validation.
- **Architecture:** Use of MVC pattern and Context API for scalable code.

---

## 👨‍💻 Author

**Saurabh Tripathi**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/saurabhtripathicr7/)
