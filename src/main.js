import { createApp } from 'vue'
import App from './App.vue'
import "bootstrap-icons/font/bootstrap-icons.css"
// import router from "./router"
import store from './store'



const app=createApp(App)
app.mount('#app')
app.use(store)
// app.use(router)

