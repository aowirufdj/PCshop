import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './lang/index.js'
import cookie from 'vue-cookies'
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: cookie.get('lang') || 'cn',
  messages
})

export default i18n
