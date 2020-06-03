
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import {getCookie} from '../../services/Utils'
import en from './language/en'
import zh from './language/zh'
import viewEn from 'iview/dist/locale/en-US';
import viewZh from 'iview/dist/locale/zh-CN';
Vue.use(VueI18n)
Vue.locale = () => {};
let language = getCookie('language')
language = language || 'zh'

export const i18n = new VueI18n({
  locale: language,
  messages: {
    en: {
      ...en,
      ...viewEn,
    },
    zh: {
      ...zh,
      ...viewZh,
    },
  },
  silentTranslationWarn: true
})

