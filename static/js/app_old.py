from flask import Flask, render_template, request, jsonify
import pickle
from nltk.corpus import stopwords
from nltk.tag import pos_tag
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import TweetTokenizer
from config import key

pg_user = 'pboxloirkjoupo'
pg_pwd = key
pg_port = "5432"

database = 'd56rcfsun0ardt'
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

with open ('lrmodel.joblib','rb') as f :
    lr = joblib.load(f)


app = Flask(__name__)
#################################################
# Flask Routes
#################################################


@app.route("/")
def Index():
    return render_template("index.html")


@app.route("/predictor", methods=["GET", "POST"])
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
#     return (jsonify(model_data))
# def model_prediction():
    if request.method == "POST":
        title_text = [request.form[title_text]]
        descr_text = [request.form[description_text]]
        age = 0
        engage = 0
        

        engagement = lr.predict([[age,engage,title_text,descr_text]])

        if engagement:
            out_text =  "Your game has the potential to be ENGAGING"
        else:
            out_text = "Your game may NOT be engaging enough yet !"
        return out_text


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
