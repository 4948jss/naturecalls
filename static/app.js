const mapContainer = document.getElementById("map"); // 지도를 표시할 div
const mapOption = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
    level: 4, // 지도의 확대 레벨
};
// 테스트용커밋
//전역변수 설정
var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
myLocation();//현위치에서 시작


// 지도에 마커를 표시하는 함수입니다
function displayMarker(data) {
    //이미지src
    var imageSrc =
        "static/mapmarker.png";
    //이미지 size
    var imageSize = new kakao.maps.Size(50, 50);

    // 마커 이미지 생성
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    //마커 생성
    var marker = new kakao.maps.Marker({
        image: markerImage, // 마커 이미지
        map: map,
        position: data.latlng
    });

    //커스텀 오버레이 표시
    var overlay = new kakao.maps.CustomOverlay({
        yAnchor: 1,
        position: marker.getPosition()
    });

    //content표시
    var content = document.createElement('div');
    content.innerHTML = data.content;
    content.className = 'overlay';

    //닫기버튼
    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '닫기';//버튼내용삽입
    closeBtn.onclick = function () {
        overlay.setMap(null);
    };
    closeBtn.className = 'close'//버튼 클래스 부여(css사용)
    content.appendChild(closeBtn);//버튼 붙이기

    //리뷰보기 버튼
    var reviewRBtn = document.createElement('button');
    reviewRBtn.innerHTML = '리뷰보기';//버튼내용삽입
    reviewRBtn.onclick = function () {
        location.href = '/review/view/' + data['toilet_num'];//이동 경로
    };
    reviewRBtn.className = 'review'//버튼 클래스 부여(css사용)
    content.appendChild(reviewRBtn);//버튼 붙이기

    //리뷰쓰기 버튼
    var reviewWeBtn = document.createElement('button');
    reviewWeBtn.innerHTML = '리뷰쓰기';//버튼내용삽입
    reviewWeBtn.onclick = function () {
        location.href = '/review/write/' + data['toilet_num'];//이동 경로
    };
    reviewWeBtn.className = 'reviewWeBtn'//버튼 클래스 부여(css사용)
    content.appendChild(reviewWeBtn);//버튼 붙이기

    //신고하기버튼
    var reportBtn = document.createElement('button');
    reportBtn.innerHTML = '신고하기';//버튼내용삽입
    reportBtn.onclick = function () {
        location.href = '/report';//이동 경로
    };
    reportBtn.className = 'reportBtn'//버튼 클래스 부여(css사용)
    content.appendChild(reportBtn);//버튼 붙이기

    overlay.setContent(content);

    kakao.maps.event.addListener(marker, 'click', function () {
        overlay.setMap(map);
    });
}

function myLocation() {
    // geolocation API를 사용하여 현재 위치 얻어오기
    navigator.geolocation.getCurrentPosition(function (position) {
        // 현재 위치의 위도와 경도 __ 오차범위가 현재 매우 큰 상태
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        // 현재 위치의 위도와 경도 __ 오차범위가 현재 매우 큰 상태
        mylat = position.coords.latitude;
        mylng = position.coords.longitude;

        // 지도 표시
        const location = new kakao.maps.LatLng(lat, lng);

        // 현재 위치에 마커 표시 __ location 좌표로 이동 및 마커 설정
        map.setCenter(location);
        const marker = new kakao.maps.Marker({
            map: map, // => 전역변수 값 사용
            position: new kakao.maps.LatLng(lat, lng),
        });
    });
}

