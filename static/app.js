const mapContainer = document.getElementById("map"); // 지도를 표시할 div
const mapOption = {
  center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
  level: 3, // 지도의 확대 레벨
};

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
      url: "http://openapi.seoul.go.kr:8088/6b716f6a533439343237426a4d7a75/json/SearchPublicToiletPOIService/1/30/",
      data: {},
      success: function (response) {
        // api 성공시 로직

        // 화장실 데이터 리스트 생성
        const data = response["SearchPublicToiletPOIService"]["row"];
        let positions = [];

        for (var i in data) {
          const position = {};
          position["FNAME"] = data[i]["FNAME"];
          position["latlng"] = new kakao.maps.LatLng(
            data[i]["Y_WGS84"],
            data[i]["X_WGS84"]
          );
          positions.push(position);
        }

        // 화장실 마커 생성
        if (positions.length > 0) {
          var imageSrc =
            "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

          for (var i = 0; i < positions.length; i++) {
            // spread
            const { FNAME, latlng } = positions[i];

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

    // // 지도 이동 시 center 좌표 받아오기
    // kakao.maps.event.addListener(map, "drag", function () {
    //   // 지도의 중심좌표를 얻어옵니다
    //   var latlng = map.getCenter();

    //   var message = "<p>지도를 드래그 하고 있습니다</p>";
    //   message +=
    //     "<p>중심 좌표는 위도 " +
    //     latlng.getLat() +
    //     ", 경도 " +
    //     latlng.getLng() +
    //     "입니다</p>";

    //   var resultDiv = document.getElementById("result");
    //   resultDiv.innerHTML = message;
    // });
  });
}

function toiletLoc(callback) {
  //geolocation API 시작
  navigator.geolocation.getCurrentPosition(function (position) {
    var lat = position.coords.latitude, // 위도
      lon = position.coords.longitude; // 경도

    var locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다

    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);

    // 마커와 인포윈도우를 표시합니다
    console.log(locPosition);

    // addr2coord 를 활용해 공공화장실 API 에서 도로명주소 필드명을 for문 돌리고 wgx84좌표 수집 -> 지도에 marker 표시
  });

  //테스트용 화장실 좌표정보 API ajax GET
  $.ajax({
    type: "GET",
    url: "http://openapi.seoul.go.kr:8088/6b716f6a533439343237426a4d7a75/json/SearchPublicToiletPOIService/1/5/",
    data: {},
    success: function (response) {
      let positions = [];
      var data = response["SearchPublicToiletPOIService"]["row"];
      for (var i in data) {
        var position = {};
        position["FNAME"] = data[i]["FNAME"];
        position["latlng"] = new kakao.maps.LatLng(
          data[i]["X_WGS84"],
          data[i]["Y_WGS84"]
        );
        positions.push(position);
      }
      console.log(positions);
    },
  });
}

function getcoords() {
  $.ajax({
    type: "GET",
    url: "http://openapi.seoul.go.kr:8088/6b716f6a533439343237426a4d7a75/json/SearchPublicToiletPOIService/1/5/",
    data: {},
    success: function (response) {
      let positions = [];
      var data = response["SearchPublicToiletPOIService"]["row"];
      for (var i in data) {
        var position = {};
        position["FNAME"] = data[i]["FNAME"];
        position["latlng"] = new kakao.maps.LatLng(
          data[i]["X_WGS84"],
          data[i]["Y_WGS84"]
        );
        positions.push(position);
      }
      console.log(positions);
    },
  });
}

function getJSON() {
  $.ajax({
    type: "GET",
    url: "http://localhost:5000/data/toiletloc.json",
    data: {},
    success: function (response) {
      console.log(response["DATA"]);
    },
  });
}

// mongoDB에 POST 기능
function inputDB() {
  let content = $("#contentInput").val();

  $.ajax({
    type: "POST",
    url: "/naturecallsme",
    data: { content_give: content },
    success: function (response) {
      alert(response["msg"]);
      window.location.reload();
    },
  });
}
