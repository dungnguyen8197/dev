import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

import accountRouter from '@/router/modules/account'
import hioRouter from '@/router/modules/hio'
import ManageBookingRouter from '@/router/modules/manage-booking'
// import customer from '@/router/modules/customer'
import bookingRouter from '@/router/modules/booking'
// import agencyRouter from '@/router/modules/agency'
// import membershipRouter from '@/router/modules/membership'
import advertisementRouter from '@/router/modules/advertisement'
// import voucherRouter from '@/router/modules/voucher'
import partnerServiceRouter from '@/router/modules/partner-service'
import physicalDamegeInsuranceRouter from '@/router/modules/physicalDamegeInsurance'
// import eventRouter from '@/router/modules/event'
import packageTeeRouter from '@/router/modules/package-tee'
import revenueSaleRouter from '@/router/modules/revenue-sale'
import wapBankRouter from '@/router/modules/wap-bank'
// import quoteRouter from '@/router/modules/create-quote'
import historyRouter from '@/router/modules/history'
import supplierRouter from '@/router/modules/supplier'
// import orderInvoice from '@/router/modules/order-invoice'

// import dashboardRouter from '@/router/modules/dashboard'
// import clubRouter from '@/router/modules/club'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    name: 'redirect',
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    name: 'auth-redirect',
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    name: '401',
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/certificate-item/:id(\\d+)',
    component: () => import('@/views/HIO/certificate/certificateItem'),
    hidden: true,
    name: 'Certificate Item',
    meta: { title: 'Chứng nhận mua bảo hiểm vật chất', icon: 'verified' }
  },
  {
    path: '/certificate-new/:id(\\d+)',
    component: () => import('@/views/booking/bill/components/certificateInsuranceNew'),
    hidden: true,
    name: 'Certificate Insurance New',
    meta: { title: 'Chứng nhận mua bảo hiểm', icon: 'verified' }
  },
  {
    path: '/contract',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/contract',
        component: () => import('@/views/supplier/manage_supplier/components/ScreenContract'),
        name: 'Contract',
        meta: { hide: true, hideUser: true, hide_cart: true, noCache: true, title: ('Thông tin hợp đồng') }
      }
    ]
  },
  {
    path: '/supplier-info',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/supplier-info',
        component: () => import('@/views/supplier/manage_supplier/components/ScreenDetail'),
        name: 'Supplier',
        meta: { hide: true, hideUser: true, hide_cart: true, noCache: true, title: 'Thông tin nhà cung cấp' }
      }
    ]
  },
  {
    path: '/supplier-permission-info',
    component: Layout,
    hidden: true,
    children: [
      {
        name: 'Permission Info',
        path: '',
        component: () => import('@/views/supplier/manage_permission/components/EditPermission'),
        meta: { hide: true, hideUser: true, hide_cart: true, noCache: true, title: 'Thông tin quyền' }
      }
    ],
    props: true
  },
  {
    path: '/top-sale-info',
    component: Layout,
    hidden: true,
    children: [
      {
        name: 'Top Sale Info',
        path: '',
        component: () => import('@/views/supplier/supplier_statistics/components/TopSale'),
        meta: { hide: true, hideUser: true, hide_cart: true, noCache: true, title: 'Thông tin sale' }
      }
    ],
    props: true
  },
  {
    path: '/statistic-supplier-all',
    component: Layout,
    hidden: true,
    children: [
      {
        name: 'Statistic Supplier All',
        path: '',
        component: () => import('@/views/supplier/supplier_statistics/components/StatisticSupplierAll'),
        meta: { hide: true, hideUser: true, hide_cart: true, noCache: true, title: 'Thống kê ncc' }
      }
    ],
    props: true
  },
  {
    path: '/warehouse-info',
    component: Layout,
    hidden: true,
    children: [
      {
        name: 'Warehouse Info',
        path: '',
        component: () => import('@/views/supplier/manage_warehouse/warehouse_product/components/WarehouseInfo.vue'),
        meta: { hide: true, hideUser: true, hide_cart: true, noCache: true, title: 'Thông tin xuất nhập hàng' }
      }
    ],
    props: true
  }
  // {
  //   path: '/profile',
  //   component: Layout,
  //   redirect: '/profile/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Profile',
  //       meta: { title: 'Profile', icon: 'user', noCache: true }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // dashboardRouter,
  accountRouter,
  ManageBookingRouter,
  bookingRouter,
  packageTeeRouter,
  // customer,
  // agencyRouter,
  hioRouter,
  // membershipRouter,
  advertisementRouter,
  // voucherRouter,
  partnerServiceRouter,
  physicalDamegeInsuranceRouter,
  // eventRouter,
  revenueSaleRouter,
  wapBankRouter,
  // quoteRouter,
  historyRouter,
  supplierRouter,
  // orderInvoice,
  // clubRouter,
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
