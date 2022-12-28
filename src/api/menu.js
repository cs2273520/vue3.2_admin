import axios from './request'

export const menuList = () => {
  return axios.request({
    url: '/api/menus'
  })
}
