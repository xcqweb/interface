import axios from 'axios';
import urls from '../constants/url';
import {getCookie, setCookie} from './Utils'
axios.defaults.timeout = 60 * 1000 * 5; //响应超时时间          
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'; //配置请求头
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'; //配置请求头
const isDev = process.env.NODE_ENV === 'development'
if(isDev) {
    axios.defaults.baseURL = urls.testBaseUrl.url  //配置接口地址
} else {
    axios.defaults.baseURL = urls.baseUrl.url   //配置接口地址
} 


//请求拦截器
axios.interceptors.request.use(
    config => {
        const token = "Bearer " + getCookie('token')
        if(token) {
            config.headers.Authorization = token
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
);
 
 
//添加响应拦截器
axios.interceptors.response.use((res) =>{
    return Promise.resolve(res)
}, (error) => {
    if (error.response) {
        if (error.response.status == 418) {
            let refreshToken = getCookie('refreshToken')
            post('api/auth/refreshToken', {refreshToken}).then(res => {
                setCookie('token', res.token)
                setCookie('refreshToken', res.refreshToken)
                error.response.config.headers.Authorization = 'Bearer ' + res.token
                axios.request(error.response.config)
            })
            return
        }
    }
    return Promise.reject(error)
})
function dealRequest(url,params,funName,isLoading) {
    return new Promise((resolve, reject) => {
        //let loading;
        if(isLoading) {
            /*  loading = Loading.service({
                lock: true,
                text: '努力加载中，请稍等...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            }); */
        }
        axios[funName](url, params)
            .then(response => {
                if(isLoading) {
                    //loading.close();
                }
                resolve(response.data);
            },(err)=>{
                reject(err);
                // Message.warning('系统繁忙！')
                // console.log(err)
                // return false
                // if(isLoading) {
                //     //loading.close();
                // }
            })
            .catch((err) => {
                console.log(err)
                if(isLoading) {
                    //loading.close();
                }
            })
    })
}

//返回一个Promise(发送post请求)
function post(url, params,isLoading = true) {
    return dealRequest(url,params,"post",isLoading);
}
//返回一个Promise(发送get请求)
function get(url,params,isLoading = true) {
    return dealRequest(url, {params},"get",isLoading);
}
//返回一个Promise(发送put请求)
function put(url, params, isLoading = true) {
    return dealRequest(url, params, "put", isLoading);
}
//返回一个Promise(发送delete请求)
function Delete(url, params, isLoading = true) {
    return dealRequest(url, {params}, "delete", isLoading);
}
export default {
    post,
    get,
    put,
    delete: Delete
}