import axios from 'axios'

//create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000
})

//请求拦截
service.interceptors.request.use(
  config => {
    // 如果有token 就设置 Authorization
    localStorage.token && (config.headers.Authorization = "Bearer " + localStorage.token || "");
    return config;
  },
  error => {
    return Promise.reject(error);
  })


//响应拦截
service.interceptors.response.use(
  response => {
    const res = response.data
    return Promise.resolve(res)
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
