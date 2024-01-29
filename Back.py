from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
import dotenv
from flask import Flask
import flask
from flask import render_template

dotenv.load_dotenv()

uri = os.environ.get('uri')
client = MongoClient( uri)

appDb = client.HexChess


#flask Start///////////////////////////////////////////
app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html", name = 'user')

@app.route("/resp/<name>")
def react(name):
    return render_template('index.html',name = name)

if __name__ == "__main__":
    app.run(debug=True, port=8000)
    