function getToilet() {
    var latlng = map.getCenter();
    mylat = latlng.getLat();
    mylng = latlng.getLng();

    //화장실 데이터 받아오기
    // 현재 해당 api는 현재 위치의 좌표값으로 받아오는 형태가 아님
    // 현재 좌표 기준으로 범위의 리스트를 get할수 있는 api를 찾거나,
    // 모든 데이터를 저장 및 노출하는 step이 필요 => 어떤기준으로 리스트를 주는지 불명확 => 현재위치 기준의 화장실들이 없는 경우 발생
    $.ajax({
        type: "GET",
        url: "/toiletInfo",
        data: {},
        success: function (response) {
            // api 성공시 로직

            // 화장실 데이터 리스트 생성
            const data = response['toilets'];
            let positions = [];

            for (i = 0; i < data.length; i++) {
                if ((data[i]["y_wgs84"] < mylat + 0.01 && data[i]["y_wgs84"] > mylat - 0.01) && (data[i]["x_wgs84"] < mylng + 0.01 && data[i]["x_wgs84"] > mylng - 0.01)) {


                    const position = {};
                    position["content"] = '<div class="wrap">' +
                        '    <div class="info">' +
                        '        <div class="title">' + data[i]["toilet_num"] + " : " + data[i]["toilet_name "] + '</div>' +
                        '        <div class="body">' +
                        '            <div class="desc">' +
                        '                <div class="text">' + "구분 : " + data[i]["toilet_class "] + '</div>' +
                        '                <div class="text">' + "지번주소 : " + data[i]["jibunAddr"] + '</div>' +
                        '                <div class="text">' + "도로명주소 : " + data[i]["roadAddr"] + '</div>' +
                        '                <div class="text">' + "관리자 : " + data[i]["toilet_manager "] + '</div>' +
                        '                <div class="text">' + "전화번호 : " + data[i]["toilet_phone"] + '</div>' +
                        '                <div class="text">' + "CCTV : " + data[i]["toilet_cctv "] + '</div>' +
                        '                <div class="text">' + "신고벨 : " + data[i]["toilet_bell "] + '</div>' +
                        '                <div class="text">' + "장애인 화장실 : " + data[i]["toilet_disabled "] + '</div>' +
                        '                <div class="text">' + "기저귀 교환대 : " + data[i]["toilet_diaper "] + '</div>' +
                        '                <div class="text">' + data[i]["y_wgs84"] + "    " + data[i]["x_wgs84"] + '</div>' +
                        '            </div>' +
                        '        </div>' +
                        '    </div>' +
                        '</div>';
                    position["latlng"] = new kakao.maps.LatLng(data[i]["y_wgs84"], data[i]["x_wgs84"]);
                    position["toilet_num"] = data[i]["toilet_num"]; // 마커 생성시 화장실 번호를 추가로 같이 넘겨주도록 함
                    positions.push(position);


                    for (let i = 0; i < positions.length; i++) {
                        var toilet = positions[i];
                        displayMarker(toilet);
                    }
                }
            }
        },
    });

}

// toilettest 불러오기
// function testToilet() {
//     console.log("버튼 눌렀음")
//     $.ajax({
//         type: 'GET',
//         url: '/toiletInfo',
//         data: {},
//         success: function (response) {
//             let rows = response['toilets']
//             for (let i = 0; i < rows.length; i++) {
//                 let num = rows[i]['toilet_num']
//                 let toiletName = rows[i]['toilet_name']
//                 let x = rows[i]['x_wgs84']
//                 let y = rows[i]['y_wgs84']
//                 let addr_r = rows[i]['toilet_address_road']
//                 let addr_j = rows[i]['toilet_address_jibun']
//                 let toiletclass = rows[i]['toilet_class']
//                 let manager = rows[i]['toilet_manager']
//                 let phone = rows[i]['toilet_phone']
//                 let optime = rows[i]['toilet_optime']
//                 let disabled = rows[i]['toilet_disabled']
//                 let diaper = rows[i]['toilet_diaper']
//                 let cctv = rows[i]['toilet_cctv']
//
//                 console.log(num, toiletName, x, y)
//             }
//         }
//     })
// }

// 지우지말것 공공api에서 불러온 데이터 바탕으로 화장실 마커 생성하는 ajax코드
// $.ajax({
//             type: "GET",
//             url: "http://openapi.seoul.go.kr:8088/6b716f6a533439343237426a4d7a75/json/SearchPublicToiletPOIService/1/30/",
//             data: {},
//             success: function (response) {
//                 // api 성공시 로직
//
//                 // 화장실 데이터 리스트 생성
//                 const data = response["SearchPublicToiletPOIService"]["row"];
//                 let positions = [];
//
//                 for (var i in data) {
//                     const position = {};
//                     position["FNAME"] = data[i]["FNAME"];
//                     position["latlng"] = new kakao.maps.LatLng(
//                         data[i]["Y_WGS84"],
//                         data[i]["X_WGS84"]
//                     );
//                     positions.push(position);
//                 }
//
//                 // 화장실 마커 생성
//                 if (positions.length > 0) {
//                     var imageSrc =
//                         "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
//
//                     for (var i = 0; i < positions.length; i++) {
//                         // spread
//                         const {FNAME, latlng} = positions[i];
//
//                         // 마커 이미지 크기
//                         var imageSize = new kakao.maps.Size(24, 35);
//
//                         // 마커 이미지 생성
//                         var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
//
//                         // 마커 생성
//                         const marker = new kakao.maps.Marker({
//                             map: map, // 지도 => 전역변수 값 사용
//                             position: latlng, // 마커 표시 위치
//                             title: FNAME, // 마커 타이틀
//                             image: markerImage, // 마커 이미지
//                         });
//                     }
//                 } else {
//                     // 데이터가 없을 경우,
//                     alert("현재위치에 화장실이 없습니다.");
//                     return;
//                 }
//             },
//         });