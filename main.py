import os
from db import users_collection
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
from fastapi import FastAPI, HTTPException, Depends
from jose import JWTError, jwt 
from models import UserBase
from models import UserCreate, UserResponse
from passlib.hash import bcrypt

app = FastAPI()


load_dotenv() # Load environment variables from .env file
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

# Generate JWT
def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


@app.post("/login")
async def login(email: str, password: str):
    user = await users_collection.find_one({"email": email})
    if not user or not bcrypt.verify(password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Generate token
    token = create_access_token({"sub": user[email], "role": user["role"]})
    return {"access token": token, "token_type": "bearer"}





# Helper function to hash passwords
def hash_password(password: str) -> str:
    return bcrypt.hash(password)

@app.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    # Check if the user already exists 
    existing_user = await users_collection.find.one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash the password
    hashed_password = hash_password(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_password

    # Insert into database 
    result = await users_collection.insert_one(user_dict)
    user_id = str(result.inserted_id)
    return UserResponse(id=user_id, **user.dict())