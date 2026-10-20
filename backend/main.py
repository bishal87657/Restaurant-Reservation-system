import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from database import engine, Base
from routes.auth import router as auth_router
from routes.reservations import router as reservations_router
from routes.favorites import router as favorites_router
import models

# Initialize Database Tables
Base.metadata.create_all(bind=engine)

# Create FastAPI App
app = FastAPI(
    title="Restora Restaurant Reservation API",
    description="Backend API for the Restora restaurant reservation system",
    version="1.0.0",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Session Middleware
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv(
        "SESSION_SECRET",
        "restora-local-development-secret-key"
    ),
    max_age=604800,
    same_site="lax",
    https_only=False,
)

# Include Routers
app.include_router(auth_router)
app.include_router(reservations_router)
app.include_router(favorites_router)

@app.get("/")
def home():
    return {
        "status": "success",
        "message": "Restora Restaurant Reservation API is running!",
    }

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "Backend is running correctly",
    }