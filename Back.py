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
    response = make_response(redirect(url_for('login', message = 'to start, please make a acount. iether a name or real acount would work')))
    response.set_cookie('id','',max_age=0)
    response.set_cookie('username','',max_age=0)
    return response

@app.route('/onlineList/<mode>', methods = ['GET','POST'])
def onlineList(mode):
    if "username" not in request.cookies :
        return redirect(url_for("login",message="need an acount to play"))
    if request.method == 'POST':
        #mongo mongo mongo
        print(request.form['name'])
        print(request.form['time'])
        return render_template('onlineList.html',mode = 'find' )
        
    return render_template('onlineList.html',mode = mode)

@app.route("/play/<mode>")
def play(mode):
    if "username" not in request.cookies and mode != "local":
        return redirect(url_for("login",message="need an acount to play"))
    
    return render_template('index.html',mode = mode, id=request.cookies.get('id'))

@app.route("/select")
def select():
    return render_template('selectGmode.html')


@app.route("/login/<message>",methods=['GET','POST'])
def login(message):
    if request.method == 'POST':
        response = make_response( redirect(url_for('select')))
        username  = request.form['username']
        if len(username) <= 16 and len(username)>5 and username.isalnum() :
            response.set_cookie('username',username ,httponly=True)
            response.set_cookie('id',uuid4().hex    ,httponly=True)
            return response
        else:        
            response.set_cookie('username','')
            response.set_cookie('id',''  )
            return redirect(url_for('login',message = "more then 5, less then 16, valid for .isalnum"))


    return render_template('login.html',message=message)

@app.route('/info')
def info():
    return render_template('info.html')
     
@app.route('/friends')
def friends():
    if 'username' in request.cookies:
        return 'friends menue'
    else:
        return redirect(url_for('login',message = 'need acount to friend'))

@app.route('/info/howToPlay')
def me():
    return 'nunya buisness'





if __name__ == '__main__':
    app.run(debug=True)

