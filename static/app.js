const mapContainer = document.getElementById("map"); // 지도를 표시할 div
const mapOption = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
    level: 3, // 지도의 확대 레벨
};
// 테스트용커밋
//전역변수 설정
var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

function myLocation() {
    // geolocation API를 사용하여 현재 위치 얻어오기
    navigator.geolocation.getCurrentPosition(function (position) {
        // 현재 위치의 위도와 경도 __ 오차범위가 현재 매우 큰 상태
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        // 지도 표시
        const location = new kakao.maps.LatLng(lat, lng);

        // 현재 위치에 마커 표시 __ location 좌표로 이동 및 마커 설정
        map.setCenter(location);
        const marker = new kakao.maps.Marker({
            map: map, // => 전역변수 값 사용
            position: new kakao.maps.LatLng(lat, lng),
        });

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

                for (var i in data) {
                    const position = {};
                    position["toiletnum"] = data[i]["toilet_num"];
                    position["roadaddr"] = data[i]["roadAddr"];
                    position["latlng"] = new kakao.maps.LatLng(
                        data[i]["y_wgs84"],
                        data[i]["x_wgs84"]
                    );
                    positions.push(position);
                }

                // 화장실 마커 생성
                if (positions.length > 0) {
                    var imageSrc =
                        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

                    for (var i = 0; i < positions.length; i++) {
                        // spread
                        const {FNAME, latlng} = positions[i];

                        // 마커 이미지 크기
                        var imageSize = new kakao.maps.Size(24, 35);

                        // 마커 이미지 생성
                        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

                        // 마커 생성
                        const marker = new kakao.maps.Marker({
                            map: map, // 지도 => 전역변수 값 사용
                            position: latlng, // 마커 표시 위치
                            title: FNAME, // 마커 타이틀
                            image: markerImage, // 마커 이미지
                        });
                    }
                } else {
                    // 데이터가 없을 경우,
                    alert("현재위치에 화장실이 없습니다.");
                    return;
                }
            },
        });
    });
}

// toilettest 불러오기
function testToilet() {
    console.log("버튼 눌렀음")
    $.ajax({
        type: 'GET',
        url: '/toiletInfo',
        data: {},
        success: function (response) {
            let rows = response['toilets']
            for (let i = 0; i < rows.length; i++) {
                let num = rows[i]['toilet_num']
                let toiletName = rows[i]['toilet_name']
                let x = rows[i]['x_wgs84']
                let y = rows[i]['y_wgs84']
                let addr_r = rows[i]['toilet_address_road']
                let addr_j = rows[i]['toilet_address_jibun']
                let toiletclass = rows[i]['toilet_class']
                let manager = rows[i]['toilet_manager']
                let phone = rows[i]['toilet_phone']
                let optime = rows[i]['toilet_optime']
                let disabled = rows[i]['toilet_disabled']
                let diaper = rows[i]['toilet_diaper']
                let cctv = rows[i]['toilet_cctv']

                console.log(num, toiletName, x, y)
            }
        }
    })
}


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