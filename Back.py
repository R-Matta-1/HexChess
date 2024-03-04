import os
import pandas as pd
import dotenv
from random import randint
from flask_socketio import join_room, leave_room, send, SocketIO
from flask import Flask
from flask import render_template, redirect, make_response, url_for, request, session
from uuid import uuid4

dotenv.load_dotenv()

games = []
codes = []


def newCode():
    code = ""
    for i in range(1, 5):
        code += str(randint(0, 9))
    if code in codes:
        newCode()
    else:
        codes.append(code)
        return code
def swap(pos):
    if pos == 'w':
        return'b'
    if pos == 'b':
        return'w'
# flask Start///////////////////////////////////////////
app = Flask(__name__)

app.secret_key = os.environ.get("key")
socketio = SocketIO(app)


@app.route("/")
def root():
    session.clear()
    response = make_response(
        redirect(url_for("login", message="to start, please give yourself a name"))
    )
    response.set_cookie("id", "", max_age=0)
    response.set_cookie("username", "", max_age=0)
    return response


@app.route("/onlineList", methods=["GET", "POST", "FIND"])
def onlineList():
    session.clear()
    if "username" not in request.cookies:
        return redirect(url_for("login", message="need an acount to play"))
    if request.method == "GET":
        return render_template("onlineList.html", games=games)

    if request.method == "POST":
        if request.form["code"] == "" or None: #if you are makinf a game
            games.append(
                {
                    "time": request.form["time"],
                    "name": request.cookies.get("username", "noName"),
                    "public": request.form.get("public", "off"),
                    "code": newCode(),
                    "idOfCreator": request.cookies["id"]
                }
            )
            print(games)
            return redirect(url_for("giveSess", code=games[len(games) - 1]["code"]))
        else: # or you are joining
            return redirect(url_for("giveSess", code=request.form["code"]))


@app.route("/playSess/<code>")
def giveSess(code):
    if "username" not in request.cookies or "id" not in request.cookies:
        return redirect(url_for("login", message="need an acount to play"))
    if code not in codes:
        return redirect(url_for("login", message="that game dose not exist"))
    gameIndex = 0
    for i in range(len(games)): # find the index of the game
        if games[i]["code"] == code:
            gameIndex = i
            break
    else:   # if no code send error
        return redirect(
            url_for("login",
                message="that game dose not exist, or you entered into the game box while trying to create one",
            )
        ) 
    # else we have a good code, we now give our player session items
    session["game"] = code
    session["StartTime"] = games[gameIndex]['time']
    
    # now find, black and white
   
    sideSelect = 'fail'
    if int(code) % 2  == 0:
        sideSelect = 'w'
    else:
        sideSelect= 'b'
    if request.cookies.get("username", "noName") ==  games[gameIndex]['name']:
        sideSelect = swap(sideSelect)

    session["playerType"] = sideSelect
    print(f'\n\n\n{ session["playerType"]}, {sideSelect}\n\n\n')
    
    if request.cookies["id"] != games[gameIndex]["idOfCreator"]:
        del games[gameIndex]
    return redirect(url_for("play", mode="online"))


@app.route("/play/<mode>")
def play(mode):
    if mode == "local":
        return render_template("index.html", mode=mode, code="", time="10")

    if "username" not in request.cookies and mode != "local":
        return redirect(url_for("login", message="need an acount to play"))
    if session["game"] in codes:
        return render_template(
            "index.html",
            mode=mode,
            id=request.cookies.get("id"),
            code=session.get("game", "game no longer exists"),
            time=int(session.get("StartTime", "600")) // 60,
            side = session['playerType']
        )
    else:
        print(codes)
        print(games)
        return url_for("onlineList")


@app.route("/select")
def select():
    return render_template("selectGmode.html")  # make online locked if no name


@app.route("/login/<message>", methods=["GET", "POST"])
def login(message):
    if request.method == "POST":
        response = make_response(redirect(url_for("select")))
        username = request.form["username"]
        if len(username) <= 16 and len(username) > 5 and username.isalnum():
            response.set_cookie("username", username, httponly=True)
            response.set_cookie("id", uuid4().hex, httponly=True)
            return response
        else:
            response.set_cookie("username", "")
            response.set_cookie("id", "")
            return redirect(url_for("login", message="more then 5, less then 16, valid for .isalnum"
                )
            )

    return render_template("login.html", message=message)


@app.route("/info")
def info():
    return render_template("info.html")


@app.route("/info/howToPlay")
def me():
    return redirect('https://wikipedia.org/wiki/Hexagonal_chess#')


if __name__ == "__main__":
    socketio.run(app, debug=True)
