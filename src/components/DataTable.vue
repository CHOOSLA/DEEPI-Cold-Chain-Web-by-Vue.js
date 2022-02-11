<template>
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

// add to component

export default {
  name: "test",
  components: {
    VueGoodTable,
  },
  mounted() {},

  data() {
    return {
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

  methods: {
    connect() {
      const formData = new FormData();
      formData.append("IEMI", this.message);
      this.axios
        .post("/api", formData)
        .then((res) => {
          this.rows = res.data;
          console.log(res);
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>