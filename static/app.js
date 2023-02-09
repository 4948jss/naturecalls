const mapContainer = document.getElementById("map"); // 지도를 표시할 div
const mapOption = {
    center: new kakao.maps.LatLng(37.566783, 126.978643), // 지도의 중심좌표
    level: 4, // 지도의 확대 레벨
};
try {
    var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
    myLocation();//현위치에서 시작
} catch{
    var errordiv = document.createElement("div");
    errordiv.innerHTML = "카카오맵을 불러올 수 없습니다.";
}

let currentMarker;


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
    closeBtn.className = 'overBtn'//버튼 클래스 부여(css사용)
    content.appendChild(closeBtn);//버튼 붙이기

    //리뷰보기 버튼
    var reviewRBtn = document.createElement('button');
    reviewRBtn.innerHTML = '리뷰보기';//버튼내용삽입
    reviewRBtn.onclick = function () {
        location.href = '/review/view/' + data['toilet_num'];//이동 경로
    };
    reviewRBtn.className = 'overBtn'//버튼 클래스 부여(css사용)
    content.appendChild(reviewRBtn);//버튼 붙이기

    //리뷰쓰기 버튼
    var reviewWeBtn = document.createElement('button');
    reviewWeBtn.innerHTML = '리뷰쓰기';//버튼내용삽입
    reviewWeBtn.onclick = function () {
        location.href = '/review/write/' + data['toilet_num'];//이동 경로
    };
    reviewWeBtn.className = 'overBtn'//버튼 클래스 부여(css사용)
    content.appendChild(reviewWeBtn);//버튼 붙이기

    //신고하기버튼
    var reportBtn = document.createElement('button');
    reportBtn.innerHTML = '신고하기';//버튼내용삽입
    reportBtn.onclick = function () {
        location.href = '/report';//이동 경로
    };
    reportBtn.className = 'overBtn'//버튼 클래스 부여(css사용)
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
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // 현재 위치의 위도와 경도 __ 오차범위가 현재 매우 큰 상태
        mylat = position.coords.latitude;
        mylng = position.coords.longitude;

        // 지도 표시
        const location = new kakao.maps.LatLng(lat, lng);

        // 현재 위치에 마커 표시 __ location 좌표로 이동 및 마커 설정
        map.panTo(location);

        if(currentMarker){
            currentMarker.setPosition(location)
        }else {
            const marker = new kakao.maps.Marker({
                map: map, // => 전역변수 값 사용
                position: location,
            });
            currentMarker = marker
        }
    });
}

function getToilet() {
    const latlng = map.getCenter();
    mylat = latlng.getLat();
    mylng = latlng.getLng();

    //화장실 데이터 받아오기
    // 현재 해당 api는 현재 위치의 좌표값으로 받아오는 형태가 아님
    // 현재 좌표 기준으로 범위의 리스트를 get할수 있는 api를 찾거나,
    // 모든 데이터를 저장 및 노출하는 step이 필요 => 어떤기준으로 리스트를 주는지 불명확 => 현재위치 기준의 화장실들이 없는 경우 발생
    $.ajax({
        type: "GET",
        url: "/neartoiletInfo",
        data: {
            lat: latlng.getLat(),
            lng: latlng.getLng(),
        },
        // url: "/toiletInfo",
        // data: {},
        success: function (response) {
            // api 성공시 로직

            // 화장실 데이터 리스트 생성
            const data = response['toilets'];
            let positions = [];

            for (i = 0; i < data.length; i++) {
                const cctv = data[i]["toilet_cctv "] == "Y" ? " 📷O " : " 📷X "
                const bell = data[i]["toilet_bell "] == "Y" ? " 🚨O " : " 🚨X "
                const disabled = data[i]["toilet_disabled "] == "Y" ? " ♿O " : " ♿X "
                const diaper = data[i]["toilet_diaper "] == "Y" ? " 🚼O " : " 🚼X "
                const position = {};
                // 성원님 이 부분부터 수정하시면 됩니다//
                position["content"] = '<div class="infoWrap">' +
                        '    <div class="infoBox">' +
                        '        <div class="infoBox-title">' + data[i]["toilet_name "] + '</div>' +
                        '            <ul class="infoBox-ul">' +
                        '                <li class="infoBox-li">' + "구분 : " + data[i]["toilet_class "] + '</li>' +
                        '                <li class="infoBox-li">' + "지번주소 : " + data[i]["jibunAddr"] + '</li>' +
                        '                <li class="infoBox-li">' + "도로명주소 : " + data[i]["roadAddr"] + '</li>' +
                        '                <li class="infoBox-li">' + "관리자 : " + data[i]["toilet_manager "] + '</li>' +
                        '                <li class="infoBox-li">' + "전화번호 : " + data[i]["toilet_phone"] + '</li>' +
                        '<div class="infoBox-infoGroup">' + cctv + bell + disabled + diaper + '</div>' +
                        '            </ul>' +
                        '    </div>' +
                        '</div>';
                position["latlng"] = new kakao.maps.LatLng(data[i]["y_wgs84"], data[i]["x_wgs84"]);
                position["toilet_num"] = data[i]["toilet_num"]; // 마커 생성시 화장실 번호를 추가로 같이 넘겨주도록 함
                positions.push(position);
            }

            for (let i = 0; i < positions.length; i++) {
                let toilet = positions[i];
                displayMarker(toilet);
            }
        },
    });
}

