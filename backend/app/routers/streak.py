# backend/app/routers/streak.py

from fastapi import APIRouter
from app.services import streak_service

router = APIRouter(prefix="/streak", tags=["Streak"])

@router.get("/{user}")
async def get_streak(user: str):
    streak = streak_service.get_streak(user)
    return {"success": True, "streak": streak}
