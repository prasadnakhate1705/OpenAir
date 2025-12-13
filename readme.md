# ✈️ OpenAir – ADT Final Project

**Full-Stack Flight Analytics & CRUD Application**

OpenAir is a full-stack web application that provides:

- Flight data visualization and statistics
- Full CRUD operations on flights
- Airport-level analytics
- Clean React UI with a Python FastAPI backend
- MongoDB as the primary data store

---

## 🧱 Tech Stack

**Frontend**

- React (Vite)
- Axios
- Recharts (Charts)
- Custom CSS (Dark Aviation Theme)

**Backend**

- Python FastAPI
- Motor (Async MongoDB driver)
- MongoDB (Local or Atlas)

---

## 📁 Project Structure

# ✈️ OpenAir – ADT Final Project

**Full-Stack Flight Analytics & CRUD Application**

OpenAir is a full-stack web application that provides:

- Flight data visualization and statistics
- Full CRUD operations on flights
- Airport-level analytics
- Clean React UI with a Python FastAPI backend
- MongoDB as the primary data store

---

## 🧱 Tech Stack

**Frontend**

- React (Vite)
- Axios
- Recharts (Charts)
- Custom CSS (Dark Aviation Theme)

**Backend**

- Python FastAPI
- Motor (Async MongoDB driver)
- MongoDB (Local or Atlas)

---

## 📁 Project Structure

OpenAir/
│
├── backend/
│ ├── main.py
│ ├── database.py
│ ├── models.py
│ ├── utils.py
│ ├── requirements.txt
│ ├── .env.example
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Flights.jsx
│ │ │ └── FlightForm.jsx
│ │ ├── api.js
│ │ ├── styles.css
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── .env.example
│ ├── package.json
│
└── README.md

---

## ⚙️ Prerequisites

Make sure you have:

- **Node.js ≥ 18**
- **Python ≥ 3.10**
- **MongoDB**
  - Either local (`mongodb://localhost:27017`)
  - Or MongoDB Atlas (recommended for deployment)

---

## 🚀 Local Setup (For All Team Members)

### 1️⃣ Backend Setup (FastAPI)

````bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt ```

---
Create environment file

cp .env.example .env

Create environment file

MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=openair
CORS_ORIGINS=http://localhost:5173

Run backend
uvicorn main:app --reload --port 8000


Test backend
http://localhost:8000/api/health
http://localhost:8000/api/flights?limit=5
http://localhost:8000/api/stats/overview



2️⃣ Frontend Setup (React)
Open a new terminal:

cd frontend
npm install


Create environment file
cp .env.example .env


Edit frontend/.env
VITE_API_BASE_URL=http://localhost:8000/api

Run frontend
npm run dev


Open browser
http://localhost:5173


🔁 One-Command Local Run (Optional)
# Terminal 1
cd backend && source .venv/bin/activate && uvicorn main:app --reload --port 8000

# Terminal 2
cd frontend && npm run dev


Flights (CRUD)
GET /api/flights
POST /api/flights
GET /api/flights/{id}
PUT /api/flights/{id}
DELETE /api/flights/{id}
Read-Only
GET /api/airports
GET /api/aircrafts
Analytics
GET /api/stats/overview
GET /api/stats/top-airports
````
