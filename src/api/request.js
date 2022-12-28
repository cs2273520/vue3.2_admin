// 第一步只是拿到了 htttpRequest的这样一个类
import HttpRequest from './axios'
// 第二步只是把类的constructor执行了 拿到了一个 执行了constructor的类的实例
const axios = new HttpRequest()
// console.log('apiindex axios',axios)

export default axios
