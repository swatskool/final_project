import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import psycopg2
from flask import Flask, jsonify, render_template, redirect
import datetime as dt
# make sure you have your own config on your computer in the SQL folder
from config import key

pg_user = 'postgres'
pg_pwd = key
pg_port = "5432"

database = 'roblox_db'
url = f"postgresql://{pg_user}:{pg_pwd}@localhost:{pg_port}/{database}"
engine = create_engine(f'{url}')
# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)
# Save reference to the table
game_table = Base.classes.games
video_table = Base.classes.videos
model_table = Base.classes.model_data


app = Flask(__name__)
#################################################
# Flask Routes
#################################################


@app.route("/")
def Index():
    return render_template("index.html")

@app.route("/predictor")
def predict():
    session = Session(engine)
    model_info = session.query(model_table).all()
    
    model_data = []
    
    for data in model_info:

        model_inputs = {}

        model = data.Title

        model_inputs= {
            'Title': model,
            'Age': data.Age,
            'Engagement Per Day': data.Engagement,
            'Title Words': data.Title_Words,
            'Desc Words': data.Desc_Words,
            'Category': bool(data.Category)
        }

        model_data.append(model_inputs)

    session.close()
    return (jsonify(model_data))


@app.route("/api")
def api():
    session = Session(engine)
    game_info = session.query(game_table).all()
    video_info = session.query(video_table).all()

    roblox_data = []
    roblox_dict = {}
    game = ""

    for data in game_info:

        game_data = {}

        game = data.game_title

        game_data = {
            'game_category': data.game_category,
            'game_id': data.game_id,
            'user_count': data.user_count,
            'positive_ratings': data.positive_ratings,
            'game_url': data.game_url,
            'game_image_url': data.game_image_url
        }
        video_info = session.query(video_table).filter(
            video_table.game_title == game).all()
        videos_list = []

        for video in video_info:

            video_data = {}

            if video.game_title == game:

                video_data = {
                    # 'game_title': video.game_title,
                    'video_name': video.video_name,
                    'yt_views': video.yt_views,
                    'yt_likes': video.yt_likes,
                    'yt_comments': video.yt_comments,
                    'yt_thumbnail': video.yt_thumbnail,
                    'video_url': video.video_url,
                    'pub_date': video.pub_date,
                }
                videos_list.append(video_data)
        
        roblox_dict = {
            'game': game,
            'game_data': game_data,
            'video_data': videos_list
        }

        roblox_data.append(roblox_dict)
        videos_list = []
    session.close()
    return (jsonify(roblox_data))


if __name__ == '__main__':
    app.run(debug=True)
