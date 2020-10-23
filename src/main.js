import Vue from 'vue'
import App from './app.vue'
import router from './router'
import store from './store'
import 'iview/dist/styles/iview.css'
import './assets/less/theme.less'
import './directives/directive'
import './filters/filter'
import urls from './constants/url'
import requestUtil from './services/request'
import {i18n} from '@/common/i18n'
import 'echarts'
import VueECharts from 'vue-echarts'
import {Switch,Checkbox,Input,Select,Option} from 'iview'
Vue.component('i-switch', Switch)
Vue.component('i-checkbox', Checkbox)
Vue.component('i-input', Input)
Vue.component('i-select', Select)
Vue.component('i-option', Option)


import './services/Utils'

import './assets/css/style'
import './assets/css/common'
import './assets/css/grapheditor'
import './assets/css/preview'

Vue.component('v-chart', VueECharts)


Vue.config.productionTip = false
Vue.prototype.router = router;
Vue.prototype.urls = urls;
Vue.prototype.requestUtil = requestUtil;
new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
