# backend/app/routers/feed.py
from fastapi import APIRouter, Query
from pydantic import BaseModel
from app.services import feed_service

router = APIRouter(prefix="/feed", tags=["Feed"])


class PostCreate(BaseModel):
    content: str
    media_hash: str = ""


class PostUpdate(BaseModel):
    post_id: int
    content: str
    media_hash: str = ""


class PostAction(BaseModel):
    post_id: int


# Create Post
@router.post("/create")
async def create_post(data: PostCreate):
    receipt = feed_service.create_post(data.content, data.media_hash)
    return {"success": True, "receipt": receipt}


# Update Post
@router.post("/update")
async def update_post(data: PostUpdate):
    receipt = feed_service.update_post(data.post_id, data.content, data.media_hash)
    return {"success": True, "receipt": receipt}


# Delete Post
@router.post("/delete")
async def delete_post(data: PostAction):
    receipt = feed_service.delete_post(data.post_id)
    return {"success": True, "receipt": receipt}


# Like Post
@router.post("/like")
async def like_post(data: PostAction):
    receipt = feed_service.like_post(data.post_id)
    return {"success": True, "receipt": receipt}


# Remove Like
@router.post("/removeLike")
async def remove_like(data: PostAction):
    receipt = feed_service.remove_like(data.post_id)
    return {"success": True, "receipt": receipt}


# Dislike Post
@router.post("/dislike")
async def dislike_post(data: PostAction):
    receipt = feed_service.dislike_post(data.post_id)
    return {"success": True, "receipt": receipt}


# Remove Dislike
@router.post("/removeDislike")
async def remove_dislike(data: PostAction):
    receipt = feed_service.remove_dislike(data.post_id)
    return {"success": True, "receipt": receipt}


# Get a single post
@router.get("/{post_id}")
async def get_post(post_id: int, user_address: str = Query(None)):
    post = feed_service.get_post(post_id, user_address)
    return {"success": True, "post": post}


# Get latest N posts
@router.get("/latest/{count}")
async def get_latest_posts(count: int = 10, user_address: str = Query(None)):
    posts = feed_service.get_latest_posts(count, user_address)
    return {"success": True, "posts": posts}
