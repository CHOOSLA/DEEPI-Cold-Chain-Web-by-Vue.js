<template>
  <div id="app">
    <KakaoMap />
  </div>
  <br />
  <br />
  <br />
  <hr />
  <div id="app2">
    <DataTable />
  </div>
</template>

<script>
import KakaoMap from "./components/KakaoMap";
//mport DataTable from "./components/DataTable";

export default {
  name: "App",
  components: {
    KakaoMap,
    // DataTable,
  },
};
</script>
