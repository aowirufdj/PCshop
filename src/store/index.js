import Vue from 'vue'
import Vuex from 'vuex'
import cookie from 'vue-cookies'
import {publicPost} from "../api/index.js";
Vue.use(Vuex)
console.log(cookie.get('lang'));
export default new Vuex.Store({
  state: {
    lang: cookie.get('lang') || 'cn',
    showLogin: false,
    cartNum:0,
    order:{},
    newAdd:0,
    // 详情页的刷新
    keyReload:true,
    hideAppDown: false,
    collectList:[],
    loading: false,
    user: cookie.get('user') || {},
  },
  mutations: {
    switchLang(state, lang){
      state.lang = lang;
      cookie.set('lang', lang);
    },
    closeLog(state,log){
      state.showLogin = log;
    },
    login(state,user){
      state.user = user;
    },
    logOut(state){
      state.user = {};
      state.cartNum = 0;
    },
    changeCartNum(state,num){
      state.cartNum = num;
    },
    changeCollect(state,arr){
      state.collectList = arr;
    },
  },
  actions: {
    // 购物车数量
    getCartNum({state,commit}){
      publicPost('cart/getGoodsCount',[{id:state.user.id},{token:state.user.token}]).then((res) => {
        if(res.data.code==0) {
          commit('changeCartNum',res.data.data)
        }
      })
    },
    // 收藏的id
    getCollects({state,commit}){
      publicPost('user/getCollectsArr',[{id:state.user.id},{token:state.user.token}]).then((res) => {
        if(res.data.code==0) {
          commit('changeCollect',res.data.data)
        }
      })
    }
  },
  modules: {
  }
})
