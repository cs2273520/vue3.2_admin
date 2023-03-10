import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/index.scss'
import SvgIcon from '@/icons'
import 'element-plus/dist/index.css'
import '@/router/permission'
import '@/styles/iconfont.css'
import changeTime from './utils/filters'
const app = createApp(App)
changeTime(app)
SvgIcon(app)
app.use(store).use(router).mount('#app')
