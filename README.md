# 🌟 EduCare Dashboard — React + Node.js

A gamified educational platform with role-based dashboards for Students, Teachers, and Parents.

---

## 📁 Project Structure

```
educare/
├── backend/          ← Node.js + Express API
│   ├── server.js
│   └── package.json
├── frontend/         ← React App
│   ├── public/
│   │   └── index.html
│   │   └── games/   ← COPY your HTML game files here
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   └── pages/
│   │       ├── LoginPage.js
│   │       ├── RoleSelectionPage.js
│   │       ├── StudentDashboard.js
│   │       ├── TeacherDashboard.js
│   │       ├── ParentDashboard.js
│   │       └── DashboardRouter.js
│   └── package.json
└── README.md
```

---

## 🚀 Setup Instructions

### Step 1 — Copy your HTML game files

Copy all your original `.html` game files into:
```
frontend/public/games/
```
Files to copy:
- chatbot.html
- grammar_galaxy.html
- history_timeline.html
- maths_bullseye.html
- science_lab.html
- phy_game.html
- village_quest.html
- teacher_resolve.html
- hindi.html
- state_spotter.html
- shape_sorter.html
- mission_CET.html
- translations.json

---

### Step 2 — Install & Run Backend

```bash
cd backend
npm install
npm run dev
```
Backend runs on: **http://localhost:5000**

> 💡 Update the MongoDB URI in `server.js` if needed.

---

### Step 3 — Install & Run Frontend

```bash
cd frontend
npm install
npm start
```
Frontend runs on: **http://localhost:3000**

---

## 🔐 Auth Flow

1. **Login / Register** at `/login`
2. **Select Role** at `/select-role` (Student / Teacher / Parent)
3. **Dashboard** at `/dashboard` — shows role-specific view

---

## 🎮 Game Files

Games open in new tabs from the Student Dashboard. They are served as static files from `frontend/public/games/`.

---

## 🌐 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | Login & get JWT token |
| POST | `/api/set-role` | Set user role (auth required) |
| GET  | `/api/profile` | Get user profile (auth required) |
| POST | `/api/update-xp` | Update user XP (auth required) |
| GET  | `/api/health` | Health check |

---

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6, Axios
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- **Styling**: Custom CSS-in-JS (no extra library needed)
- **Fonts**: Poppins (Google Fonts)
