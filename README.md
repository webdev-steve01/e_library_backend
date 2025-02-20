# CloudShelf

CloudShelf is an e-library platform built as a group project for our school. It enables users to:

- Browse a collection of books
- Add books to their library
- Mark books as favorites
- Read books
- Keep track of their reading history

## Tech Stack

- **Frontend:** Next.js
- **Backend:** FastAPI (Python 3)
- **Database:** MongoDB
- **Authentication:** Firebase

## Limitations

Currently, the platform lacks the ability to remove books from favorites, history, or library due to limitations in the backend endpoints. Future development will address these issues.

## Running the Backend Server

To run the backend server, follow these steps:

1. Ensure MongoDB is running locally or on the cloud.
2. Install dependencies:
   ```bash
   pip install fastapi uvicorn pymongo
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   uvicorn main:app --reload
   ```
4. The API will be available at `http://localhost:8000`
5. Interactive API documentation can be accessed at `http://localhost:8000/docs`

## Running the Frontend Server

Navigate to the `e-library` folder and start the frontend server:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm run dev
   ```
3. The frontend will be available at `http://localhost:3000`

## Future Enhancements

- Implement remove functionality for favorites, history, and library.
- Improve UI/UX.
- Add more authentication features.

---

Developed as a school project by our team. 🚀
