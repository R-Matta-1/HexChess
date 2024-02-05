from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
import dotenv
from flask import Flask
from flask import render_template, redirect, make_response,url_for,request
from uuid import uuid4
dotenv.load_dotenv()

uri = os.environ.get('uri')
client = MongoClient( uri)

appDb = client.HexChess


#flask Start///////////////////////////////////////////
app = Flask(__name__)
app.secret_key = os.environ.get('key')

@app.route('/')
def root():
    response = make_response(redirect(url_for('login')))
    response.set_cookie('id','',max_age=0)
    response.set_cookie('username','',max_age=0)
    return response

@app.route("/play")
def home():
    if "username" in request.cookies:
        return render_template('index.html',id=request.cookies.get('id'))
    return redirect('/login')

@app.route("/login",methods=['GET','POST'])
def login():
    if request.method == 'POST':
        response = make_response( redirect(url_for('home')))
        username  = request.form['username']
        if len(username) >10 :
            response.set_cookie('username','')
            response.set_cookie('id',''  ,)
            return redirect(url_for('login'))
        else:
            response.set_cookie('username',username ,httponly=True)
            response.set_cookie('id',uuid4().hex    ,httponly=True)
            return response
    return render_template('login.html')

@app.route('/info')
def info():
    return render_template('info.html')
     
@app.route('/friends')
def friends():
    if 'username' in request.cookies:
        return 'friends menue'
    return redirect(login)

@app.route('/info/howToPlay')
def me():
    return 'nunya buisness'





if __name__ == '__main__':
    app.run(debug=True)

