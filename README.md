# DayNote 🪄

A visually stunning, AI-powered journal app that summarizes your day and detects your mood using Google Gemini. Built with Next.js, TailwindCSS, Express, and MongoDB.

---

## ✨ Features
- Write and save daily journal entries
- AI-generated summary and mood detection (Gemini API)
- Beautiful, animated timeline view
- Responsive, glassmorphic UI with dark/light mode
- MongoDB for persistent storage
- Full-stack: Node.js/Express backend, Next.js frontend

---

## 🚀 Live Demo
[Live App on Render](https://your-frontend-url.onrender.com)

---

## 🛠️ Tech Stack
- **Frontend:** Next.js, React, TailwindCSS, Framer Motion, Headless UI, Heroicons, React Hot Toast
- **Backend:** Node.js, Express, Mongoose, Gemini API
- **Database:** MongoDB Atlas
- **Deployment:** Render

---

## 📝 Sample Journal Entry
**Entry:**
```
Today I went for a walk in the park and enjoyed the sunshine. I felt really relaxed and happy to be outside.
```
**Generated Summary:**
> Went for a walk in the park, enjoyed the sunshine, and felt relaxed and happy.

**Detected Mood:**
> Happy

---

## 🧑‍💻 Local Development

### 1. Clone the repository
```bash
git clone https://github.com/your-username/daynote.git
cd daynote
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
PORT=5000
```
Start the backend:
```bash
node server.js
```

### 3. Setup the Frontend
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Start the frontend:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment (Render)

### Backend
- Create a new Web Service on Render
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node server.js`
- Add environment variables from your `.env` file

### Frontend
- Create a new Web Service on Render
- Root Directory: `frontend`
- Build Command: `npm run build`
- Start Command: `npm start`
- Add environment variable:
  - `NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com`

---

## 📁 Project Structure
```
AI-powered_Journal app/
├── backend/
│   ├── server.js
│   └── .env (not committed)
├── frontend/
│   ├── src/app/
│   ├── public/
│   ├── .env (not committed)
│   └── ...
└── README.md
```

---

## 🛡️ Environment Variables
- **backend/.env**
  - `GEMINI_API_KEY` — Your Gemini API key
  - `MONGODB_URI` — Your MongoDB Atlas connection string
  - `PORT` — (e.g. 5000 or 10000 for Render)
- **frontend/.env**
  - `NEXT_PUBLIC_API_URL` — URL of your backend API

---

## 📜 License
MIT 