from flask import Flask, render_template, request, jsonify
import pickle
from nltk.corpus import stopwords
from nltk.tag import pos_tag
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import TweetTokenizer

app=Flask(__name__)

models={'vpd.sav': 'Visitors Per Day', 
        'lpd.sav': 'Likes Per Day', 
        'dpd.sav': 'Dislikes Per Day',
        'rpd.sav': 'Ratings Per Day', 
        'fpd.sav': 'Favorites Per Day'}
input_columns=['Title length', 
			   'Desc length', 
			   'Maximum Visits', 
			   'Title+Description']

with open('models/vpd.sav', 'rb') as f: 
	vpd_rfr=pickle.load(f)
with open('models/lpd.sav', 'rb') as f: 
	lpd_rfr=pickle.load(f)
with open('models/dpd.sav', 'rb') as f: 
	dpd_rfr=pickle.load(f)
with open('models/rpd.sav', 'rb') as f: 
	rpd_rfr=pickle.load(f)	
with open('models/fpd.sav', 'rb') as f: 
	fpd_rfr=pickle.load(f)
with open('models/gc_awards.sav', 'rb') as f: 
	awards_rfr=pickle.load(f)
with open('models/text_vectorizer.sav', 'rb') as f: 
	cvt=pickle.load(f)

def data_cleaning(text_list): 
    stopwords_rem=False
    stopwords_en=stopwords.words('english')
    lemmatizer=WordNetLemmatizer()
    tokenizer=TweetTokenizer()
    reconstructed_list=[]
    for each_text in text_list: 
        lemmatized_tokens=[]
        tokens=tokenizer.tokenize(each_text.lower())
        pos_tags=pos_tag(tokens)
        for each_token, tag in pos_tags: 
            if tag.startswith('NN'): 
                pos='n'
            elif tag.startswith('VB'): 
                pos='v'
            else: 
                pos='a'
            lemmatized_token=lemmatizer.lemmatize(each_token, pos)
            if stopwords_rem: # False 
                if lemmatized_token not in stopwords_en: 
                    lemmatized_tokens.append(lemmatized_token)
            else: 
                lemmatized_tokens.append(lemmatized_token)
        reconstructed_list.append(' '.join(lemmatized_tokens))
    return reconstructed_list

@app.route('/')
def home(): 
	return render_template('index.html')

@app.route('/predict', methods=['GET', 'POST'])
def predict(): 
	inputs=request.form
	title_length=len(inputs['title'])
	description_length=len(inputs['description'])
	max_visits=int(inputs['max_visits'])
	title_description=data_cleaning([inputs['title']+" "+inputs['description']])
	title_description_vector=cvt.transform(title_description).toarray()[0].tolist()
	input_ary=[title_length, 
			   description_length, 
			   max_visits]+title_description_vector
	# return jsonify({'Visitors Per Day': vpd})
	output_dict={'vpd': vpd_rfr.predict([input_ary])[0], 
				 'lpd': lpd_rfr.predict([input_ary])[0], 
				 'dpd': dpd_rfr.predict([input_ary])[0], 
				 'rpd': rpd_rfr.predict([input_ary])[0], 
				 'fpd': fpd_rfr.predict([input_ary])[0]}
	awards_count=awards_rfr.predict([list(output_dict.values())])[0]
	return render_template('index.html', **output_dict, awards_in_template=awards_count)

if __name__ == '__main__':
    app.run(debug=True)
