// import { login, logout, getInfo } from '@/api/user'
import { getInformation, login, logout, getAllAdmin } from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  setAcountInfo,
  removeAccountInfo,
  removeAdmin,
  setAdmin,
  setRefreshToken,
  setAllAdmin,
  removeAllAdmin,
  setPermissions
} from '@/utils/auth'
import router, { resetRouter } from '@/router'
import axios from 'axios'
import { pluck } from '@/utils/collection'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ACCOUNT_ID: (state, accountID) => {
    state.accountID = accountID
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { phone, code } = userInfo
    return new Promise((resolve, reject) => {
      removeAdmin()
      login({ phone: phone.trim(), code: code }).then(response => {
        const { token, refreshToken } = response.data
        commit('SET_TOKEN', token)
        setToken(token)
        // set refresh token
        setRefreshToken(refreshToken)

        // set All Admin
        getAllAdmin().then(res => {
          console.log('res--------------------admin', res)
          removeAllAdmin()
          if (res.error_code === 0) {
            setAllAdmin(res.data)
          }
        })
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info-
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInformation(state.token).then(res => {
        removeAccountInfo()

        const admin = res.data
        const account = {
          ...admin,
          user_name: admin.name
        }
        setAdmin(account)
        commit('SET_ROLES', admin.role_admin)
        if (res.error_code === 0) {
          console.log(admin, 'getInfo')
          // getListMenuItem({ email: res.data.email, name: res.data.name, phone: res.data.phone }).then(res => {
          //   const admin = res.token
          //   if (res.error === 0) {
          //     setTokenListMenuItem(admin)
          //   }
          //   resolve(res)
          // }).catch(error => {
          //   reject(error)
          // })
          commit('SET_AVATAR', 'https://s3.kstorage.vn/public/default-user.png')
          commit('SET_ACCOUNT_ID', account.id)
          commit('SET_INTRODUCTION', account)

          const roles = pluck('name', admin.role_admin)
          // const permissions = pluck('permission_name', admin.permissions)

          // roles = roles.concat(permissions)
          setPermissions(admin.role_admin?.map((p) => p.name) || [])
          setAcountInfo(account)

          const data = {
            phone: res.data.phone,
            email: res.data.email,
            name: res.data.name,
            roles: roles
          }

          resolve(data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        removeToken()
        removeAllAdmin()
        removeAccountInfo()
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true }) // ,roles
    // dynamically add accessible routes
    console.log('accessRoutes', accessRoutes)
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
