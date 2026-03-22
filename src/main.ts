import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { vClickOutside } from './directives/click-outside'
import './style.css'

const app = createApp(App)
app.directive('click-outside', vClickOutside)
app.use(router)
app.mount('#app')
