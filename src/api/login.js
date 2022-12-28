import axios from './request'
export const login = (data) => {
  return axios.request({
    url: '/api/Login',
    method: 'post',
    data
  })
}
