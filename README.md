# Identiscan — Face-Recognition Attendance System

Self-hostable attendance system: students check in with a roll number + live photo,
the backend matches it against the enrolled photo with `face_recognition` (dlib),
and records check-in/out with a 6-hour minimum-stay rule. Admins manage
batches/classes/students and view attendance percentages.

## Architecture (3 services + MongoDB)

| Service | Code | Default port |
|---|---|---|
| Express API | `backend/` | `5003` (`PORT`) |
| Flask face service | `flaskapp/face_recog_api.py` | `5004` |
| Attendance frontend (React 19 + Vite) | `Attendance_frontend/` | `VITE_SERVER` → backend URL |
| Admin frontend (React 18 + Vite) | `Admin_frontend/` | same backend |
| Linux touchscreen app (Electron) | `my-electron-app/` | wraps Attendance frontend |

Flow: Attendance frontend → `POST /admin/compare` (roll + live photo) →
backend pulls the enrolled photo from MongoDB GridFS (`photos` bucket) →
forwards both images to Flask (`:5004`), which returns a dlib 128-d embedding
distance (match threshold 0.6) → backend writes the `records` doc.
Rule: check-in before 12:00, checkout needs a ≥ 6h gap, one in/out per day
(`backend/controllers/mark.js`).

## Prerequisites

- Node 18+, Python 3.10+, MongoDB (local or Atlas)
- Python face stack: `pip install -r flaskapp/requirements.txt`
  (`face-recognition`, dlib — needs CMake + a C++ compiler to build)

## Setup

```bash
# 1. Face service
cd flaskapp && pip install -r requirements.txt && python face_recog_api.py  # :5004

# 2. API (needs MongoDB + SESSION_KEY)
cd backend && npm install
PORT=5003 SESSION_KEY=<random> MONGODB_URI=<uri> node index.js               # :5003

# 3. Frontends (point at the API)
cd Attendance_frontend && VITE_SERVER=http://localhost:5003 npm run dev
cd Admin_frontend && VITE_SERVER=http://localhost:5003 npm run dev
```

Notes:

- Inter-service URLs default to localhost (`backend` → Flask `:5004`);
  set them explicitly for any non-local deploy.
- Auth is session-cookie + bcrypt; students are identified by roll number.
- Deleting a batch cascades to its classes, students, records, and dates
  (Mongoose `pre("deleteOne")` hooks in `backend/Schema.js`).

## Face model

Matching uses dlib's ResNet embedding via the `face_recognition` package
(99.38% on LFW, per the model publisher — no in-repo evaluation).
First detected face only, Euclidean distance threshold 0.6
(`flaskapp/face_recog_api.py:35-40`).
