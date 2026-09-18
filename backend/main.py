from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from database import engine, Base
from routes.auth import router as auth_router

import models


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Restaurant Reservation API"
)


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Session management
app.add_middleware(
    SessionMiddleware,
    secret_key="change-this-to-a-random-secret-key",
    max_age=60 * 60 * 24 * 7,
    same_site="lax",
    https_only=False
)


app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "message": "Restaurant Reservation API is running!"
    }