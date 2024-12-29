from pymongo import MongoClient
from typing import List, Optional
import os

connection_string = os.environ.get('DATABASE_URL')


# MongoDB connection (using localhost for prototype)
client = MongoClient('connection_string')
db = client['elibrary']

