import certifi
import csv
from pymongo import MongoClient
from flask import Flask, render_template, request, jsonify, send_from_directory

app = Flask(__name__)
ca = certifi.where()

# 원웅님 mongoDB에 연결하기
client = MongoClient('mongodb+srv://a8sparta:naturecalls@cluster0.rtdxuho.mongodb.net/?retryWrites=true&w=majority',tlsCAFile=ca)
db = client.Naturecalls
collection = db["ToiletInfo"]

# branch git remote push test
# branch git remote push test2