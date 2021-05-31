import numpy as np
import requests
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import psycopg2
from flask import Flask, render_template, request, jsonify
import pickle
from nltk.corpus import stopwords
from nltk.tag import pos_tag
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import TweetTokenizer
import re


url = "postgres://pboxloirkjoupo:04094f4b3c94d1ac4ebe22d906c08a8f3cca3b9f1dc6d2e15fe9aed7febc70bd@ec2-52-0-114-209.compute-1.amazonaws.com:5432/d56rcfsun0ardt"
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

models = {'vpd.sav': 'Visitors Per Day',
        'lpd.sav': 'Likes Per Day',
        'dpd.sav': 'Dislikes Per Day',
        'rpd.sav': 'Ratings Per Day',
        'fpd.sav': 'Favorites Per Day'}
input_columns = ['Title length',
			   'Desc length',
			   'Maximum Visits',
			   'Title+Description']

with open('../../models/vpd.sav', 'rb') as f:
	vpd_rfr = pickle.load(f)
with open('../../models/lpd.sav', 'rb') as f:
	lpd_rfr = pickle.load(f)
with open('../../models/dpd.sav', 'rb') as f:
	dpd_rfr = pickle.load(f)
with open('../../models/rpd.sav', 'rb') as f:
	rpd_rfr = pickle.load(f)
with open('../../models/fpd.sav', 'rb') as f:
	fpd_rfr = pickle.load(f)
with open('../../models/gc_awards.sav', 'rb') as f:
	awards_rfr = pickle.load(f)
with open('../../models/text_vectorizer.sav', 'rb') as f:
	cvt = pickle.load(f)


def data_cleaning(text_list):
    stopwords_rem = True
    stopwords_en = stopwords.words('english')
    lemmatizer = WordNetLemmatizer()
    tokenizer = TweetTokenizer()
    reconstructed_list = []
    for each_text in text_list:
        lemmatized_tokens = []
        tokens = tokenizer.tokenize(each_text.lower())
        pos_tags = pos_tag(tokens)
        for each_token, tag in pos_tags:
            if tag.startswith('NN'):
                pos = 'n'
            elif tag.startswith('VB'):
                pos = 'v'
            else:
                pos = 'a'
            lemmatized_token = lemmatizer.lemmatize(each_token, pos)
            if stopwords_rem:  # False
                if lemmatized_token not in stopwords_en:
                    lemmatized_tokens.append(lemmatized_token)
            else:
                lemmatized_tokens.append(lemmatized_token)
        reconstructed_list.append(' '.join(lemmatized_tokens))
    return reconstructed_list


def deEmojify(text):
    regrex_pattern = re.compile(pattern="["
        u"\U0001F600-\U0001F64F"  # emoticons
        u"\U0001F300-\U0001F5FF"  # symbols & pictographs
        u"\U0001F680-\U0001F6FF"  # transport & map symbols
        u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                           "]+", flags=re.UNICODE)
    output = regrex_pattern.sub(r' ', text).replace(
        '\n', '').replace('[', '').replace(']', '').replace('\r', '')
    return output
# app = Flask(__name__)
#################################################
# Flask Routes
#################################################


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


@app.route('/')
def home():
	return render_template('/index.html')


@app.route('/predict', methods=['GET', 'POST'])
def predict():
	inputs = request.form
	title = deEmojify(inputs['title'])
	description = deEmojify(inputs['description'])
	title_length = len(title)
	description_length=len(description)
	max_visits=int(inputs['max_visits'])
	title_description=data_cleaning([title+" "+description])
	title_description_vector=cvt.transform(title_description).toarray()[0].tolist()
	input_ary=[title_length, 
			   description_length, 
			   max_visits]+title_description_vector
	# return jsonify({'Visitors Per Day': vpd})
	output_dict={'vpd': round(vpd_rfr.predict([input_ary])[0]), 
				 'lpd': round(lpd_rfr.predict([input_ary])[0]), 
				 'dpd': round(dpd_rfr.predict([input_ary])[0]), 
				 'rpd': round(rpd_rfr.predict([input_ary])[0]), 
				 'fpd': round(fpd_rfr.predict([input_ary])[0])}
	awards_count=awards_rfr.predict([list(output_dict.values())])[0]
	return render_template('index.html', **output_dict, awards_in_template=round(awards_count))

if __name__ == '__main__':
    app.run(debug=True)
