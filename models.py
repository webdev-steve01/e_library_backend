from pydantic import BaseModel, Field
from datetime import datetime
from database import db


# Basic Pydantic models
class Book(BaseModel):
    id: int
    title: str
    author: str
    description: str
    image: str
    link: str

async def check_book_exists(book_id: int) -> bool:
    book = db.books.find_one({'id': book_id})
    return book is not None