import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import request from '@/apis'

Vue.use(ElementUI)

Vue.prototype.$http = request
Vue.config.productionTip = false
Vue.prototype.$eventBus = new Vue()
require('@/assets/css/base.css');


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
