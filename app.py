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

# 랜딩페이지
@app.route('/')
def home():
    return render_template('index.html')
#아름
@app.route('/report')
def report():
    return render_template('report/singofin.html')

# 리뷰 작성 화면 (/review/write/화장실번호)
@app.route('/review/write/<toilet_num_receive>')
def review_write_page(toilet_num_receive):
    return render_template('/review/write/review_write.html', toilet_num=toilet_num_receive)


# 리뷰 등록 API
@app.route("/api/review/write", methods=["POST"])
def review_post():
    review_id = get_next_sequence()

    toilet_num_receive = request.form['toilet_num_give']
    name_receive = request.form['name_give']
    password_receive = request.form['password_give']
    cleanliness_receive = request.form['cleanliness_give']
    accessibility_receive = request.form['accessibility_give']
    equipment_receive = request.form['equipment_give']
    text_receive = request.form['text_give']

    total_score = int(cleanliness_receive) + int(accessibility_receive) + int(equipment_receive)
    overall_grade = round(total_score / 3, 2)

    review = {
        '_id': review_id,
        'is_deleted': 'no',
        'toilet_num': int(toilet_num_receive),
        'name': name_receive,
        'password': password_receive,
        'cleanliness': int(cleanliness_receive),
        'accessibility': int(accessibility_receive),
        'equipment': int(equipment_receive),
        'overall_grade': overall_grade,
        'text': text_receive,
    }

    try:
        db.ToiletReview.insert_one(review)

    except:
        print(review)
        return jsonify({'msg': '리뷰 등록에 실패했습니다.'})

    else:
        print(review)
        return jsonify({'msg': '리뷰 등록이 완료되었습니다.'})


# 리뷰 ID 구현을 위한 함수
def get_next_sequence():
    ret = db.ToiletReviewCounter.find_one_and_update(
        {"_id": "review_id"},
        {"$inc": {"seq": 1}},
        new=True
    )
    return ret['seq']

# 테스트 화장실 정보 GET
@app.route("/toiletInfo", methods=["GET"])
def toilet_get():
    toilet_list = list(db.ToiletInfo.find({},{'_id':False}))
    return jsonify({'toilets': toilet_list})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)