task-manager/
├─ backend/
│  ├─ src/
│  │  ├─ controllers/
│  │  │  ├─ authController.js
│  │  │  └─ taskController.js
│  │  ├─ middlewares/
│  │  │  ├─ auth.js
│  │  │  ├─ errorHandler.js
│  │  │  └─ logger.js
│  │  ├─ models/
│  │  │  ├─ User.js
│  │  │  └─ Task.js
│  │  ├─ routes/
│  │  │  ├─ auth.js
│  │  │  └─ tasks.js
│  │  ├─ tests/
│  │  │  └─ auth.test.js
│  │  └─ app.js
│  ├─ Dockerfile
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  ├─ app/
│  │  │  └─ store.js
│  │  ├─ features/
│  │  │  ├─ auth/
│  │  │  │  ├─ authSlice.js
│  │  │  │  └─ Login.jsx
│  │  │  └─ tasks/
│  │  │     ├─ tasksSlice.js
│  │  │     └─ Dashboard.jsx
│  │  ├─ components/
│  │  └─ index.jsx
│  ├─ netlify.toml
│  └─ package.json
└─ README.md
### 🐳 Docker Support
The backend is fully containerized.

#### Build & Run
```bash
docker build -t task-backend .
docker run -p 5000:5000 task-backend
