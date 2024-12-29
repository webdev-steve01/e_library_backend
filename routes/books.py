from fastapi import APIRouter, HTTPException
from database import db
from models import Book, check_book_exists

router = APIRouter()

@router.get("/explore-resources")
async def explore_resources():
    """Get all books in the library"""
    books = list(db.books.find({}, {'_id': 0}))
    return books

@router.get("/borrowed-books")
async def get_borrowed_books():
    """Get all borrowed books"""
    borrowed_books = []
    borrowed_ids = [book['book_id'] for book in db.borrowed.find({}, {'_id': 0})]
    
    for book_id in borrowed_ids:
        book = db.books.find_one({'id': book_id}, {'_id': 0})
        if book:
            borrowed_books.append(book)
    return borrowed_books

@router.get("/favorites")
async def get_favorites():
    """Get all favorite books"""
    favorite_books = []
    favorite_ids = [book['book_id'] for book in db.favorites.find({}, {'_id': 0})]
    
    for book_id in favorite_ids:
        book = db.books.find_one({'id': book_id}, {'_id': 0})
        if book:
            favorite_books.append(book)
    return favorite_books

@router.get("/history")
async def get_history():
    """Get all books in history"""
    history_books = []
    history_ids = [book['book_id'] for book in db.history.find({}, {'_id': 0})]
    
    for book_id in history_ids:
        book = db.books.find_one({'id': book_id}, {'_id': 0})
        if book:
            history_books.append(book)
    return history_books

# Action endpoints
@router.post("/borrow-book/{book_id}")
async def borrow_book(book_id: int):
    """Borrow a book if it exists"""
    # Check if book exists
    if not await check_book_exists(book_id):
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Check if already borrowed
    existing_borrow = db.borrowed.find_one({'book_id': book_id})
    if existing_borrow:
        raise HTTPException(status_code=400, detail="Book already borrowed")

    db.borrowed.insert_one({'book_id': book_id})
    return {"message": "Book borrowed successfully"}

@router.post("/add-favorite/{book_id}")
async def add_favorite(book_id: int):
    """Add a book to favorites if it exists"""
    # Check if book exists
    if not await check_book_exists(book_id):
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Check if already in favorites
    existing_favorite = db.borrowed.find_one({'book_id': book_id})
    if existing_favorite:
        raise HTTPException(status_code=400, detail="Book already in favorites")

    db.favorites.insert_one({'book_id': book_id})
    return {"message": "Book added to favorites"}

@router.post("/add-to-history/{book_id}")
async def add_to_history(book_id: int):
    """Add a book to history if it exists"""
    # Check if book exists
    if not await check_book_exists(book_id):
        raise HTTPException(status_code=404, detail="Book not found")

    db.history.insert_one({'book_id': book_id})
    return {"message": "Book added to history"}

@router.post("/add-book")
async def add_book(book: Book):
    """Add a new book to the library"""
    # Check if book already exists
    existing_book = db.books.find_one({'id': book.id})
    if existing_book:
        raise HTTPException(status_code=400, detail="Book with this ID already exists")
        
    db.books.insert_one(book.dict())
    return {"message": "Book added successfully"}