<template>
  <div id="app">
    <KakaoMap />
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
