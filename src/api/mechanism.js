import axios from './request'

export const getMechanism = (params) => {
  return axios.request({
    url: '/api/getMechanism',
    params
  })
}
export const addMechansim = (data) => {
  return axios.request({
    url: '/api/addMechansim',
    method: 'post',
    data
  })
}
