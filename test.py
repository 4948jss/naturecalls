import certifi
from pymongo import MongoClient
from flask import Flask


app = Flask(__name__)
ca = certifi.where()

# 원웅님 mongoDB에 연결하기
client = MongoClient('mongodb+srv://a8sparta:naturecalls@cluster0.rtdxuho.mongodb.net/?retryWrites=true&w=majority',tlsCAFile=ca)
db = client.Naturecalls

toilet_list = list(db.ToiletInfo.find({},{'_id':False}))

print(toilet_list)

