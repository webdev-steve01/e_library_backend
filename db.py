from motor.motor_asyncio import AsyncIOMotorClient

#MongoDB connection string
MONGO_URL = "mongodb://localhost:27017"

client = AsyncIOMotorClient(MONGO_URL)
database = client.elibrary
users_collection = database.get_collection("users")  #crete a 'users' collection
books_collection = database.get_collection("books") # create a 'books' collection