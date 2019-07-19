    
import Vue from 'vue';
import Router from 'vue-router';


Vue.use(Router);

const Preview = () => import("@views/preview.vue")
const Main = () => import("@views/main.vue")

let routes = [
    {
        path: '*',
        redirect: '/main'
    }, {
        path: '/',
        redirect: '/main'
    }, {
        path: '/main',
        name: 'main',
        component: Main,
        meta: {
            "title": "工程主页"
        }
    },
    {
        path: '/preview',
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