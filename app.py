from fastapi import FastAPI
from database import db
from routes import books

# Initialize FastAPI app
app = FastAPI()

# Include routes
app.include_router(books.router)
