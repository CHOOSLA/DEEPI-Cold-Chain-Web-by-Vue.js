<template>
  <div>
    <div id="map"></div>
    <p>위도 : {{ latitude }}</p>
    <p>경도 : {{ longitude }}</p>
    <input v-model="latitude" placeholder="위도값을 입력하세요" />
    <input v-model="longitude" placeholder="경도값을 입력하세요" />
    <button @click="setCenter(latitude, longitude)">이동하기</button>

    <div class="button-group">
      <button @click="changeSize(0)">Hide</button>
      <button @click="changeSize(800)">show</button>
      <button @click="displayMarker(markerPositions1)">marker set 1</button>
      <button @click="displayMarker(markerPositions2)">marker set 2</button>
      <button @click="displayMarker([])">marker set 3 (empty)</button>
      <button @click="displayInfoWindow">infowindow</button>
    </div>
  </div>

  <div>
    <p>IMEI 값을 입력하세요</p>
    <input v-model="message" placeholder="여기를 수정해보세요" />
    <button @click="connect">통신하기</button>
    <p>IMEI : {{ message }}</p>
  </div>

  <div>
    <vue-good-table
      :columns="columns"
      :rows="rows"
      theme="black-rhino"
      :lineNumbers="true"
      :search-options="{
        enabled: true,
      }"
    />
  </div>
</template>



<script>
// import the styles
import "vue-good-table-next/dist/vue-good-table-next.css";
import { VueGoodTable } from "vue-good-table-next";

export default {
  name: "KakaoMap",
  components: {
    VueGoodTable,
  },
  data() {
    return {
      map: null,
      positions: [],
      markerPositions1: [[36.7697899, 126.9317528]],
      markerPositions2: [
        [37.499590490909185, 127.0263723554437],
        [37.499427948430814, 127.02794423197847],
        [37.498553760499505, 127.02882598822454],
        [37.497625593121384, 127.02935713582038],
        [37.49629291770947, 127.02587362608637],
        [37.49754540521486, 127.02546694890695],
        [37.49646391248451, 127.02675574250912],
      ],
      markers: [],
      infowindow: null,
      latitude: "",
      longitude: "",

      message: "",
      columns: [
        {
          label: "IEMI",
          field: "IEMI",
        },
        {
          label: "Date",
          field: "Date",
          type: "number",
        },
        {
          label: "Time",
          field: "Time",
          type: "Number",
        },
        {
          label: "Longitude",
          field: "Longitude",
          type: "Number",
        },
        {
          label: "Latitude",
          field: "Latitude",
          type: "Number",
        },
      ],
      rows: [],
    };
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=6db55f0703cae9096eead2704bf932da";
      document.head.appendChild(script);
    }
  },
  methods: {
    initMap() {
      const container = document.getElementById("map");
      container.style.width = "800px";
      container.style.height = "800px";
      const options = {
        center: new kakao.maps.LatLng(36.7697899, 126.9317528),
        level: 5,
      };
      this.map = new kakao.maps.Map(container, options);
    },
    changeSize(size) {
      const container = document.getElementById("map");
      container.style.width = `${size}px`;
      container.style.height = `${size}px`;
      this.map.relayout();
    },
    displayMarker(markerPositions) {
      if (this.markers.length > 0) {
        this.markers.forEach((marker) => marker.setMap(null));
      }

      const positions = markerPositions.map(
        (position) => new kakao.maps.LatLng(...position)
      );

      if (positions.length > 0) {
        this.markers = positions.map(
          (position) =>
            new kakao.maps.Marker({
              map: this.map,
              position,
            })
        );

        const bounds = positions.reduce(
          (bounds, latlng) => bounds.extend(latlng),
          new kakao.maps.LatLngBounds()
        );

        this.map.setBounds(bounds);
      }
    },
    displayInfoWindow() {
      if (this.infowindow && this.infowindow.getMap()) {
        //이미 생성한 인포윈도우가 있기 때문에 지도 중심좌표를 인포윈도우 좌표로 이동시킨다.
        this.map.setCenter(this.infowindow.getPosition());
        return;
      }

      var iwContent = '<div style="padding:5px;">Hello World!</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
        iwPosition = new kakao.maps.LatLng(33.450701, 126.570667), //인포윈도우 표시 위치입니다
        iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      this.infowindow = new kakao.maps.InfoWindow({
        map: this.map, // 인포윈도우가 표시될 지도
        position: iwPosition,
        content: iwContent,
        removable: iwRemoveable,
      });

      this.map.setCenter(iwPosition);
    },
    setCenter(latitude, longitude) {
      // 이동할 위도 경도 위치를 생성합니다
      var moveLatLon = new kakao.maps.LatLng(latitude, longitude);

      var marker = new kakao.maps.Marker({
        position: moveLatLon,
      });

      // 지도 중심을 이동 시킵니다
      this.map.setCenter(moveLatLon);
      marker.setMap(this.map);
    },

    connect() {
      const formData = new FormData();
      formData.append("IEMI", this.message);
      this.axios
        .post("/api", formData)
        .then((res) => {
          var rows = res.data;
          this.rows = rows;
          console.log(rows);

          if (rows.length > 0) {
            console.log("하하");
            rows.forEach((row) => {
              var latitude, longitude;
              latitude = parseFloat(row.Latitude) / 10000000.0;
              longitude = parseFloat(row.Longitude) / 10000000.0;
              this.positions.push([latitude, longitude]);
            });

            this.displayMarker(this.positions);
          }
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  width: 400px;
  height: 400px;
}

.button-group {
  margin: 10px 0px;
}

button {
  margin: 0 3px;
}
</style>
