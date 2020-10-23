    
import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/'
const isDev = process.env.NODE_ENV === 'development'
const isUat = true
window.PREFIX_PATH = isDev ? '' : isUat ? '/iot/interface' : '/interface'
// window.PREFIX_PATH = '/iot/interface'
window.API_PREFIX = isUat ? 'iot' : ''

Vue.use(Router)

const Preview = () => import("@views/preview.vue")
const Main = () => import("@views/main.vue")

let routes = [
  {
    path: '*',
    redirect: window.PREFIX_PATH + '/interface'
  }, {
    path: '/',
    redirect: window.PREFIX_PATH + '/interface'
  }, {
    path: window.PREFIX_PATH + '/interface',
    name: 'Interface',
    component: Main,
    meta: {
      "title": "界面工具"
    }
  },
  {
    path: window.PREFIX_PATH + '/interface_preview',
    name: 'Preview',
    component: Preview,
    meta: {
      "title": "预览"
    }
  },
]
const router = new Router({
  mode:'history',
  routes:routes,
  // base: process.env.NODE_ENV === 'tanent-uat' ? '/iot' : ''
})
router.beforeEach((to,from,next)=>{
  store.commit('clearToken') // 取消请求
  next()
})
export default router
