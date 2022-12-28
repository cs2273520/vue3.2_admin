import { login as loginApi } from '@/api/login'
import router from '@/router'
export default {
  namespaced: true,
  state: () => ({
    token: localStorage.getItem('token') || '',
    siderType: true
  }),
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    changeSiderType(state) {
      state.siderType = !state.siderType
    }
  },
  actions: {
    login({ commit }, userInfo) {
      // eslint-disable-next-line promise/param-names
      return new Promise((reslove, reject) => {
        loginApi(userInfo)
          .then((res) => {
            commit('setToken', res.data._token)
            router.replace('/')
            reslove()
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
}
