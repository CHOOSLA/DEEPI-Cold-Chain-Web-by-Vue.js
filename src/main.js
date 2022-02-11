import { createApp } from 'vue'
import App from './App.vue'
import axios from "axios";

//Base URL 설정
axios.defaults.baseURL = 'http://192.168.0.72:3000'


const app = createApp(App)
app.config.globalProperties.axios = axios;
app.config.globalProperties.tbRows;

app.mount('#app')





