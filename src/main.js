// import 'babel-polyfill'
import Vue from 'vue'
import VueProgressBar from 'vue-progressbar'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import {List} from "vant";
import i18n from './i18n/i18n'
import VueCookies from 'vue-cookies'
import { Skeleton } from 'vant';
import './assets/css/init.css'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.use(List)
Vue.use(Skeleton);
Vue.use(VueCookies);
Vue.use(VueProgressBar, {
  color: '#97f7f9',  // 进度条颜色
  failedColor: 'red', // 失败显示的颜色
  height: '2px'  // 进度条高度
})
// 设置cookie 30天失效
Vue.$cookies.config('30d');
import '@vant/touch-emulator';
Vue.prototype.$host = 'https://api.amandacat.shop/';
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if(to.meta.requireLogin){
    if (!VueCookies.get('user')){
      next({ name: 'Home' });
      store.commit('closeLog',true);
    } else {
      next();
    }
  } else {
    next();
  }
})
var app55 =  new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

export default app55;
