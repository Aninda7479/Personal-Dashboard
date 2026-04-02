#!/usr/bin/env python3
"""
CLI helper to create a new user account directly in MongoDB.
Usage: python helpers/create_account.py
"""
import asyncio
import getpass
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
import random

load_dotenv("backend/.env")

async def create_account():
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        print("❌ MONGO_URI not found in backend/.env")
        return
        
    client = AsyncIOMotorClient(mongo_uri)
    db = client["lifedashboard"]
    users = db["users"]

    print("=== Life Dashboard — Create Account ===")
    name = input("Full Name: ").strip()
    email = input("Email: ").strip().lower()
    password = getpass.getpass("Password: ")
    confirm = getpass.getpass("Confirm Password: ")

    if password != confirm:
        print("❌ Passwords do not match.")
        return

    existing = await users.find_one({"email": email})
    if existing:
        print(f"❌ Account with email '{email}' already exists.")
        return

    colors = ["#00F5A0", "#FF6B6B", "#FFD93D", "#FF6BDE", "#6BAAFF"]
    user_doc = {
        "name": name,
        "email": email,
        "password_hash": bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "created_at": datetime.now(timezone.utc),
        "avatar_color": random.choice(colors),
    }

    result = await users.insert_one(user_doc)
    print(f"✅ Account created successfully! ID: {result.inserted_id}")
    client.close()

if __name__ == "__main__":
    asyncio.run(create_account())
