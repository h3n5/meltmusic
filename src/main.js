import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Layout, Icon, Menu, Tabs, Message, Empty, Button, Card } from 'ant-design-vue'
import VueLazyload from 'vue-lazyload'
import utils from '@/utils/index'
Vue.use(VueLazyload, {
  lazyComponent: true,
  preLoad: 1.3,
  error: require('./assets/img/player-bar.png'),
  loading: require('./assets/img/player-bar.png'),
  attempt: 1
})
Vue.use(Button)
Vue.use(Layout)
Vue.use(Icon)
Vue.use(Menu)
Vue.use(Tabs)
Vue.use(Empty)
Vue.use(Card)
Vue.prototype.$message = Message
Vue.config.productionTip = false
Vue.prototype.$music = utils.Auplayer
Vue.prototype.$utils = utils
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
