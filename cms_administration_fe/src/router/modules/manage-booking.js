import Layout from '@/layout'

const manageBookingRouter = {
  path: '/manage-booking',
  component: Layout,
  name: 'Booking',
  meta: {
    title: 'Booking',
    icon: 'el-icon-collection',
    roles: ['role_master', 'role_admin', 'role_super_admin', 'role_statistic', 'role_tee_time', 'role_cs']
  },
  children: [
    {
      path: 'statistic',
      component: () => import('@/views/manage-booking/statistic'),
      name: 'Quản lý thu',
      meta: {
        title: 'Quản lý thu',
        roles: ['role_master', 'role_admin', 'role_super_admin', 'role_statistic']
      }
      // BOSS ONLY
    },
    {
      path: 'expense',
      component: () => import('@/views/manage-booking/expense'),
      name: 'Quản lý chi',
      meta: {
        title: 'Quản lý chi',
        roles: ['role_master', 'role_admin', 'role_super_admin', 'role_statistic']
      }
      // BOSS ONLY
    },
    {
      path: 'money-in',
      component: () => import('@/views/manage-booking/money-in/MoneyIn'),
      name: 'Quản lý tiền thu ( màn kế toán)',
      meta: {
        title: 'Quản lý tiền thu ( màn kế toán)',
        roles: ['role_master', 'role_admin', 'role_super_admin', 'role_statistic']
      }
      // BOSS ONLY
    },
    {
      path: 'money-out',
      component: () => import('@/views/manage-booking/money-out/MoneyOut'),
      name: 'Quản lý tiền chi',
      meta: {
        title: 'Quản lý tiền chi',
        roles: ['role_master', 'role_admin', 'role_super_admin', 'role_statistic']
      }
      // BOSS ONLY
    },
    {
      path: 'day-debt',
      component: () => import('@/views/manage-booking/day-debt/Index'),
      name: 'Danh sách admin có công nợ',
      meta: {
        title: 'Danh sách admin có công nợ',
        roles: ['role_master', 'role_admin', 'role_super_admin', 'role_statistic']
      }
    },
    {
      path: 'supplier',
      component: () => import('@/views/manage-booking/supplier'),
      name: 'Quản lý nhà cung cấp',
      meta: {
        title: 'Quản lý nhà cung cấp',
        roles: ['role_master', 'role_admin', 'role_super_admin', 'role_statistic']
      }
    },
    {
      path: 'agency-list',
      component: () => import('@/views/manage-booking/agency/List'),
      name: 'List Agency',
      meta: { title: 'Quản lý đại lý' }
    }
    // {
    //   path: 'expense',
    //   component: () => import('@/views/manage-booking/expense'),
    //   name: 'Quản lý chi',
    //   meta: { title: 'Quản lý chi', roles: ['boss'] }
    //   // BOSS ONLY
    // }
  ]
}
export default manageBookingRouter
