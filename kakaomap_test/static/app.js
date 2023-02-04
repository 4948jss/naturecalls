var mapContainer = document.getElementById('map'), // 지도의 중심좌표
    mapOption = {
        center: new kakao.maps.LatLng(33.451475, 126.570528), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

var positions = [
    {
        content: '<div class="wrap">' +
            '<div class="info">' +
            '<div class="title">{toilet_name}</div>' +
            '<div class="body">' +
            '<div class="desc">' +
            '<div class="text">화장실 번호 : {toilet_num}</div>' +
            '<div class="jibun ellipsis">주소 : {toilet_address}</div>' +
            '<div class="text">화장실 분류 : {toilet_class}</div>' +
            '<div class="text">화장실 담당자 : {toilet_manager}</div>' +
            '<div class="link">전화번호 : {toilet_phone}</div>' +
            '<div class="text">화장실 운영시간 : {toilet_optime}</div>' +
            '<div class="text">화장실 cctv : {toilet_cctv}</div>' +
            '<div class="text">화장실 bell : {toilet_bell}</div>' +
            '<div class="text">장애인 화장실 : {toilet_disabled}</div>' +
            '<div class="text">기저귀교환대 : {toilet_diaper}</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'
        ,
        latlng: new kakao.maps.LatLng(33.450705, 126.570677)
    },
    {
        content: '생태연못',
        latlng: new kakao.maps.LatLng(33.450936, 126.569477)
    },
    {
        content: '텃밭',
        latlng: new kakao.maps.LatLng(33.450879, 126.569940)
    },
    {
        content: '근린공원',
        latlng: new kakao.maps.LatLng(33.451393, 126.570738)
    }
];

for (let i = 0; i < positions.length; i++) {
    var data = positions[i];
    displayMarker(data);
}

// 지도에 마커를 표시하는 함수입니다
function displayMarker(data) {
    var marker = new kakao.maps.Marker({
        map: map,
        position: data.latlng
    });
    var overlay = new kakao.maps.CustomOverlay({//커스텀 오버레이 표시
        yAnchor: 1,
        position: marker.getPosition()
    });

    var content = document.createElement('div');//content표시
    content.innerHTML = data.content;
    content.className = 'overlay';

    var closeBtn = document.createElement('button');//닫기버튼
    closeBtn.innerHTML = '닫기';
    closeBtn.onclick = function () {
        overlay.setMap(null);
    };
    closeBtn.className = 'close'
    content.appendChild(closeBtn);

    var review_wBtn = document.createElement('button');//리뷰작성버튼넣기
    review_wBtn.innerHTML = '리뷰작성';
    review_wBtn.onclick = function () {
        overlay.setMap(null);
    };
    review_wBtn.className = 'close' //바꿔야함
    content.appendChild(review_wBtn);

    var reviewBtn = document.createElement('button');//리뷰보기버튼넣기
    reviewBtn.innerHTML = '리뷰보기';
    reviewBtn.onclick = function () {
        overlay.setMap(null);
    };
    reviewBtn.className = 'close' //바꿔야함
    content.appendChild(reviewBtn);

    var reportBtn = document.createElement('button');//리뷰보기버튼넣기
    reportBtn.innerHTML = '리뷰보기';
    reportBtn.onclick = function () {
        overlay.setMap(null);
        //onClick="location.href='PAGENAME.html'
    };
    reportBtn.className = 'close' //바꿔야함
    content.appendChild(reportBtn);


    overlay.setContent(content);

    kakao.maps.event.addListener(marker, 'click', function () {
        overlay.setMap(map);
    });
}