# 🌟 LIFE DASHBOARD

A full-stack personal life dashboard web application that helps you track daily fitness habits and monitor the four main pillars of life: Health, Wealth, Love, and Happiness.

## Features
- **Fitness Tracking**: Log daily reps for push-ups, pull-ups, squats, sit-ups, and planks.
- **Life Pillars**: Rate your daily health, wealth, love, and happiness using a 1-10 sliding scale. Keep a journal entry with tags for each pillar.
- **Beautiful Dashboard**: Neon-themed UI powered by Tailwind CSS, React, and Recharts.
- **Authentication**: JWT-based secure authentication.
- **Streaks**: Automatic tracking of active days to keep you motivated.

## Technologies
- **Backend**: Python 3.11+, FastAPI, MongoDB, Motor (Async), Pydantic, Passlib
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Axios
- **Deployment**: Render

## Local Setup

### Backend
1. `cd backend`
2. Create virtual environment: `python -m venv venv` and activate it
3. Install requirements: `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and set `MONGO_URI` and `SECRET_KEY`
5. Run the server: `uvicorn main:app --reload`
6. Create an account via CLI script: `python ../helpers/create_account.py`

### Frontend
1. `cd frontend`
2. Install dependencies: `npm install`
3. Start Vite dev server: `npm run dev`
4. Access at `http://localhost:5173`

## Deployment
This project is configured right out of the box for Render.
Simply connect the repository in Render's Blueprint section, and it will deploy the FastAPI backend and React static built frontend automatically using `render.yaml`.
