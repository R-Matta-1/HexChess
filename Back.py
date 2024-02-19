import os
import pandas as pd
import dotenv
from random import randint
from flask_socketio import join_room, leave_room, send, SocketIO
from flask import Flask
from flask import render_template, redirect, make_response,url_for,request , session
from uuid import uuid4
dotenv.load_dotenv()

games = []
codes = []
def findTime(gameCode): 
    for i in range(len(games)):
        if games[i]['code'] == gameCode:
            return games[i]['time']


def newCode():
    code = ''
    for i in range(1,5):
        code += str(randint(0,9))
    if code in codes:
        newCode()
    else:
        codes.append(code)
        return code
#flask Start///////////////////////////////////////////
app = Flask(__name__)

app.secret_key = os.environ.get('key')
socketio = SocketIO(app)

@app.route('/')
def root():
    session.clear()
    response = make_response(redirect(url_for('login', message = 'to start, please give yourself a name')))
    response.set_cookie('id','',max_age=0)
    response.set_cookie('username','',max_age=0)
    return response

@app.route('/onlineList', methods = ['GET','POST','FIND'])
def onlineList():
    session.clear()
    if "username" not in request.cookies:
        return redirect(url_for("login",message="need an acount to play"))
    if request.method == "GET":
        return render_template('onlineList.html',games = games)
    
    if request.method == 'POST':
        if request.form['code'] == '' or None:
            games.append({'time':request.form['time'],
                          'name':request.cookies.get('username','noName'),
                          'public':request.form.get('public','off'),
                          'code':newCode(),
                          'idOfCreator':request.cookies['id']})
            print(games)
            return redirect(url_for('giveSess',code =  games[len(games)-1]['code']))
        else:
            return redirect(url_for('giveSess',code =  request.form['code']))
            
@app.route('/playSess/<code>')
def giveSess(code):
    if "username" not in request.cookies or "id" not in request.cookies:
        return redirect(url_for("login",message="need an acount to play"))
    if code not in codes:
        return redirect(url_for('login', message = 'tjat game dosn.t exist'))
    gameIndex = 0
    for i in range(len(games)):
        if games[i]['code'] == code:
            gameIndex = i
            break
    else:
        return redirect(url_for('login', message = 'tjat game dosn.t exist'))
    
    session['game'] = code
    session['StartTime'] = findTime(code)
    #############################################
    if request.cookies['id']  != games[gameIndex]['idOfCreator']:
        del games[gameIndex]
    return redirect(url_for('play', mode = 'online'))

@app.route("/play/<mode>")
def play(mode):
    print('\n\n\n')
    print(games)
    print('\n\n\n')
    if "username" not in request.cookies and mode != "local":
        return redirect(url_for("login",message="need an acount to play"))

    return render_template('index.html',mode = mode, id=request.cookies.get('id'), 
                           code = session.get('game','game no longer exists'),
                           time =int(session.get('StartTime', '0')) // 60)

@app.route("/select")
def select():
    return render_template('selectGmode.html') # make online locked if no name


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
     

@app.route('/info/howToPlay')
def me():
    return 'Raphael Matta'





if __name__ == '__main__':
    socketio.run(app,debug=True)

