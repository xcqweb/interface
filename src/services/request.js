import axios from 'axios';
import urls from '../constants/url';
import {getCookie, setCookie} from './Utils'
import store from '../store/index';
axios.defaults.timeout = 60 * 1000 * 5; //响应超时时间          
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'; //配置请求头
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'; //配置请求头
const isDev = process.env.NODE_ENV === 'development'
if(isDev) {
  axios.defaults.baseURL = urls.testBaseUrl.url  //配置接口地址
} else {
  axios.defaults.baseURL = '/iot/' + urls.baseUrl.url   //配置接口地址
} 
// 是否正在刷新的标记
let isRefreshing = false
// 重试的请求队列，每一项将是一个待执行的函数形式
let requests = []


const CancelToken = axios.CancelToken
//请求拦截器
axios.interceptors.request.use(
  config => {
    config.cancelToken = new CancelToken((cancel)=> {//此处设置，便于在切换路由时候，请求还未完成，就取消请求
      store.commit('pushToken', {
        cancelToken: cancel,
      });
    });
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
      if (!isRefreshing) {
        isRefreshing = true
        let refreshToken = getCookie('refreshToken')
        return post('api/auth/refreshToken', {refreshToken}).then(res => {
          setCookie('token', res.token)
          setCookie('refreshToken', res.refreshToken)
          error.response.config.headers.Authorization = 'Bearer ' + res.token
          //其他保存的待请求的接口
          requests.forEach(cb => cb( res.token))
          return axios.request(error.response.config)
        }).finally(()=>{
          requests = []
          isRefreshing = false
        })
      }
      //其他的418请求
      // 正在刷新token，将返回一个未执行resolve的promise
      return new Promise(resolve => {
        requests.push((token)=>{
          error.response.config.headers.Authorization = 'Bearer ' + token
          resolve(axios.request(error.response.config))
        })
      })
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