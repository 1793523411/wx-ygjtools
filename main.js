import Vue from 'vue'
import App from './App'
import store from './store'

import index from './pages/index/index/index.vue'
Vue.component('index',index)

import user from './pages/user/user/user.vue'
Vue.component('user',user)

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

Vue.prototype.$store = store;

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

 



