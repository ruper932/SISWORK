# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import auth, profiles, bookings, search, admin, notifications, chat

app = FastAPI(title="Servicios Marketplace La Paz")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
app.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
app.include_router(search.router, prefix="/search", tags=["search"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])
