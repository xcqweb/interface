    
import Vue from 'vue';
import Router from 'vue-router';


Vue.use(Router);

const Preview = () => import("@views/preview.vue")
const Main = () => import("@views/main.vue")

let routes = [
    {
        path: '*',
        redirect: 'interface'
    }, {
        path: '/',
        redirect: 'interface'
    }, {
        path: 'interface',
        name: 'Interface',
        component: Main,
        meta: {
            "title": "界面工具"
        }
    },
    {
        path: 'interface_preview',
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