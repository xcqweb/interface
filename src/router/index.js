    
import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/'
const isDev = process.env.NODE_ENV === 'development'
window.PREFIX_PATH = isDev ? '' : '/interface'


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
  // base: '/iot/'
})
router.beforeEach((to,from,next)=>{
  store.commit('clearToken') // 取消请求
  next()
})
export default router
