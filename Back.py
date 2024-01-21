from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
import dotenv

dotenv.load_dotenv()
uri = os.environ.get('uri')

client = MongoClient( uri)

appDb = client.HexChess
baseGame = {
    "mode":"classic",
    "boardList":[[[7,10,9],[8,9,9]]],
    "white":"user1",
    "black":"user2",
}

for name in client.list_database_names():
    print(name)
    

