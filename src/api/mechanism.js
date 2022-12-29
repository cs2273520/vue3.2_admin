import axios from './request'

export const getMechanism = (params) => {
  return axios.request({
    url: '/api/getMechanism',
    params
  })
}
