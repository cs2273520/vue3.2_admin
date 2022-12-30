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

export const editMechansim = (data) => {
  return axios.request({
    url: '/api/editMechansim',
    method: 'post',
    data
  })
}

export const delMechansim = (data) => {
  return axios.request({
    url: '/api/delMechansim',
    method: 'post',
    data
  })
}

export const checkAuthority = (data) => {
  return axios.request({
    url: '/api/checkAuthority',
    method: 'post',
    data
  })
}

export const uploadImages = (data, data1) => {
  return axios.request({
    url: '/api/uploadImages',
    method: 'post',
    data,
    data1
  })
}
