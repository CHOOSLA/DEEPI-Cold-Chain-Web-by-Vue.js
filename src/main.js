import { createApp } from 'vue'
import App from './App.vue'
import axios from "axios";

//Base URL 설정
axios.defaults.baseURL = 'http://deep-i.iptime.org:8000'


const app = createApp(App)

//전역변수
app.config.globalProperties.axios = axios;
app.config.globalProperties.tbRows;


app.mount('#app')





