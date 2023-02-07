import certifi
from pymongo import MongoClient
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
ca = certifi.where()

# 원웅님 mongoDB에 연결하기
client = MongoClient(
    'mongodb+srv://a8sparta:naturecalls@cluster0.rtdxuho.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=ca)
db = client.Naturecalls
collection = db["ToiletInfo"]

# 랜딩페이지


@app.route('/')
def home():
    return render_template('index.html')
# 아름


@app.route('/report')
def report():
    return render_template('report/singo.html')

# 리뷰 보기 화면 (/review/view/화장실번호)


@app.route('/review/view/<toilet_num_receive>')
def review_view_page(toilet_num_receive):
    return render_template('review/view/review_view.html', toilet_num=toilet_num_receive)


# 리뷰 조회 API - 화장실 번호 받으면 해당 화장실에 해당하는 리뷰 전체 불러옴
@app.route('/api/review/view', methods=["GET"])
def review_view():
    toilet_num = request.args.get('toilet_num_give')
    reviews = list(db.ToiletReview.find(
        {'toilet_num': int(toilet_num), 'is_deleted': "no"}))
    return jsonify({'reviews': reviews})


# 리뷰 개별 조회 API - 리뷰 번호에 해당하는 리뷰 내용 받아옴 => 리뷰 수정/삭제시 리뷰의 비밀번호를 받아올 때 및 리뷰 수정 화면에 기존 내용 뿌려줄 때 사용
@app.route('/api/review/single_view', methods=["GET"])
def review_single_view():
    review_num = request.args.get('review_num_give')
    review = db.ToiletReview.find_one(
        {'_id': int(review_num), 'is_deleted': "no"})
    return jsonify({'review': review})


# 리뷰 작성 화면 (/review/write/화장실번호)
@app.route('/review/write/<toilet_num_receive>')
def review_write_page(toilet_num_receive):
    return render_template('review/write/review_write.html', toilet_num=toilet_num_receive)


# 리뷰 ID 구현을 위한 함수
def get_next_sequence():
    ret = db.ToiletReviewCounter.find_one_and_update(
        {"_id": "review_id"},
        {"$inc": {"seq": 1}},
        new=True
    )
    return ret['seq']


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

    total_score = int(cleanliness_receive) + \
        int(accessibility_receive) + int(equipment_receive)
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
        return jsonify({'msg': '리뷰 등록에 실패했습니다.'})

    else:
        return jsonify({'msg': '리뷰 등록이 완료되었습니다.'})


# 리뷰 수정 화면 (/review/edit/리뷰번호)
@app.route('/review/edit/<review_num_receive>')
def review_edit_page(review_num_receive):
    return render_template('review/edit/review_edit.html', review_num=review_num_receive)


# 수정한 리뷰 내용 다시 등록하는 API
@app.route("/api/review/edit/post", methods=['POST'])
def review_edit_post():
    review_num_receive = request.form['review_num_give']
    name_receive = request.form['name_give']
    password_receive = request.form['password_give']
    cleanliness_receive = request.form['cleanliness_give']
    accessibility_receive = request.form['accessibility_give']
    equipment_receive = request.form['equipment_give']
    text_receive = request.form['text_give']

    total_score = int(cleanliness_receive) + \
        int(accessibility_receive) + int(equipment_receive)
    overall_grade = round(total_score / 3, 2)

    try:
        db.ToiletReview.update_one({'_id': int(review_num_receive)},
                                   {'$set': {'name': name_receive, 'password': password_receive, 'cleanliness': int(cleanliness_receive),
                                             'accessibility': int(accessibility_receive), 'equipment': int(equipment_receive), 'overall_grade': overall_grade,
                                             'text': text_receive}
                                    })
    except:
        return jsonify({'msg': '리뷰 수정에 실패했습니다.'})

    else:
        return jsonify({'msg': '리뷰 수정이 완료되었습니다.'})


# 리뷰 내용 삭제하는 API
@app.route("/api/review/delete", methods=['POST'])
def review_delete():
    review_num_receive = request.form['review_num_give']

    try:
        db.ToiletReview.update_one({'_id': int(review_num_receive)}, {
                                   '$set': {'is_deleted': "yes"}})
    except:
        return jsonify({'msg': '리뷰 삭제에 실패했습니다.'})

    else:
        return jsonify({'msg': '리뷰 삭제가 완료되었습니다.'})

# 서울 전체 화장실 정보 GET


@app.route("/toiletInfo", methods=["GET"])
def toilet_get():
    toilet_list = list(db.ToiletInfo.find({}, {'_id': False}))
    return jsonify({'toilets': toilet_list})

# 내 주변 화장실 정보만 GET


@app.route("/neartoiletInfo", methods=["GET"])
def neartoilet_get():
    # y_wgs84_receive = request.form['y_wgs84_give']
    # x_wgs84_receive = request.form['x_wgs84_give']
    x = request.args.get('lng')
    y = request.args.get('lat')

    # 파리미터 문자열을  float으로 변환한 뒤에 calculate
    # 현재 db 위경도가 문자열로 존재. 타입매칭을 위해 계산값을 문자열로 변환
    # db를 그냥 decimal로 두는게 최적화에 좋음 (현재 타입변환하는 cost가 존재)
    min_x = str(float(x) - 0.008)
    max_x = str(float(x) + 0.008)
    min_y = str(float(y) - 0.008)
    max_y = str(float(y) + 0.008)

    try:
        # 조씨의 쿼리문으로 해당 위경도 사이값 쿼리
        toilet_list = list(db.ToiletInfo.find({"y_wgs84": {"$gt": min_y, "$lt": max_y}, "x_wgs84": {"$gt": min_x, "$lt": max_x}}, {'_id': False}))
        return jsonify({'toilets': toilet_list})
    except:
        return jsonify({'msg': '화장실 정보 조회에 실패하였습니다.'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
