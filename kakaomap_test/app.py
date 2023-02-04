from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import certifi

ca = certifi.where()
client = MongoClient('mongodb+srv://a8sparta:naturecalls@cluster0.rtdxuho.mongodb.net/?retryWrites=true&w=majority',tlsCAFile=ca)
db = client.Naturecalls
collection = db["ToiletInfo"]
"""
import csv

with open("ToiletInfo.csv", 'r') as file:
    reader = csv.DictReader(file)
    data = [row for row in reader]
"""

#collection.insert_many(data)
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')


@app.route("/TeamProject1", methods=["POST"])
def homework_post():
    name_receive = request.form['name_give']
    comment_receive = request.form['comment_give']
    doc = {
        'name':name_receive,
        'comment':comment_receive
    }
    print(doc)
    db.fans.insert_one(doc)

    return jsonify({'msg': '응원 완료!'})


@app.route("/TeamProject1", methods=["GET"])
def homework_get():
    Toilet_list = list(db.ToiletInfo.find({}, {'_id': False}))
    return jsonify({'Toilets': Toilet_list})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
