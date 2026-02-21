"""
V2-2: Cabinet API - My Orders, Order Details, Guest Linking, OTP Auth
Includes guest cabinet with phone OTP authentication
"""
from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone, timedelta
import uuid
import random
import logging

from core.db import db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/v2/cabinet", tags=["Cabinet V2"])


# ============= OTP Models =============

class OTPRequest(BaseModel):
    phone: str

class OTPVerify(BaseModel):
    phone: str
    code: str

class OTPResponse(BaseModel):
    success: bool
    message: str
    expires_in: Optional[int] = None

class CabinetSession(BaseModel):
    token: str
    phone: str
    expires_at: str


async def get_auth_user(request: Request) -> dict:
    """Get authenticated user from session - REQUIRED"""
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header[7:]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    user = await db.users.find_one({"id": session["user_id"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user


@router.get("/profile")
async def get_profile(request: Request):
    """Get current user profile"""
    user = await get_auth_user(request)
    return user


@router.put("/profile")
async def update_profile(request: Request):
    """Update user profile"""
    user = await get_auth_user(request)
    body = await request.json()
    
    allowed = ["full_name", "phone", "city", "address", "np_department"]
    update_data = {k: v for k, v in body.items() if k in allowed and v}
    
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        await db.users.update_one({"id": user["id"]}, {"$set": update_data})
    
    updated = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0})
    return updated


@router.get("/orders")
async def get_my_orders(request: Request, page: int = 1, limit: int = 20):
    """Get user's orders with pagination"""
    user = await get_auth_user(request)
    
    skip = (page - 1) * limit
    
    cursor = db.orders.find(
        {"buyer_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).skip(skip).limit(limit)
    
    orders = await cursor.to_list(limit)
    total = await db.orders.count_documents({"buyer_id": user["id"]})
    
    return {
        "orders": orders,
        "total": total,
        "page": page,
        "pages": (total // limit) + (1 if total % limit else 0)
    }


@router.get("/orders/{order_id}")
async def get_order_details(order_id: str, request: Request):
    """Get order details by ID"""
    user = await get_auth_user(request)
    
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check ownership
    if order.get("buyer_id") != user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get TTN tracking if available
    if order.get("delivery", {}).get("ttn"):
        ttn = order["delivery"]["ttn"]
        tracking = await db.ttn_tracking.find_one({"ttn": ttn}, {"_id": 0})
        order["tracking"] = tracking
    
    return order


@router.post("/orders/{order_id}/repeat")
async def repeat_order(order_id: str, request: Request):
    """Add items from previous order to cart"""
    user = await get_auth_user(request)
    
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.get("buyer_id") != user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get or create cart
    cart = await db.carts.find_one({"user_id": user["id"]})
    if not cart:
        cart = {"user_id": user["id"], "items": []}
    
    # Add order items to cart
    cart_items = cart.get("items", [])
    for item in order.get("items", []):
        existing = next((i for i in cart_items if i.get("product_id") == item.get("product_id")), None)
        if existing:
            existing["quantity"] += item.get("quantity", 1)
        else:
            cart_items.append({
                "product_id": item.get("product_id"),
                "quantity": item.get("quantity", 1),
                "price": item.get("price"),
                "title": item.get("title"),
                "image": item.get("image")
            })
    
    await db.carts.update_one(
        {"user_id": user["id"]},
        {"$set": {"items": cart_items, "updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True
    )
    
    return {"message": "Items added to cart", "items_count": len(cart_items)}


@router.get("/wishlist")
async def get_wishlist(request: Request):
    """Get user's wishlist"""
    user = await get_auth_user(request)
    
    wishlist = await db.wishlists.find_one({"user_id": user["id"]}, {"_id": 0})
    
    if not wishlist:
        return {"items": []}
    
    # Get product details
    product_ids = wishlist.get("product_ids", [])
    if product_ids:
        products = await db.products.find(
            {"id": {"$in": product_ids}},
            {"_id": 0}
        ).to_list(100)
        return {"items": products}
    
    return {"items": []}


@router.post("/wishlist/{product_id}")
async def add_to_wishlist(product_id: str, request: Request):
    """Add product to wishlist"""
    user = await get_auth_user(request)
    
    await db.wishlists.update_one(
        {"user_id": user["id"]},
        {"$addToSet": {"product_ids": product_id}, "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True
    )
    
    return {"message": "Added to wishlist"}


@router.delete("/wishlist/{product_id}")
async def remove_from_wishlist(product_id: str, request: Request):
    """Remove product from wishlist"""
    user = await get_auth_user(request)
    
    await db.wishlists.update_one(
        {"user_id": user["id"]},
        {"$pull": {"product_ids": product_id}}
    )
    
    return {"message": "Removed from wishlist"}
