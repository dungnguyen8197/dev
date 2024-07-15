import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import supplierListMenu from '@/utils/supplier'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

// router.addRoutes(asyncRoutes)

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // nếu đã đăng nhập, hãy chuyển hướng đến trang chủ
      next({ path: '/t99' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // xác định xem người dùng đã nhận được các vai trò quyền của mình thông qua getInfo hay chưa
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // lấy thông tin người dùng
          // lưu ý: các vai trò phải là một mảng đối tượng! chẳng hạn như: ['admin'] hoặc, ['developer', 'editor']

          const { roles, email, name, phone } = await store.dispatch('user/getInfo')
          console.log('roles.....................', roles)

          const listMenuSupplier = await supplierListMenu({ email: email, name: name, phone: phone })
          if (listMenuSupplier) {
            roles.push(...listMenuSupplier.map(item => 'NCC' + item.menu_id))
          }
          // tạo bản đồ các tuyến đường có thể truy cập dựa trên các vai trò
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          console.log('accessRoutes.....................', accessRoutes)

          if (roles.length === 0) {
            NProgress.done()
            Message.error('Tài khoản không có roles')
          } else {
            router.addRoutes(accessRoutes)

            // phương pháp hack để đảm bảo rằng addRoutes đã hoàn tất
            // đặt thay thế: true, vì vậy điều hướng sẽ không để lại hồ sơ lịch sử
            next({ ...to, replace: true })
          }

          // console.log('routesAdded...................................', store.getters.routesAdded)
          // if (!store.getters.routesAdded) {
          //   console.log('.............................................................................................................')
          //   const accessRoutes = await store.dispatch('permission/generateRoutes')
          //   console.log('accessRoutes//////////', accessRoutes)
          //   accessRoutes.map(route => {
          //     router.addRoute(route)
          //   })
          //   next(to.path)
          // } else {
          //   next()
          // }

          // // next({ ...to, replace: true })
          // NProgress.done()
          // }
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
