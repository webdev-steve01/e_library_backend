from fastapi import FastAPI
from database import db
from routes import books
from fastapi.middleware.cors import CORSMiddleware
# Initialize FastAPI app
app = FastAPI()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change "*" to your frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include routes
app.include_router(books.router)
