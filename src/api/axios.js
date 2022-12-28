// 开始封装企业级的axios   全http状态码和内部错误码状态双从拦截分装
import axios from 'axios'
import { ElMessage } from 'element-plus'
// import store from '../store/index'
const baseURL = 'http://localhost:3003'

// 开始写一个类  去深层分装
class HttpRequest {
  constructor(baseUrl = baseURL) {
    // 把上面的baseURL 给了类的小驼峰的baseUrl
    this.baseUrl = baseUrl
    // 第二步queue一个对象  这个东西可以把axios请求压入队列的对象
    this.queue = {
      // 'http://127.0.0.1:8888/kuayu':true,
      // 'http://127.0.0.1:8888/kuayu2':true
    }
  }

  // 设置axios请求的初始值
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      }
    }
    return config
  }

  // 销毁多个axios 队列请求后 然后把全局loading消失
  distroy(url) {
    delete this.queue[url]
    // if (!Object.keys(this.queue).length) {
    //     store.commit('changeloading', false)
    // }
  }

  //  请求拦截设置 http://127.0.0.1:8888/kuayu2
  // 拦截器包含  请求拦截 和响应拦截
  interceptors(instance, url) {
    // console.log(' interceptors instance', instance)
    // console.log(' interceptors url', url)
    // 请求拦截设置
    instance.interceptors.request.use(
      (config) => {
        config.headers.Authorization = localStorage.getItem('token')
        // if (!Object.keys(this.queue).length) {
        // store.commit('changeloading', true)
        // }
        // this.queue[url] = true
        return config
      },
      (error) => {
        return Promise.reject(new Error(error))
      }
    )

    // 响应拦截设置
    // res.status(403).send({
    //     // 4000代码代表这个用户 很危险 曾经多次尝试攻击我们服务器
    //     //多次没权限想翻墙攻击我们
    //     code:'4000',
    //     data:'可能存在什么错误哦'
    //   })
    instance.interceptors.response.use(
      (res) => {
        // res.status(200).send({
        //     code:'6102',
        //     data:'我是数据666'
        //   })
        // console.log('进入了axios封装的响应拦截')
        // console.log('res', res)
        // 把请求回来的url数据销毁
        // this.distroy(url)
        // const { data, meta } = res.data
        if (res.data.status === 200 || res.data.status === 201) {
          return res.data
        } else {
          // console.log(res)
          ElMessage.error(res.data.info)
          // return Promise.reject(new Error(res.info))
        }
        // return res.data
      },
      (error) => {
        // console.log('进入响应拦截response err里面')
        console.log('error', error.response)
        //   var err  ={
        //         config:[],
        //         data:{

        //         },
        //         message:'qingi'
        //     }
        // this.distroy(url)
        if (error && error.response) {
          switch (error.response.status) {
            case 400:
              error.message = '请求错误噢 '
              break
            case 401:
              error.message = '未授权，请登录'
              break
            case 403:
              error.message = '拒绝访问'
              break
            case 404:
              error.message = '请求地址出错'
              break
            case 408:
              error.message = '请求超时'
              break
            case 500:
              error.message = '服务器内部错误'
              break
            case 501:
              error.message = '服务未实现'
              break
            case 502:
              error.message = '网关错误'
              break
            case 503:
              error.message = '服务不可用'
              break
            case 504:
              error.message = '网关超时'
              break
            case 505:
              error.message = 'HTTP版本不受支持'
              break
            default:
          }
        }
        error.response && ElMessage.error(error.response.data)
        return Promise.reject(new Error(error.response.data))
        // return Promise.reject(err)
      }
    )
  }

  request(options) {
    // 进来之后创建一个axios的实例 给奥 instance  新的axios 创建了新的axios
    const instance = axios.create()
    // var a =  {
    //     baseURL: http://localhost:3003,
    //     url: '/axiosget1',
    //     method: 'get',
    //     params: {
    //         a: '1'
    //     }

    // }
    options = Object.assign(this.getInsideConfig(), options)
    // 要给这个实例的axios 就是instance 传值 为了部署它的请求拦截 和响应拦截
    this.interceptors(instance, options.url)
    //    return的时候  instance 已经被感染一遍了 被请求拦截器 响应拦截器 感染了
    return instance(options)
  }
}

export default HttpRequest
