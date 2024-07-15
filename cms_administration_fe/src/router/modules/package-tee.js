
import Layout from '@/layout'

const packageTeeRouter = {
  path: '/cms',
  component: Layout,
  name: 'Quản lý teetime',
  meta: {
    title: 'Quản lý teetime',
    icon: 'el-icon-user'
  },
  children: [
    {
      path: 'tee',
      component: () => import('@/views/manage-booking/teetime/List'),
      name: 'Quản lý Tee',
      meta: { title: 'Quản lý Tee' }
      // BOSS ONLY
    },
    {
      path: 'order-app',
      component: () => import('@/views/manage-booking/order-app/index'),
      name: 'OrderApp',
      meta: {
        title: 'Quản lý order app'
        // roles: ['role_master', 'role_admin', 'role_super_admin', 'role_statistic']
      }
    },
    {
      path: 'money-in-sale',
      component: () => import('@/views/manage-booking/money-in/MoneyInSale'),
      name: 'Quản lý tiền thu ( sale)',
      meta: { title: 'Quản lý tiền thu ( sale)' }
      // BOSS ONLY
    },
    {
      path: 'surcharge',
      component: () => import('@/views/manage-booking/surcharge/Index'),
      name: 'Quản lý phụ phí',
      meta: {
        title: 'Quản lý phụ phí',
        roles: ['role_super_master']
      }
    },
    {
      path: 'teetime',
      component: () => import('@/views/package-tee/ListPackage'),
      name: 'Quản lý gói bán',
      meta: { title: 'Quản lý gói bán', roles: ['role_master', 'role_admin', 'role_statistic', 'role_cs', 'role_tee_time'] }
    },
    {
      path: 'statistic',
      component: () => import('@/views/package-tee/Statistic'),
      name: 'Thống kê',
      meta: { title: 'Thống kê', roles: ['role_master', 'role_admin', 'role_statistic', 'role_cs', 'role_tee_time'] }
    },
    {
      path: 'category',
      component: () => import('@/views/manage-booking/category/index'),
      name: 'Category',
      meta: {
        title: 'Hạng mục'
        // roles: ['role_master', 'role_admin', 'role_super_admin', 'role_statistic']
      }
    },
    {
      path: 'data-user',
      component: () => import('@/views/manage-booking/data-user/index'),
      name: 'DataUser',
      meta: {
        title: 'Thông tin user'
        // roles: ['role_master', 'role_admin', 'role_super_admin', 'role_statistic']
      }
    },
    {
      path: 'history-log',
      component: () => import('@/views/manage-booking/history-log/index'),
      name: 'HistoryLog',
      meta: {
        title: 'Lịch sử log'
        // roles: ['role_master', 'role_admin', 'role_super_admin', 'role_statistic']
      }
    },
    {
      path: 'list-payment-point',
      component: () => import('@/views/manage-booking/list-payment/index'),
      name: 'ListPaymentPoint',
      meta: {
        title: 'Danh sách giao dịch'
        // roles: ['role_master', 'role_admin', 'role_super_admin', 'role_statistic']
      }
    }
  ]
}
export default packageTeeRouter
