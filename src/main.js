import Vue from 'vue'
import App from './app.vue'
import router from './router'
import './assets/less/theme.less'
import './directives/directive'
import './filters/filter'
import urls from './constants/url'
import requestUtil from './services/request'
import 'iview/dist/styles/iview.css'
import {i18n} from '@/common/i18n'

import 'echarts'
import VueECharts from 'vue-echarts'

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
    render: h => h(App),
}).$mount('#app')
