    
import Vue from 'vue';
import Router from 'vue-router';


Vue.use(Router);

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

export default new Router({
    mode:'history',
    routes:routes,
})